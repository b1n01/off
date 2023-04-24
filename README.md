# Off

The meta feed platform.


## Setup

This repository come with docker, setup and run the environmint with: 

```bash
docker compose up -d
```

To edit the environment variables create the two `.env.local` files with:

```bash
cp deno/.env deno/.env.local
cp next/.env next/.env.local
```

### Visual Sudio Code

If you use VS Code there is a dev container configured in the `.devcontainer`
folder. It installs the VS Code engine in a container and configures all 
needed plugins to use all Typescript and Deno features (autocomplete, auto 
format, ecc.). To use it install the `ms-vscode-remote.remote-containers`
extention, VS Code should recognize the dev container and prompt to open it.

## Conventions

- ~~Use async/await precautionary~~
- Use object literal as function parameters
