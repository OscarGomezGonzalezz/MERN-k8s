// db.js
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB ATLAS URI
//const uri = "mongodb+srv://user:password@clusterxxxxxxxxxx/?retryWrites=true&w=majority&appName=xxxxx";

//URI al servicio de mongo en local

const uri = process.env.MONGO_URL;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
// Update the connection URI with authentication details
const fullUri = `mongodb://${mongoUser}:${mongoPassword}@${uri}:27017`;
// Create a MongoClient instance with options
const client = new MongoClient(fullUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Function to connect to MongoDB and return the client
async function connectDB() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Export the function to connect to the database
module.exports = connectDB;
