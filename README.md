# Node REST API

Tinker project:
Basic REST API for mobile/web applications using Node.js and Express.js framework with Sequelize.js for working with PostgresSQL.
A user model and routes with basic auth middleware. Uses JSON Web Tokens.

This code works with the corresponding front-end [Angular2 Dashboard](https://github.com/Skaapie/ng2-dashboard).

## Running project

You need to have installed Node.js and PostgresSQL. You need to have set up postgresql and updated config.js.

### Install dependencies

To install dependencies enter project folder and run following command:
```
npm install
```

### Run server

To run server execute:
```
npm start
```

## Modules used

Some of non standard modules used:
* [ExpressJS](http://expressjs.com/)
* [SequelizeJS](http://docs.sequelizejs.com/en/v3/)
* [winston](https://www.npmjs.com/package/winston)
* [nodemon](http://nodemon.io/)

## Author

Jacques Alberts