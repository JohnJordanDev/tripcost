const express = require("express");
const mongo = require("mongodb").MongoClient;

const mongoURL = "mongodb://localhost:27017";
let db;
let trips;
let expenses;
const mongoContructorCB = (err, mongoClient) => {
  if (err) {
    console.log("An error occurred when connecting to MongoClient");
  } else {
    db = mongoClient.db("tripcost");
    trips = db.collection("trips");
    expenses = db.collection("expenses");
  }
};
mongo.connect(mongoURL, { useUnifiedTopology: true }, mongoContructorCB);

const app = express();
app.use(express.json());

app.post("/trip", (req, response) => {
  const { name } = req.body;
  trips.insertOne({ name }, (err, result) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log("An error occurred when trying to add a trip.");
      response.status(500).json({ err });
    } else {
      response.status(200).json({ result });
    }
  });
});

app.get("/trips", (req, res) => { /* */ });
app.post("/expense", (req, res) => { /* */ });
app.get("/expenses", (req, res) => { /* */ });

app.listen(3000, () => console.log("Server ready"));
