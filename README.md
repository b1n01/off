# Off

The meta feed platform


## Setup

This repository come with a docker environment that handles all the setup, just
enable the `.env` files with:

```bash
cp deno/.env.example deno/.env
cp next/.env.example next/.env
```

Fill them accordingly and start containers with:

```bash
docker compose up -d
```

### Visual Sudio Code

If you use VS Code there is a dev container configured in the `.devcontainer`
folder. It installs the VS Code engine in a container and configures all 
needed plugins to use all Typescript and Deno features (autocomplete, auto 
format, ecc.). To use it install the `ms-vscode-remote.remote-containers`
extention, VS Code should recognize the dev container and prompt to open it.