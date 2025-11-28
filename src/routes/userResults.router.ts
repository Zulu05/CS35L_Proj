// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import UserResult from "../models/userResults";

// Global Configuration
export const userResultsRouter = express.Router();

userResultsRouter.use(express.json());

// GET
userResultsRouter.get("/", async (_req: Request, res: Response) => {
    try {
       if (!collections.userResults) {
           res.status(500).send("Database not initialized");
           return;
       }

       // `collections.users.find().toArray()` returns `WithId<Document>[]` from the driver.
       // cast via `unknown` to align with our `User` class type for now.
       const userResults = (await collections.userResults.find({}).toArray()) as unknown as UserResult[];

        res.status(200).send(userResults);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

// POST
userResultsRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newUserResult = req.body as UserResult;

        if (!collections.userResults) {
            res.status(500).send("Database not initialized");
            return;
        }

        const result = await collections.userResults.insertOne(newUserResult);

        if (result && result.insertedId) {
            res.status(201).send(`Successfully created a new user result with id ${result.insertedId}`);
        } else {
            res.status(500).send("Failed to create a new user result.");
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(msg);
        res.status(400).send(msg);
    }
});

// PUT
userResultsRouter.put("/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { social, academic, leadership, creativity } = req.body;
  
    if (!collections.userResults) {
      return res.status(500).send("Database not initialized");
    }
  
    try {
      const result = await collections.userResults.updateOne(
        { userId: new ObjectId(userId) }, // match by userId
        {
          $set: {
            userId: new ObjectId(userId), // ensures field exists
            social,
            academic,
            leadership,
            creativity,
          },
        },
        { upsert: true } // create if doesn't exist
      );
  
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

// DELETE

userResultsRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
       if (!collections.users) {
           res.status(500).send("Database not initialized");
           return;
       }

        const query = { _id: new ObjectId(id) };
        const result = await collections.users.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed user with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove user with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`User with id ${id} does not exist`);
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(msg);
        res.status(400).send(msg);
    }
});