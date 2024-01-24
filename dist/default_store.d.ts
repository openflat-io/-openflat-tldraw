export declare const DEFAULT_STORE: {
    store: {
        "document:document": {
            gridSize: number;
            name: string;
            meta: {};
            id: string;
            typeName: string;
        };
        "pointer:pointer": {
            id: string;
            typeName: string;
            x: number;
            y: number;
            lastActivityTimestamp: number;
            meta: {};
        };
        "page:page": {
            meta: {};
            id: string;
            name: string;
            index: string;
            typeName: string;
        };
        "camera:page:page": {
            x: number;
            y: number;
            z: number;
            meta: {};
            id: string;
            typeName: string;
        };
        "instance_page_state:page:page": {
            editingShapeId: any;
            croppingShapeId: any;
            selectedShapeIds: any[];
            hoveredShapeId: any;
            erasingShapeIds: any[];
            hintingShapeIds: any[];
            focusedGroupId: any;
            meta: {};
            id: string;
            pageId: string;
            typeName: string;
        };
        "instance:instance": {
            followingUserId: any;
            opacityForNextShape: number;
            stylesForNextShape: {};
            brush: any;
            scribble: any;
            cursor: {
                type: string;
                rotation: number;
            };
            isFocusMode: boolean;
            exportBackground: boolean;
            isDebugMode: boolean;
            isToolLocked: boolean;
            screenBounds: {
                x: number;
                y: number;
                w: number;
                h: number;
            };
            zoomBrush: any;
            isGridMode: boolean;
            isPenMode: boolean;
            chatMessage: string;
            isChatting: boolean;
            highlightedUserIds: any[];
            canMoveCamera: boolean;
            isFocused: boolean;
            devicePixelRatio: number;
            isCoarsePointer: boolean;
            isHoveringCanvas: boolean;
            openMenus: any[];
            isChangingStyle: boolean;
            isReadonly: boolean;
            meta: {};
            id: string;
            currentPageId: string;
            typeName: string;
        };
    };
    schema: {
        schemaVersion: number;
        storeVersion: number;
        recordVersions: {
            asset: {
                version: number;
                subTypeKey: string;
                subTypeVersions: {
                    image: number;
                    video: number;
                    bookmark: number;
                };
            };
            camera: {
                version: number;
            };
            document: {
                version: number;
            };
            instance: {
                version: number;
            };
            instance_page_state: {
                version: number;
            };
            page: {
                version: number;
            };
            shape: {
                version: number;
                subTypeKey: string;
                subTypeVersions: {
                    group: number;
                    text: number;
                    bookmark: number;
                    draw: number;
                    geo: number;
                    note: number;
                    line: number;
                    frame: number;
                    arrow: number;
                    highlight: number;
                    embed: number;
                    image: number;
                    video: number;
                };
            };
            instance_presence: {
                version: number;
            };
            pointer: {
                version: number;
            };
        };
    };
};
