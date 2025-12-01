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
  const userId = req.params.id;
  const { answers } = req.body;

  if (!userId) {
    return res.status(400).send("Missing user id");
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return res.status(400).send("`answers` must be an object mapping name -> number");
  }

  // Validate answers
  for (const [key, value] of Object.entries(answers)) {
    if (typeof value !== "number" || value < 0 || value > 100 || Number.isNaN(value)) {
      return res.status(400).send(
        `Invalid score for "${key}": must be a number between 0 and 100`
      );
    }
  }

  if (!collections.users) {
    return res.status(500).send("Database not initialized");
  }

  // Validate ObjectId
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(userId);
  } catch {
    return res.status(400).send(`Invalid user id format: ${userId}`);
  }

  try {
    const quizResponse = {
      submissionDate: new Date(),
      version: 1,
      answers,
      clubMatches: [] as any[],
    };

    // Overwrite quizResponses array with ONLY the latest one
    const result = await collections.users.updateOne(
      { _id: objectId },
      {
        $set: {
          quizResponses: [quizResponse], // overwrite
          updatedAt: new Date(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send(`User with id ${userId} not found`);
    }

    return res.status(200).json({
      message: "Quiz response saved successfully",
      quizResponse,
    });

  } catch (error: any) {
    console.error("Error updating quiz response:", error?.message);
    return res.status(500).send(error?.message || "Server error");
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

// PATCH (Add latest matches to the most recent quiz)
usersRouter.patch("/:id/quiz/latest-matches", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { clubMatches } = req.body;

  if (!userId) {
    return res.status(400).send("Missing user id");
  }

  if (!Array.isArray(clubMatches)) {
    return res.status(400).send("`clubMatches` must be an array");
  }

  try {
    if (!collections.users) {
      return res.status(500).send("Database not initialized");
    }

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(userId);
    } catch {
      return res.status(400).send(`Invalid user id format: ${userId}`);
    }

    const result = await collections.users.updateOne(
      { _id: objectId },
      {
        $set: {
          latestClubMatches: clubMatches,
          updatedAt: new Date(),
        },
      } as any
    );

    if (result.matchedCount === 0) {
      return res.status(404).send(`User with id ${userId} not found`);
    }

    return res.status(200).json({
      message: "Latest matches saved successfully",
      latestClubMatches: clubMatches,
    });
  } catch (error: any) {
    console.error("Error saving latest matches:", error?.message);
    return res.status(500).send(error?.message || "Server error");
  }
});