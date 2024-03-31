# ride4utransport Backend

ride4utransport - APIs to source the ride4utransport frontend

---
## Requirements

For development, you will only need Node.js and a node global package, Npm, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v21.7.1

    $ npm --version
    10.5.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ sudo npm install npm -g

###
### Npm installation
  After installing node, this project will need npm too, so just run the following command.

      $ sudo npm install -g npm

---

## Install

    $ git clone `git url`
    $ cd backend
    $ npm install

## Configure app

Open `a/nice/path/to/a.file` then edit it with your settings. You will need:

- setting up of .env by copy .env.example to .env with rlevant credentials;
- seeting up of migration by copy sample.database.json to database.json;

## Running the project

    $ npm start


# Versions:
```
[Docker v20.10.2](https://www.docker.com/)
```
```
[Node v21.X](https://nodejs.org/en/)
```
```
[npm v10.14.4](https://docs.npmjs.com/getting-started/installing-node)
```
```

Inside .env file set environment variable
NODE_ENV=test (It will start on localhost) It will start on port 3000

    $ npm install
    $ npm run dev

PB_PORT  should be added to start pocketbase Port    


## Start project on Docker (Make sure Docker is installed in you local machine)

Inside .env file set environment variable
NODE_ENV=development (It will start on docker config port)
It will start on port 3000

```
docker-compose up

```
docker execute the ride4utransport_backend_orm /bin/bash

```
npm run migrate
```