import { TLAnyShapeUtilConstructor, TLRecord, StoreSnapshot, TLStoreWithStatus } from "@tldraw/tldraw";
export declare function useYjsStore({ roomId, hostUrl, shapeUtils, defaultStore, }: Partial<{
    hostUrl: string;
    roomId: string;
    version: number;
    shapeUtils: TLAnyShapeUtilConstructor[];
    defaultStore: StoreSnapshot<TLRecord>;
}>): TLStoreWithStatus;
