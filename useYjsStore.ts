import {
    InstancePresenceRecordType,
    TLAnyShapeUtilConstructor,
    TLInstancePresence,
    TLRecord,
    StoreSnapshot,
    TLStoreWithStatus,
    computed,
    createPresenceStateDerivation,
    createTLStore,
    defaultShapeUtils,
    defaultUserPreferences,
    getUserPreferences,
    setUserPreferences,
    react,
    transact,
} from "@tldraw/tldraw";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_STORE } from "./default_store";

import { TlDrawSyncedStorage } from "synced-store"

/**
 * sync the tldraw store with a yjs doc
 * @param param
 * @returns the tldraw store and its status
 */
export function useYjsStore({
    roomId = "roomid-example1112",
    hostUrl = "wss://demos.yjs.dev",
    shapeUtils = [],
    defaultStore = DEFAULT_STORE,
}: Partial<{
    hostUrl: string;
    roomId: string;
    version: number;
    shapeUtils: TLAnyShapeUtilConstructor[];
    defaultStore: StoreSnapshot<TLRecord>;
}>): TLStoreWithStatus {
    // Create the tldraw store
    const [store] = useState(() => {
        const store = createTLStore({
            shapeUtils: [...defaultShapeUtils, ...shapeUtils],
        });
        store.loadSnapshot(defaultStore);
        return store;
    });

    const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
        status: "loading",
    });

    // Create the synced storage
    const { syncedStorage, room } = useMemo(() => {
        const syncedStorage = new TlDrawSyncedStorage<TLRecord>(
            roomId,
            {
                id: `tl_${roomId}`,
            } as TLRecord,
            hostUrl,
        );

        return {
            syncedStorage,
            room: syncedStorage.provider,
        };
    }, [hostUrl, roomId]);

    useEffect(() => {
        setStoreWithStatus({ status: "loading" });

        let hasConnectedBefore = false;
        const unsubs: Array<() => void> = [];

        function handleRoomSync(): void {
            // 1.
            // Connect store to yjs store and vis versa, for both the document and awareness

            /* -------------------- Document -------------------- */

            // Sync store changes to the yjs doc
            unsubs.push(
                store.listen(
                    function syncStoreChangesToYjsDoc({ changes }) {
                        syncedStorage.doc.transact(() => {
                            syncedStorage.setState(changes.added);
                            syncedStorage.setState(changes.updated);
                            syncedStorage.deleteState(changes.removed);
                        });
                    },
                    { source: "user", scope: "document" }, // only sync user's document changes
                ),
            );

            // Sync the yjs doc changes to the store
            const handleChange = (changes, transaction): void => {
                if (transaction.local) {
                    return;
                }

                // put / remove the records in the store
                store.mergeRemoteChanges(() => {
                    if (changes.toRemove) {
                        store.remove(changes.toRemove as Array<TLRecord["id"]>);
                    }
                    if (changes.toPut) {
                        store.put(changes.toPut);
                    }
                });
            };

            syncedStorage.onStateChanged(handleChange);
            unsubs.push(() => syncedStorage.onStateOff(handleChange));

            /* -------------------- Awareness ------------------- */

            const yClientId = room.awareness.clientID.toString();
            setUserPreferences({ id: yClientId });

            const userPreferences = computed<{
                id: string;
                color: string;
                name: string;
            }>("userPreferences", () => {
                const user = getUserPreferences();
                return {
                    id: user.id,
                    color: user.color ?? defaultUserPreferences.color,
                    name: user.name ?? defaultUserPreferences.name,
                };
            });

            // Create the instance presence derivation
            const presenceId = InstancePresenceRecordType.createId(yClientId);
            const presenceDerivation = createPresenceStateDerivation(
                userPreferences,
                presenceId,
            )(store);

            // Set our initial presence from the derivation's current value
            room.awareness.setLocalStateField("presence", presenceDerivation.get());

            // When the derivation change, sync presence to to yjs awareness
            unsubs.push(
                react("when presence changes", () => {
                    const presence = presenceDerivation.get();
                    requestAnimationFrame(() => {
                        room.awareness.setLocalStateField("presence", presence);
                    });
                }),
            );

            // Sync yjs awareness changes to the store
            const handleUpdate = (update: {
                added: number[];
                updated: number[];
                removed: number[];
            }): void => {
                const states = room.awareness.getStates() as Map<
                    number,
                    { presence: TLInstancePresence }
                >;

                const toRemove: Array<TLInstancePresence["id"]> = [];
                const toPut: TLInstancePresence[] = [];

                // Connect records to put / remove
                for (const clientId of update.added) {
                    const state = states.get(clientId);
                    if (state?.presence && state.presence.id !== presenceId) {
                        toPut.push(state.presence);
                    }
                }

                for (const clientId of update.updated) {
                    const state = states.get(clientId);
                    if (state?.presence && state.presence.id !== presenceId) {
                        toPut.push(state.presence);
                    }
                }

                for (const clientId of update.removed) {
                    toRemove.push(InstancePresenceRecordType.createId(clientId.toString()));
                }

                // put / remove the records in the store
                store.mergeRemoteChanges(() => {
                    if (toRemove.length) {
                        store.remove(toRemove);
                    }
                    if (toPut.length) {
                        store.put(toPut);
                    }
                });
            };

            room.awareness.on("update", handleUpdate);
            unsubs.push(() => room.awareness.off("update", handleUpdate));

            // 2.
            // Initialize the store with the yjs doc records—or, if the yjs doc
            // is empty, initialize the yjs doc with the default store records.

            if (syncedStorage.getState().length > 0) {
                // Replace the store records with the yjs doc records
                transact(() => {
                    // The records here should be compatible with what's in the store
                    store.clear();
                    const records = syncedStorage
                        .getState()
                        .filter(({ key, val }) => key && val)
                        .map(({ val }) => val);
                    store.put(records);
                });
            } else {
                // Create the initial store records
                // Sync the store records to the yjs doc
                for (const record of store.allRecords()) {
                    syncedStorage.initializeState(record);
                }
            }

            setStoreWithStatus({
                store,
                status: "synced-remote",
                connectionStatus: "online",
            });
        }

        function handleRoomStatusChange({
            status,
        }: {
            status: "disconnected" | "connected";
        }): void {
            // If we're disconnected, set the store status to 'synced-remote' and the connection status to 'offline'
            if (status === "disconnected") {
                setStoreWithStatus({
                    store,
                    status: "synced-remote",
                    connectionStatus: "offline",
                });
                return;
            }

            room.off("synced", handleRoomSync);

            if (status === "connected") {
                if (hasConnectedBefore) {
                    return;
                }
                hasConnectedBefore = true;
                room.on("synced", handleRoomSync);
                unsubs.push(() => room.off("synced", handleRoomSync));
            }
        }

        room.on("status", handleRoomStatusChange);
        unsubs.push(() => room.off("status", handleRoomStatusChange));
        unsubs.push(syncedStorage.dispose);

        return () => {
            unsubs.forEach(fn => fn());
            unsubs.length = 0;
        };
    }, [room, store, syncedStorage]);

    return storeWithStatus;
}
