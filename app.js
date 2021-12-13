/* eslint-disable no-console */
const path = require('path');
const express = require('express');
const enrouten = require('express-enrouten');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const config = require('./config.js');
const setAssociations = require('./database/models/association.js');

setAssociations();

const port = config.get('PORT');
// app.options('*', (req, res) => {
//   res.writeHead(200, '', {
//       'Access-Control-Allow-Headers':'*',
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'OPTIONS',
//   }).end();
// });
// app.use(cors({
//   origin:  ['http://localhost:8080', '*']
// }));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(enrouten({
  directory: path.join(__dirname, 'controllers'),
}));

app.use('*', async (req, res) => res.status(404).json({ message: 'Resource not found. '}));

app.use(async (err, req, res, next) => {
  const message = err.message || 'Internal server error.';
  const data = err.error;
  return res.status(500).json({ message, data });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});




module.exports = app;