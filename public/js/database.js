const {MongoClient, ServerApiVersion} = require("mongodb");
const {uri} = require("./private.js");

const debug = false;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient
(
  uri,
  {
    serverApi:
    {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  }
);

/**
 * Formats a log message to include message source.
 * 
 * @param {string} src Message source.
 * @param {string} message Base log message.
 * @returns Formatted log message.
 */
const formatLog = function(src, message)
{
  return `[${src.toUpperCase()}] → ${message}`;
}

const DB_CreateCollection = async function(collection, database = "laptop-loans")
{
  try
  {
    const mongoDatabase = client.db(database);
    const result = await mongoDatabase.createCollection(collection);

    console.log(formatLog("DB", `Collection created: ${result.collectionName}`));
  }
  catch
  {
    console.log(formatLog("DB", `ERROR creating new document in ${database}.${collection}`));
  }
}

const DB_CreateDocument = async function(document, collection, database = "laptop-loans")
{
  try
  {
    const mongoDatabase = client.db(database);
    const mongoCollection = mongoDatabase.collection(collection);

    const result = await mongoCollection.insertOne(document);

    if (debug)
    {
      console.log(formatLog("DB", `Document successfully inserted with ID ${result.insertedId}`));
    }
  }
  catch
  {
    console.log(formatLog("DB", `ERROR creating new document in ${database}.${collection}`));
  }
}

const DB_UpdateDocument = async function(document, collection, database = "laptop-loans")
{
  try
  {
    const mongoDatabase = client.db(database);
    const mongoCollection = mongoDatabase.collection(collection);

    let filter, options, update;

    switch (collection)
    {
    case "logins":

      filter = {user: document.user};
      options = {upsert: true};

      update =
      {
        $set:
        {
          pass: document.pass
        }
      }

      break;

    default:

      filter = {id: document.id};
      options = {upsert: true};

      update =
      {
        $set:
        {
          firstname: document.firstname,
          lastname: document.lastname,
          dup: document.dup
        }
      }

      break;
    }

    const result = await mongoCollection.updateOne(filter, update, options);

    if (debug)
    {
      console.log(formatLog("DB", `${result.modifiedCount} documents updated, ${result.upsertedCount} documents upserted`));
    }
  }
  catch
  {
    console.log(formatLog("DB", `ERROR updating document in ${database}.${collection}`));
  }
}

const DB_DeleteDocument = async function(document, collection, database = "laptop-loans")
{
  try
  {
    const mongoDatabase = client.db(database);
    const mongoCollection = mongoDatabase.collection(collection);

    const filter = {"id": document.id};

    const result = await mongoCollection.deleteOne(filter);

    if (debug)
    {
      console.log(formatLog("DB", `${result.deletedCount} documents successfully deleted`));
    }
  }
  catch
  {
    console.log(formatLog("DB", `ERROR deleting document in ${database}.${collection}`));
  }
}

const DB_FindDocuments = async function(filter, collection, database = "laptop-loans")
{
  try
  {
    const mongoDatabase = client.db(database);
    const mongoCollection = mongoDatabase.collection(collection);

    let options;

    switch (collection)
    {
    case "logins":

      options = 
      {
        projection: {"_id": 0, "user": 1, "pass": 1}
      }
      break;

    default:

      options = 
      {
        projection: {"_id": 0, "id": 1, "firstname": 1, "lastname": 1, "dup": 1}
      }
      break;
    }

    const result = await mongoCollection.find(filter, options).toArray();

    // Sorting like this because strings are, in fact, not integers
    // Still needed?
    result.sort(function(a, b)
    {
      return (parseInt(a.id) > parseInt(b.id)) ? 1 : -1;
    });

    if (debug)
    {
      console.log(formatLog("DB", `Found ${result.length} documents`));
    }

    return result;
  }
  catch (e)
  {
    console.log(formatLog("DB", `ERROR finding documents in ${database}.${collection}: ${e.message}`));
  }
}

const DB_Close = async function()
{
  await client.close();
}

module.exports =
{
  DB_CreateCollection,
  DB_CreateDocument,
  DB_UpdateDocument,
  DB_DeleteDocument,
  DB_FindDocuments,
  DB_Close
};