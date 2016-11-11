'use strict';

module.exports = {
  development: {
    port: process.env.PORT || 8080,
    db: {
      username: 'jacques',
      password: null,
      database: 'api_db',

      config: {
        host: 'localhost',
        dialect: 'postgres',
        maxConnections: 100,
        maxIdleTime: 10000,
        logging: console.log
      }
    }
  },

  test: {
    port: process.env.PORT || 8080,
    db: {
      username: 'jacques',
      password: null,
      database: 'api_db_test',

      config: {
        host: 'localhost',
        dialect: 'postgres',
        maxConnections: 100,
        maxIdleTime: 10000,
        logging: false
      }
    }
  }
};