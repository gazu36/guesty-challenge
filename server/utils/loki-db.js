const loki = require('lokijs');

const db = new loki(process.env.DB_PATH || 'db');

const definitions = db.addCollection('definitions', { indices: [] });

module.exports = definitions;