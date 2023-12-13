// 1 pool de Clients (10 par défaut)

const { Pool } = require("pg");

const client = new Pool();

client.connect();

module.exports = client;
