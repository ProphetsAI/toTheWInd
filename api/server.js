'use strict';

const express = require('express'),
  cors = require('cors'),
  { processenv } = require('processenv');

const logger = require('./logger'),
  Database = require('./processengine/modules/Database'),
  Dispatcher = require('./processengine/modules/Dispatcher');

const app = express();

app.use(cors());
app.options('*', cors()); // https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express

app.use(logger({ level: 'INFO' }));

app.get('/templates', Dispatcher.getTemplates());
app.get('/rules', Dispatcher.getRules());
app.get('/deployed', Dispatcher.getDeployed());
app.get('/events', Dispatcher.getEvents());

app.post('/templates', express.json(), Dispatcher.insertTemplate());
app.post('/rules', express.json(), Dispatcher.insertRule());
app.post('/events', express.json(), Dispatcher.dispatchEvent());

const port = processenv('API_PORT', 3000);
app.listen(port, () => {
  console.log(`Server listening... (on port ${port})`);
});

process.on('SIGINT', async function () {
  await Database.shutdown();
  console.log('DDD exits now.');
  process.exit(1);
});
