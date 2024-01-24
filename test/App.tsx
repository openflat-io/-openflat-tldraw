import React from "react"
import "@tldraw/tldraw/tldraw.css"
import { Tldraw } from "@tldraw/tldraw"

// @ts-ignore
import { useYjsStore } from "@dist/index"

export const App = (): React.ReactElement => {
    const store = useYjsStore({
        roomId: "test",
        hostUrl: "ws://localhost:1234",
    })

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Tldraw store={store} />
        </div>
    )
}