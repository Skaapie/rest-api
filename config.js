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
    },
    jwt: {
      secret: process.env.JWT_SECRET || '9szp9gPUrStRwWs2A00Y6htgQ7JLymGH',
      expiresIn: 1440 // 24 hrs
    },
    mailer: {
      defaultFromAddress: 'test@test.com',
      transport: 'stub'
    },
    baseUrl: 'http://localhost:8080'
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
    },
    jwt: {
      secret: process.env.JWT_SECRET || '0PHBXji2s9DMwuL2N954z5qHmsOrIX5d',
      expiresIn: 1440 // 24 hrs
    },
    mailer: {
      defaultFromAddress: 'test@test.com',
      transport: 'stub'
    },
    baseUrl: 'http://localhost:8080'
  }
};