const config = require('../config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.mysql.database, config.db.mysql.user, config.db.mysql.password, {
	host: config.db.mysql.host,
	dialect: config.db.mysql.product,

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},

  // SQLite only
  // storage: 'path/to/database.sqlite'
});

const fs = require('fs');
const Seq = require('sequelize');
const config = require('../config');
const path = require('path');

var seq = new Seq(
  config.db.mysql.database,
  config.db.mysql.user,
  config.db.mysql.password, {
    host: config.db.mysql.host,
    dialect: config.db.mysql.product,

    // @TODO : CHECK  aws rds pool and make it efficient pool and other options
    /*
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    */  
    define: {
      underscored: true
    }
  });

// Define models
var models = {};

fs.readdirSync(path.normalize(__dirname)).forEach(fileName => {
  if (path.normalize(__dirname+'/'+fileName) == path.normalize(__filename)) return;

  let modelName = fileName.slice(0, -3);
  models[modelName] = require(path.normalize(__dirname+'/'+fileName))(seq, Seq);
});

Object.keys(models).forEach(modelName => {
  let Model = models[modelName];
  if (Model.relate) {
    Model.relate(models);
    delete Model.relate;
  }
});

models.seq = seq;
models.Seq = Seq;

// Sync with database
seq.sync({force: false}).then(() => {
  console.log("database has been made");
});

module.exports = models;