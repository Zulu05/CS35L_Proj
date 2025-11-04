// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables
export const collections: { users?: mongoDB.Collection } = {}

// Initialize Connection
export async function connectToDatabase () {
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
   if (!usersCollectionName) {
      throw new Error("Environment variable USERS_COLLECTION_NAME must be set");
   }

   const db: mongoDB.Db = client.db(dbName);
  
   const usersCollection: mongoDB.Collection = db.collection(usersCollectionName);

 collections.users = usersCollection;
      
        console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
}