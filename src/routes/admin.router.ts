// External Dependencies
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

// Internal Dependencies
// Models
import Admin from "../models/admin";

// Services
import { collections } from "../services/database.service";

// Global Configuration
export const adminRouter = express.Router();

adminRouter.use(express.json());

// GET
adminRouter.get("/", async (_req: Request, res: Response) => {
  try {
    if (!collections.admin) {
      res.status(500).send("Database not initialized");
      return;
    }
    
    // get user from database and send it
    const admin = (await collections.admin.find({}).toArray()) as unknown as Admin[];
    res.status(200).send(admin);

  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

// POST
adminRouter.post("/", async (req: Request, res: Response) => {
  try {
    // get the inputted username, and password from request
    const { username, password } = req.body;

    // check if database initialized / we have collection of admin
    if (!collections.admin) {
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
    const newAdmin = {
      username,
      password: hashedPassword
    };

    // add new admin to database
    const addedAdmin = await collections.admin.insertOne(newAdmin);

    if (addedAdmin && addedAdmin.insertedId) {
      res.status(201).send(`Successfully created a new admin with id ${addedAdmin.insertedId}`);
    } else {
      res.status(500).send("Failed to create a new admin.");
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    res.status(400).send(msg);
  }
});

// POST TO VERIFY PASSWORD
adminRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // check if we have a username and password
    if (!username || !password) {
      res.status(400).send("Username and password required");
      return;
    }

    // check if database is initialized
    if (!collections.admin) {
      res.status(500).send("Database not initialized");
      return;
    }

    // look up admin by username
    const admin = await collections.admin.findOne({ username });

    // admin is not found
    if (!admin) {
      res.status(404).send("Admin not found");
      return;
    }

    // see if inputted password matches the stored password
    const matches = await bcrypt.compare(password, admin.password);

    // make sure password matches
    if (!matches) {
      res.status(401).send("Invalid password");
      return;
    }

    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin._id,
        username: admin.username,
      }
    });

  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : String(error);
    console.error(msg);
    res.status(500).send(msg);
  }
});

// DELETE
adminRouter.delete("/:username", async (req: Request, res: Response) => {
  // get the username that was inputted
  const username = req.params.username;

  try {
    if (!collections.admin) {
      res.status(500).send("Database not initialized");
      return;
    }

    // find a admin in the db with that username
    const admin = await collections.admin.findOne({ username });


    if (!admin) {
      res.status(404).send(`User with username "${username}" does not exist`);
      return;
    }

    // delete that admin from the db
    const deletedAdmin = await collections.admin.deleteOne(admin);

    if (deletedAdmin && deletedAdmin.deletedCount) {
      res.status(202).send(`Successfully removed user with username ${username}`);
    } else if (!deletedAdmin) {
      res.status(400).send(`Failed to remove user with username ${username}`);
    } else if (!deletedAdmin.deletedCount) {
      res.status(404).send(`User with username ${username} does not exist`);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    res.status(400).send(msg);
  }
});
