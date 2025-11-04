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