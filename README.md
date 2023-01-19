# Git Multi Remote CLI

A command-line tool for `managing multiple remote git repositories`. It provides a simple and easy-to-use interface that allows users to `add, switch, delete and list repositories` without interfering with each other. It makes it easy for users to work on `multiple git remote repos simultaneously`, keeping them separate while using the `same local code base`.

## Installing

```bash
 $ npm install -g gmr-cli@latest
```

## Post Installation Setups

- Add `.git.*` to global gitignore to ignore extra files.
  - To Add into global git ignore [checkout docs here](https://gist.github.com/subfuzion/db7f57fff2fb6998a16c) or [docs/gitignore.md](./docs/gitignore.md)

## Prerequisites

What things you need to install the software and how to install them

- Node.js
- Git

## Usage

```bash
 $ gmr [command]

 # Commands:
     list                   # List all cloned repositories with Repository ids.
     add <GIT PROJECT URL>       # Cloned a new git repository in the current working directory.
     switch <Repository ID>  # Switch to a different remote repository by repository id.
     delete <Repository ID>  # Delete a cloned git repository by repository id.
```

## Authors

- **WeeTech Solution PVT LTD**

## Stay in touch

- Website - [https://www.weetechsolution.com/](https://www.weetechsolution.com/)
- GitHub - [WeeTech Solution](https://github.com/weetech)
