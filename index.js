const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.API_NAME}:${process.env.API_PASS}@cluster0.hzlter2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("TaskManager");
    const register = database.collection("Users");
    const addTask = database.collection("Task");

    app.post("/register", async (req, res) => {
      const data = req.body;
      const find = { email: data.email };
      const exist = await register.findOne(find);
      if (exist) {
        res.send({ message: "already exist" });
      } else {
        const result = await register.insertOne(data);
        res.send(result);
      }
    });

    app.post("/add/task", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await addTask.insertOne(data);
      res.send(result);
    });
    app.get("/get/task/:id", async (req, res) => {
      const email = req.params.id;
      const filter = { email: email };
      const result = await addTask.find(filter);
      const arrays = await result.toArray();
      res.send(arrays);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
