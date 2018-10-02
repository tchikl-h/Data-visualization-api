import express = require('express');
import * as path from 'path';
import Aggregator from './Aggregator';
const port = process.env.PORT || 5000;
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

// send the user to index html page inspite of the url
app.get('/api/v1/all', (req, res) => {
  
  // res.send('response');
  let agg = new Aggregator;
  agg.db.executeQuery('select relation from data;')
  .then((response) => {
    console.log(response);
    res.send(response);
  })
});

app.listen(port);