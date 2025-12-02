// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables
export const collections: {
  users?: mongoDB.Collection;
  userResults?: mongoDB.Collection;
  clubs?: mongoDB.Collection;
  clubResults?: mongoDB.Collection;
  traits?: mongoDB.Collection;   // ✅ traits is part of collections
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
  const userResultsCollectionName = process.env.USER_RESULTS_COLLECTION_NAME;
  const clubCollectionName = process.env.CLUBS_COLLECTION_NAME;
  const clubResultsCollectionName = process.env.CLUB_RESULTS_COLLECTION_NAME;

  // NEW: traits collection name (defaults to "traits")
  const traitsCollectionName =
    process.env.TRAITS_COLLECTION_NAME || "traits";

  if (!usersCollectionName) {
    throw new Error("Environment variable USERS_COLLECTION_NAME must be set");
  } else if (!userResultsCollectionName)
    throw new Error(
      "Environment variable USER_RESULTS_COLLECTION_NAME must be set"
    );
  else if (!clubCollectionName)
    throw new Error("Environment variable CLUBS_COLLECTION_NAME must be set");
  else if (!clubResultsCollectionName)
    throw new Error(
      "Environment variable CLUB_RESULTS_COLLECTION_NAME must be set"
    );
  // traitsCollectionName has a default, so we don't hard-throw here

  const db: mongoDB.Db = client.db(dbName);

  const usersCollection: mongoDB.Collection = db.collection(usersCollectionName);
  const userResultsCollection: mongoDB.Collection =
    db.collection(userResultsCollectionName);
  const clubsCollection: mongoDB.Collection = db.collection(clubCollectionName);
  const clubResultsCollection: mongoDB.Collection =
    db.collection(clubResultsCollectionName);

  // ✅ actually open the traits collection
  const traitsCollection: mongoDB.Collection = db.collection(
    traitsCollectionName
  );

  collections.users = usersCollection;
  collections.userResults = userResultsCollection;
  collections.clubs = clubsCollection;
  collections.clubResults = clubResultsCollection;
  collections.traits = traitsCollection; // ✅ critical line

  console.log(
    `Successfully connected to database: ${db.databaseName} and collections: ` +
      `${usersCollection.collectionName}, ` +
      `${userResultsCollection.collectionName}, ` +
      `${clubsCollection.collectionName}, ` +
      `${clubResultsCollection.collectionName}, ` +
      `${traitsCollection.collectionName}`
  );
}
