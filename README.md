npm run dev

user - rusirulakshan66
pass - uaao3VpEpk9JojTm

string - mongodb+srv://rusirulakshan66:uaao3VpEpk9JojTm@cluster01.8k5cnh8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://rusirulakshan66:uaao3VpEpk9JojTm@cluster01.8k5cnh8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
