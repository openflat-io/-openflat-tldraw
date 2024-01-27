import { TLAnyShapeUtilConstructor, TLRecord, StoreSnapshot, TLStoreWithStatus } from "@tldraw/tldraw";
/**
 * sync the tldraw store with a yjs doc
 * @param param
 * @returns the tldraw store and its status
 */
export declare function useYjsStore({ roomId, hostUrl, shapeUtils, defaultStore, }: Partial<{
    hostUrl: string;
    roomId: string;
    version: number;
    shapeUtils: TLAnyShapeUtilConstructor[];
    defaultStore: StoreSnapshot<TLRecord>;
}>): TLStoreWithStatus;
