<h1><em><samp>tldraw-store</samp></em></h1>

A React Hook-based npm package for seamlessly integrating Yjs in drawing apps, enabling real-time, collaborative drawing experiences.

## Install

```bash
pnpm install @tldraw/tldraw@2.0.0-beta.2 tldraw-store
```

## Usage

```tsx
import { Tldraw } from "@tldraw/tldraw";
import { useYjsStore } from "tldraw-store";

// your component
const store = useYjsStore({
    roomId: "roomUUID",
    hostUrl: "ws://localhost:1234", // replace to your own service
});

<Tldraw store={store} />
```

## License

MIT @ [Openflat](https://github.com/openflat-io)
