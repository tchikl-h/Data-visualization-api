import express = require('express');
import * as path from 'path';
import Aggregator from './Aggregator';
const port =  8080;
const app = express();

// send the user to index html page inspite of the url
app.get('/api/v1/all', (req, res) => {
  let agg = new Aggregator;
  agg.db.executeQuery('select relation from data;')
  .then((response) => {
    console.log(response);
    res.send(response);
  })
});

app.listen(port);