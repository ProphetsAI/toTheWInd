const { Client } = require('pg');

var client = new Client({
  host: 'postgres',
  port: 5432,
  user: 'ddd',
  password: '53c237',
  database: 'ddd',
});

var shutdown = async function () {
  // drop tables in reverse order of creation
  await executeQuery({
    text: 'DROP TABLE IF EXISTS events',
  });
  await executeQuery({
    text: 'DROP TABLE IF EXISTS notlisteners',
  });
  await executeQuery({
    text: 'DROP TABLE IF EXISTS listeners',
  });
  await executeQuery({
    text: 'DROP TABLE IF EXISTS rules',
  });
  await executeQuery({
    text: 'DROP TABLE IF EXISTS properties',
  });
  await executeQuery({
    text: 'DROP TABLE IF EXISTS templates',
  });

  return client.end().then(() => {
    console.log('Postgres client disconnected.');
  });
};

var logQuery = function (query) {
  var queryString = query.text;
  if (query.values) {
    query.values.forEach((item, index) => {
      queryString = queryString.replace('$' + (index + 1), item);
    });
  }
  console.log(queryString);
};

var executeQuery = function (query) {
  logQuery(query);
  return client.query(query).catch((err) => {
    console.error(err.detail);
    throw err;
  });
};

(async function () {
  client
    .connect()
    .then(() => {
      console.log(
        'Postgres client connected to ' +
          client.connectionParameters.host +
          ':' +
          client.connectionParameters.port
      );
      executeQuery({
        text: 'CREATE TABLE IF NOT EXISTS templates (id SERIAL PRIMARY KEY, name varchar(255) NOT NULL UNIQUE)',
      });
    })
    .then(() => {
      executeQuery({
        text: 'CREATE TABLE IF NOT EXISTS properties (tid integer NOT NULL REFERENCES templates(id), name varchar(255) NOT NULL, value varchar(255) NOT NULL)',
      });
    })
    .then(() => {
      executeQuery({
        text: 'CREATE TABLE IF NOT EXISTS rules (id SERIAL PRIMARY KEY, name varchar(255) NOT NULL UNIQUE, type varchar(255) NOT NULL, atid integer NOT NULL REFERENCES templates(id), btid integer REFERENCES templates(id), stid integer REFERENCES templates(id), vtid integer REFERENCES templates(id), n integer, current integer, state varchar(255), mtrans varchar(255), utrans varchar(255))',
      });
    })
    .then(() => {
      executeQuery({
        text: 'CREATE TABLE IF NOT EXISTS listeners (property varchar(255), tid integer REFERENCES templates(id), rid integer REFERENCES rules(id))',
      });
    })
    .then(() => {
      executeQuery({
        text: 'CREATE TABLE IF NOT EXISTS notlisteners (property varchar(255), tid integer REFERENCES templates(id), rid integer REFERENCES rules(id))',
      });
    })
    .then(() => {
      executeQuery({
        text: 'CREATE TABLE IF NOT EXISTS events (timestamp double precision NOT NULL, json varchar(255) NOT NULL)',
      });
    })
    .catch((err) => {
      console.error('connection error', err.stack);
    });
})();

module.exports = {
  executeQuery,
  shutdown,
};
