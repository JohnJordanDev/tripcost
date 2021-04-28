const express = require("express");
const mongo = require("mongodb").MongoClient;

const mongoURL = "mongodb://localhost:27017";
let db;
let trips;
let expenses;
mongo.connect(mongoURL, (err, mongoClient) => {
  if (err) {
    console.log("An error occurred when connecting to MongoClient");
  } else {
    console.log('connected to MongoDB');
    db = mongoClient.db('tripcost');
    trips = db.collection('trips');
    expenses = db.collection('expenses');
  }
});

const app = express();

app.post("/trip", (req, res) => { /* */ });
app.get("/trips", (req, res) => { /* */ });
app.post("/expense", (req, res) => { /* */ });
app.get("/expenses", (req, res) => { /* */ });

app.listen(3000, () => console.log("Server ready"));
