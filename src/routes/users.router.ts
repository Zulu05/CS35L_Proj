// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import User from "../models/users";
import bcrypt from "bcrypt";

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
    const { username, email, password } = req.body;

    if (!collections.users) {
      res.status(500).send("Database not initialized");
      return;
    }

    if (!password) {
      res.status(400).send("Password is required");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      quizResponses: [],
      latestClubMatches: [],
      createdAt: new Date(),
    };

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

// POST TO VERIFY PASSWORD
usersRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send("Username and password required");
      return;
    }

    if (!collections.users) {
      res.status(500).send("Database not initialized");
      return;
    }

    // Look up user by username
    const user = await collections.users.findOne({ username });

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // Compare hashed password using bcrypt
    const bcrypt = await import("bcrypt");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).send("Invalid password");
      return;
    }

    // Login success — return basic safe user data
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : String(error);
    console.error(msg);
    res.status(500).send(msg);
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

// PATCH (Add answers to user)
usersRouter.patch("/:id/quiz", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { answers } = req.body;

  if (!userId) {
    return res.status(400).send("Missing user id");
  }

  if (!collections.users) {
    return res.status(500).send("Database not initialized");
  }

  const updatedUser: Partial<User> = { ...req.body }; // allow partial updates

  if ('password' in updatedUser && updatedUser.password) {
    updatedUser.password = await bcrypt.hash(updatedUser.password as string, 12);
  }

  // Validate ObjectId
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(userId);
  } catch {
    return res.status(400).send(`Invalid user id format: ${userId}`);
  }

  // NEW: accept either object or array for answers
  if (!answers) {
    return res
      .status(400)
      .send("`answers` is required (object or array of trait entries)");
  }

  // If answers is an array, expect [{ id/traitId, value }, ...]
  if (Array.isArray(answers)) {
    for (let i = 0; i < answers.length; i++) {
      const entry = (answers as any)[i];
      if (!entry || typeof entry !== "object") {
        return res
          .status(400)
          .send(
            `answers[${i}] must be an object like { id/traitId: string, value: number }`
          );
      }

      const id = (entry as any).id ?? (entry as any).traitId;
      const value = (entry as any).value;

      if (!id || typeof id !== "string") {
        return res
          .status(400)
          .send(
            `answers[${i}].id or answers[${i}].traitId must be a non-empty string`
          );
      }

      const num = Number(value);
      if (typeof value !== "number" || Number.isNaN(num) || num < 0 || num > 100) {
        return res
          .status(400)
          .send(
            `Invalid score for trait "${id}" at index ${i}: must be a number between 0 and 100`
          );
      }
    }
  } else if (typeof answers === "object") {
    // Old behavior: answers is an object mapping name -> number
    for (const [key, value] of Object.entries(answers)) {
      const num = Number(value);
      if (typeof value !== "number" || Number.isNaN(num) || num < 0 || num > 100) {
        return res
          .status(400)
          .send(
            `Invalid score for "${key}": must be a number between 0 and 100`
          );
      }
    }
  } else {
    return res
      .status(400)
      .send(
        "`answers` must be either an object mapping name -> number, or an array of { id/traitId, value }"
      );
  }

  try {
    const quizResponse = {
      submissionDate: new Date(),
      version: 1,
      answers, // stored exactly as sent (object or array)
      clubMatches: [] as any[],
    };

    // Overwrite quizResponses array with ONLY the latest one
    const result = await collections.users.updateOne(
      { _id: objectId },
      {
        $set: {
          quizResponses: [quizResponse], // overwrite
          updatedAt: new Date(),
        },
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
usersRouter.patch(
  "/:id/quiz/latest-matches",
  async (req: Request, res: Response) => {
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
  }
);
