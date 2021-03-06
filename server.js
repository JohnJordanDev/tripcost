/* eslint-disable no-console */
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
      console.log("An error occurred when trying to add a trip.");
      response.status(500).json({ err });
    } else {
      response.status(200).json({ name });
    }
  });
});

app.get("/trips", (req, response) => {
  response.header("Access-Control-Allow-Origin", "*");
  trips.find().toArray((err, items) => {
    if (err) {
      console.log("error in getting list of trips");
      response.status(500).json({ err });
    } else {
      response.status(200).json({ trips: items });
    }
  });
});

app.post("/expense", (req, response) => {
  const {
    trip, date, amount, category, description
  } = req.body;
  expenses.insertOne({
    trip, date, amount, category, description
  }, (err, result) => {
    if (err) {
      console.log("An error occurred when posting a new expense.");
      response.status(500).json({ err });
    } else {
      response.status(200).json({ ok: true });
    }
  });
});

app.get("/expenses", (req, response) => {
  response.header("Access-Control-Allow-Origin", "*");
  expenses.find().toArray((err, expenseItems) => {
    if (err) {
      console.log("An error occurred when fetching list of expenses.");
      response.status(500).json({ err });
    } else {
      response.status(200).json({ expenses: expenseItems });
    }
  });
});

app.delete("/all-null-trips", (req, res) => {
  trips.remove({ name: null }, (err, otherThings) => {
    if (err) {
      console.log("an error occurred when trying to delete all empty trips");
      res.status(500).json(err);
    } else {
      res.status(200).json(otherThings);
    }
  });
});

app.listen(3000, () => console.log("Server ready"));
