const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (resq, res) => {
  res.send("resale phone erver is running");
});

app.listen(port, (req, res) => {
  console.log(`resale phone server is running on port ${port}`);
});
