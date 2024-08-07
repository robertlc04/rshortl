require('dotenv').config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@rshortldb.f74jh4h.mongodb.net/?retryWrites=true&w=majority&appName=RshortlDB`;

class Database {
  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  // Basic Checks and Connections
  async connect() {
    await this.client.connect();
  }

  async ping() {
    await this.client.db("admin").command({ ping: 1 });
  }

  async status() {
    try {
      await this.connect()
      await this.ping()
      return true
    } catch (err) {
      return err
    }
  }

  async disconnect() {
    await this.client.close();
  }

  // CRUD


  /**
   * Asynchronously retrieves a collection from the MongoDB database using the provided name.
   *
   * @param {string} name - The name of the collection to retrieve.
   * @return {Promise<Collection>} A Promise that resolves to the retrieved collection.
   */
  async getCollection(name) {
    return this.client.db(`${process.env.MONGO_DBNAME}`).collection(name);
  }


  /**
   * Inserts a new link into the "links" collection in the database.
   *
   * @param {Object} data - The data of the link to be inserted.
   * @return {Promise<Object>} A Promise that resolves to the result of the insert operation.
   */
  async insertLink(data) {
    const collection = await this.getCollection("links");
    return await collection.insertOne(data);
  }


  /**
   * Retrieves a link from the "links" collection in the database.
   *
   * @param {string} link - The link to search for.
   * @return {Promise<Object>} A Promise that resolves to the found link object, or null if not found.
   */
  async getLink(shortlink) {
    const collection = await this.getCollection("links");
    if (!shortlink) return null
    const ret = await collection.findOne({ flag: shortlink.charAt(0) ,shortlink: shortlink })
    return await ret;
  }
  
}

module.exports = Database