# Off

The first meta-feed platform ✌️.

Off allows you to publish all your content and consume all your feeds through a single platform. On top of that it offers a fine grained control over "the algorithm" used to handle your feed.

## Overview

This repository contains the source code of the Off platform. It is splitted into three packages:

- `api`: where most of the logic resides. It exposes data through JSON api can connect to the database.
- `web`: the web client that consume the api and handle the user authentication.

## Setup

This repository come with docker:

```bash
docker compose up -d
```

You ca customize environment variables using `.env.local` files, one for each packages:

```bash
touch api/.env.local web/.env.local
```

### Visual Sudio Code

If you use VS Code and Docker, you can use the dev container defined in the `.devcontainer` folder. It automatically installs and configures the VS Code server, the Deno runtime and some helpfull VS Code plugins.

To use it install the `ms-vscode-remote.remote-containers`
extention, VS Code should recognize the dev container and prompt to open it.