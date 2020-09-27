# Inventory Manager

![](./src/assets/readme_hero.png)

## Synopsis

The backend of my desktop and mobile-friendly [inventory manager](https://github.com/MateiSirbu/inventory-manager-frontend), developed with the help of the following `npm` packages: [`express`](https://www.npmjs.com/package/express), [`mikro-orm`](https://www.npmjs.com/package/mikro-orm), [`mongodb`](https://www.npmjs.com/package/mongodb), [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken), [`jwt-decode`](https://www.npmjs.com/package/jwt-decode) and more. This API facilitates the connection between the GUI and MongoDB, the database engine that stores the inventory items, and features authentication via JWT.

## Prerequisites

Since this app is served over HTTPS, you will need an SSL certificate that includes the public key (`backend.crt`), and the associated private key (`backend.key`). Please store them inside `src\ssl\`. If you need help, you can find my tutorial [here](https://github.com/MateiSirbu/generate-ssl-cert-with-san).

Additionally, in order to sign and verify JSON Web Tokens, you will need to generate an RS256 key pair. Store the keys inside `src\jwt\`; you can use the [shell script](./src/jwt/generateRS256.sh) provided inside.

## Running the server

Run `npm start` for a dev server. The app will automatically reload if you change any of the source files.