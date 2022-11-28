const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
require("./configs/dotenv");
const client = require("./configs/database");
const user = require("./routes/user")

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Data logging initiated!");
  }
});

app.use("/user", user);
