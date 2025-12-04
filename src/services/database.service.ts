// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables
export const collections: {
  users?: mongoDB.Collection;
  clubs?: mongoDB.Collection;
  traits?: mongoDB.Collection; 
} = {};

// Initialize Connection
export async function connectToDatabase() {
  dotenv.config();

  const connectionString = process.env.DB_CONN_STRING;
  if (!connectionString) {
    throw new Error("Environment variable DB_CONN_STRING must be set");
  }

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(connectionString);

  await client.connect();

  const dbName = process.env.DB_NAME;
  if (!dbName) {
    throw new Error("Environment variable DB_NAME must be set");
  }

  const usersCollectionName = process.env.USERS_COLLECTION_NAME;
  const clubCollectionName = process.env.CLUBS_COLLECTION_NAME;

  const traitsCollectionName = process.env.TRAITS_COLLECTION_NAME || "traits";

  if (!usersCollectionName) 
    throw new Error("Environment variable USERS_COLLECTION_NAME must be set");
  else if (!clubCollectionName)
    throw new Error("Environment variable CLUBS_COLLECTION_NAME must be set");

  const db: mongoDB.Db = client.db(dbName);

  const usersCollection: mongoDB.Collection = db.collection(usersCollectionName);
  const clubsCollection: mongoDB.Collection = db.collection(clubCollectionName);

  const traitsCollection: mongoDB.Collection = db.collection(
    traitsCollectionName
  );

  collections.users = usersCollection;
  collections.clubs = clubsCollection;
  collections.traits = traitsCollection; 

  console.log(`Successfully connected to database: ${db.databaseName} and collections: ` + `${usersCollection.collectionName}, ` 
    + `${clubsCollection.collectionName}, `+ `${traitsCollection.collectionName}`);
}
