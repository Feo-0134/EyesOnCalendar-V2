# apaccalendar

> A Mayonnaise Powered Calendar

## Run locally

### Server

Inside the server folder:
``` bash
npm install
npm start
```

### Client

In the root folder:
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

## Deploy

1. Build client

``` bash
npm run build
```

2. Copy the resulting dist folder inside server

3. Run ```npm install``` inside the server folder

4. Zip deploy the contents of the server folder to an App Service

5. Enable websockets

6. The mongo connection string is hardcoded inside the server.js file for now. Don't mess with it, please

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
