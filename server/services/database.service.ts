import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { clubs?: mongoDB.Collection } = {}

export async function connectToDatabase () {
   dotenv.config(); //pulls in /env file, empty is default = root 

   const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);
   //Creates client to connect to MongoDB
           
   await client.connect();
       
   const db: mongoDB.Db = client.db(process.env.DB_NAME); //Chooses which database to use
  
   const clubsCollection: mongoDB.Collection = db.collection(process.env.CLUBSINFO_COLLECTION_NAME!); //Gets a specific collection

    collections.clubs = clubsCollection; //Stores global reference for reuse
      
        console.log(`Successfully connected to database: ${db.databaseName} and collection: ${clubsCollection.collectionName}`);
}