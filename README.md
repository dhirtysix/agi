# agi

This repository contains a simple web-based UI for controlling a Kubernetes-backed RTS game. The interface lets you create server farms, scale them, and upgrade their container images via calls to a game server API.

## UI

For full functionality you need a game server that communicates with a Kubernetes
cluster. For local development or testing without a cluster, start the in-memory
stub server:

```
npm run dev
```

This launches a Node.js server that serves the UI at `http://localhost:3000` and
implements the `/api/*` endpoints purely in memory. Open that URL in a browser
and play the game without touching a real cluster.

## Tests

Run `npm test` to execute a minimal smoke test that verifies the presence of key UI elements.
