const HttpError = require("./HttpError");
const handleMongooseError = require("./handleMongooseError");
const ctrlWrapper = require("./ctrlWrapper");
const sendEmail = require("./sendEmail");

module.exports = {
  HttpError,
  handleMongooseError,
  ctrlWrapper,
  sendEmail,
};

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://Iryna:rjpzdRf05@cluster0.aeyqg0d.mongodb.net/?retryWrites=true&w=majority";
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    // console.log(
    //   //"Pinged your deployment. You successfully connected to MongoDB!"
    //   "Database connection successful"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
