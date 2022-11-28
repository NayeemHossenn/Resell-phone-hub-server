const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fbqmywm.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client
      .db("resalePhone")
      .collection("categories");
    const categoryItemsCollection = client
      .db("resalePhone")
      .collection("products");
    const bookingCollection = client.db("resalePhone").collection("bookings");

    app.get("/categories", async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { category_id: id };
      const products = await categoryItemsCollection.find(query).toArray();
      res.send(products);
    });

    app.post("/bookings", async (req, res) => {
      const bookings = req.body;
      const result = await bookingCollection.insertOne(bookings);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.err(err));

app.get("/", (req, res) => {
  res.send("resale phone erver is running");
});

app.listen(port, (req, res) => {
  console.log(`resale phone server is running on port ${port}`);
});
