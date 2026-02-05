const { MongoClient } = require("mongodb");

// Replace this with your MongoDB URI
const uri = "mongodb+srv://anointed:anointed2003@cos-ibe.7jk6qrm.mongodb.net/?appName=Cos-ibe";


// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Choose a database and collection
    const database = client.db("testDB");
    const collection = database.collection("testCollection");

    // Example: insert a document
    const doc = { name: "ChatGPT", type: "AI Assistant" };
    const result = await collection.insertOne(doc);
    console.log("Document inserted with _id:", result.insertedId);

    // Example: find the document
    const findResult = await collection.findOne({ name: "ChatGPT" });
    console.log("Found document:", findResult);
  } catch (err) {
    console.error(err);
  } finally {
    // Close the connection
    await client.close();
  }
}

run();
