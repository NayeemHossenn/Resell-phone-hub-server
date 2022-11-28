const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
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

function jwtTokenVerify(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.send("access unauthorized");
  }
  const token = authHeader.split(" ")[1];
}

async function run() {
  try {
    const categoryCollection = client
      .db("resalePhone")
      .collection("categories");
    const categoryItemsCollection = client
      .db("resalePhone")
      .collection("products");
    const bookingCollection = client.db("resalePhone").collection("bookings");
    const userCollection = client.db("resalePhone").collection("users");

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

    app.get("/bookings", jwtTokenVerify, async (req, res) => {
      const email = req.query.email;
      console.log("token", req.headers.authorization);
      console.log(email);
      const query = { email: email };
      const booking = await bookingCollection.find(query).toArray();
      res.send(booking);
    });

    app.post("/bookings", async (req, res) => {
      const bookings = req.body;
      console.log(bookings);
      const result = await bookingCollection.insertOne(bookings);
      res.send(result);
    });

    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "7d",
        });
        return res.send({ accessToken: token });
      }
      console.log(user);
      res.status(403).send({ accessToken: " " });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
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
