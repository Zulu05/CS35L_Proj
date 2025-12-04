// External Dependencies
import { ObjectId } from "mongodb";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

// Internal Dependencies
// Models
import User from "../models/users";

// Services
import { collections } from "../services/database.service";

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
    
    // get user from database and send it
    const users = (await collections.users.find({}).toArray()) as unknown as User[];
    res.status(200).send(users);

  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

// POST
usersRouter.post("/", async (req: Request, res: Response) => {
  try {
    // get the inputted username, email, and password from request
    const { username, email, password } = req.body;

    // check if database initialized / we have collection of users
    if (!collections.users) {
      res.status(500).send("Database not initialized");
      return;
    }

    // check if password exists
    if (!password) {
      res.status(400).send("Password is required");
      return;
    }

    // hash the password that was inputted
    const hashedPassword = await bcrypt.hash(password, 12);

    // create a new user with the hashed password
    const newUser = {
      username,
      email,
      password: hashedPassword,
      quizResponses: [],
      latestClubMatches: [],
      createdAt: new Date(),
    };

    // add new user to database
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

    // check if we have a username and password
    if (!username || !password) {
      res.status(400).send("Username and password required");
      return;
    }

    // check if database is initialized
    if (!collections.users) {
      res.status(500).send("Database not initialized");
      return;
    }

    // look up user by username
    const user = await collections.users.findOne({ username });

    // user is not found
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // compare hashed password using bcrypt
    const bcrypt = await import("bcrypt");
    const isMatch = await bcrypt.compare(password, user.password);

    // make sure password matches
    if (!isMatch) {
      res.status(401).send("Invalid password");
      return;
    }

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
  // get the id sent by the user request
  const id = req?.params?.id;

  try {
    // get an updated user from the inputs of the user request
    const updatedUser: User = req.body as User;

    if (!collections.users) {
      res.status(500).send("Database not initialized");
      return;
    }

    // update the user with that id in the db
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

// PATCH (add answers to user)
usersRouter.patch("/:id/quiz", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { answers } = req.body;

  if (!userId) {
    return res.status(400).send("Missing user id");
  }

  if (!collections.users) {
    return res.status(500).send("Database not initialized");
  }

  // get what is in the user right now
  const updatedUser: Partial<User> = { ...req.body }; 

  // hash the user's password
  if ('password' in updatedUser && updatedUser.password) {
    updatedUser.password = await bcrypt.hash(updatedUser.password as string, 12);
  }

  // validate user id
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(userId);
  } catch {
    return res.status(400).send(`Invalid user id format: ${userId}`);
  }

  // make sure answers exist
  if (!answers) {
    return res
      .status(400)
      .send("`answers` is required (object or array of trait entries)");
  }

  // make sure answers is in the right format
  if (Array.isArray(answers)) {
    for (let i = 0; i < answers.length; i++) {
      const entry = (answers as any)[i];
      if (!entry || typeof entry !== "object") {
        return res.status(400).send(`answers[${i}] must be an object like { id/traitId: string, value: number }`);
      }

      const id = (entry as any).id ?? (entry as any).traitId;
      const value = (entry as any).value;

      // check that there is a string id
      if (!id || typeof id !== "string") {
        return res.status(400).send(`answers[${i}].id or answers[${i}].traitId must be a non-empty string`);
      }

      // check if score is in range
      const num = Number(value);
      if (typeof value !== "number" || Number.isNaN(num) || num < 0 || num > 100) {
        return res.status(400).send(`Invalid score for trait "${id}" at index ${i}: must be a number between 0 and 100`);
      }
    }
  } else {
    return res
      .status(400)
      .send(
        "`answers` must be an array of { id/traitId, value }"
      );
  }

  try {
    const quizResponse = {
      submissionDate: new Date(),
      version: 1,
      answers, 
      clubMatches: [] as any[],
    };

    // set quiz responses as the latest
    const result = await collections.users.updateOne(
      { _id: objectId },
      {
        $set: {
          quizResponses: [quizResponse], 
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
usersRouter.delete("/:username", async (req: Request, res: Response) => {
  // get the username that was inputted
  const username = req.params.username;

  try {
    if (!collections.users) {
      res.status(500).send("Database not initialized");
      return;
    }

    // find a user in the db with that username
    const user = await collections.users.findOne({ username });


    if (!user) {
      res.status(404).send(`User with username "${username}" does not exist`);
      return;
    }

    // delete that user from the db
    const result = await collections.users.deleteOne(user);

    if (result && result.deletedCount) {
      res.status(202).send(`Successfully removed user with username ${username}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove user with username ${username}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`User with username ${username} does not exist`);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    res.status(400).send(msg);
  }
});

// PATCH (Add latest matches to the most recent quiz)
usersRouter.patch("/:id/quiz/latest-matches", async (req: Request, res: Response) => { 
  // get the inputs from the request
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

      // update the db with the new results / club matches
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
