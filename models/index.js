'use strict';

let fs        = require('fs');
let path      = require('path');
let Sequelize = require('sequelize');
let basename  = path.basename(module.filename);
let env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config.js')[env];
const dbConfig = config.db;
let db        = {};
let sequelize;

if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable]);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.config);
}

console.log('Connecting to database...');
sequelize
    .authenticate()
    .then(function() {
        if (env !== 'test') {
          console.log('Connection to the database has been established successfully.');
        }
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    let model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.syncDB = function() {
    if (env !== 'test') {
      console.log('Syncing database.');
    }

    return sequelize.sync({
        force: true
    }).then(function() {
      if (env !== 'test') {
        console.log('Sequelize synced!');
      }
    }).catch(function(err) {
        console.log('Could not sync database: ', err);
    });
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
