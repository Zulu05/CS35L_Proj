// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import User from "../models/users";

// Global Configuration
export const usersRouter = express.Router();

usersRouter.use(express.json());

// GET
usersRouter.get("/", async (_req: Request, res: Response) => {
    try {
       if (!collections.users) {
           res.status(500).send("Database not initialized");
           return;
       }

       // `collections.users.find().toArray()` returns `WithId<Document>[]` from the driver.
       // cast via `unknown` to align with our `User` class type for now.
       const users = (await collections.users.find({}).toArray()) as unknown as User[];

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

// POST
usersRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newUser = req.body as User;

        if (!collections.users) {
            res.status(500).send("Database not initialized");
            return;
        }

        const result = await collections.users.insertOne(newUser);

        if (result && result.insertedId) {
            res.status(201).send(`Successfully created a new user with id ${result.insertedId}`);
        } else {
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(msg);
        res.status(400).send(msg);
    }
});

// PUT
usersRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedUser: User = req.body as User;

        if (!collections.users) {
            res.status(500).send("Database not initialized");
            return;
        }

        const query = { _id: new ObjectId(id) };

        const result = await collections.users.updateOne(query, { $set: updatedUser });

        if (result && result.matchedCount) {
            res.status(200).send(`Successfully updated user with id ${id}`);
        } else if (result && !result.matchedCount) {
            res.status(404).send(`User with id ${id} does not exist`);
        } else {
            res.status(500).send(`Failed to update user with id ${id}`);
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(msg);
        res.status(400).send(msg);
    }
});

//PATCH (Add answers to user) 

usersRouter.patch("/:id/quiz", async (req: Request, res: Response) => {
  const userId = req?.params?.id;
  const { answers } = req.body;

  if (!userId) {
    return res.status(400).send("Missing user id");
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return res.status(400).send("`answers` must be an object mapping question->number");
  }

  // Validate values are numbers in [0,100]
  for (const [question, value] of Object.entries(answers)) {
    if (typeof value !== "number" || Number.isNaN(value) || value < 0 || value > 100) {
      return res.status(400).send(`Invalid answer for "${question}": must be a number between 0 and 100`);
    }
  }

  const quizResponse = {
    submissionDate: new Date(),
    version: 1,
    answers: answers as { [key: string]: number },
    clubMatches: [] as string[]
  };

  try {
    if (!collections.users) {
      return res.status(500).send("Database not initialized");
    }

    // Validate userId is a valid ObjectId
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(userId);
    } catch (err) {
      console.error(`Invalid ObjectId format: ${userId}`);
      return res.status(400).send(`Invalid user id format: ${userId}`);
    }

    // Replace the last quiz response 
    const result = await collections.users.updateOne(
      { _id: objectId },
      { 
        $set: { quizResponses: [quizResponse] }
      } as any
    );

    console.log(`Update result:`, result);

    if (result.matchedCount > 0) {
      return res.status(200).json({
        message: `Quiz submitted successfully for user ${userId}`
      });
    } else {
      return res.status(404).send(`User with id ${userId} not found`);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Error submitting quiz:", msg);
    return res.status(400).send(msg);
  }
});

// DELETE

usersRouter.delete("/:id", async (req: Request, res: Response) => {
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