// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Club from "../models/clubs";

// Global Configuration
export const clubsRouter = express.Router();

clubsRouter.use(express.json());

// GET
clubsRouter.get("/", async (_req: Request, res: Response) => {
    try {
       if (!collections.clubs) {
           res.status(500).send("Database not initialized");
           return;
       }

       // `collections.clubs.find().toArray()` returns `WithId<Document>[]` from the driver.
       // cast via `unknown` to align with our `Club` class type for now.
       const clubs = (await collections.clubs.find({}).toArray()) as unknown as Club[];

        res.status(200).send(clubs);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

// POST
clubsRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newClub = req.body as Club;

        if (!collections.clubs) {
            res.status(500).send("Database not initialized");
            return;
        }

        const result = await collections.clubs.insertOne(newClub);

        if (result && result.insertedId) {
            res.status(201).send(`Successfully created a new club with id ${result.insertedId}`);
        } else {
            res.status(500).send("Failed to create a new club.");
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(msg);
        res.status(400).send(msg);
    }
});

// PUT
clubsRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedClub: Club = req.body as Club;

        if (!collections.clubs) {
            res.status(500).send("Database not initialized");
            return;
        }

        const query = { _id: new ObjectId(id) };

        const result = await collections.clubs.updateOne(query, { $set: updatedClub });

        if (result && result.matchedCount) {
            res.status(200).send(`Successfully updated club with id ${id}`);
        } else if (result && !result.matchedCount) {
            res.status(404).send(`Club with id ${id} does not exist`);
        } else {
            res.status(500).send(`Failed to update club with id ${id}`);
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(msg);
        res.status(400).send(msg);
    }
});

// DELETE

clubsRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
       if (!collections.clubs) {
           res.status(500).send("Database not initialized");
           return;
       }

        const query = { _id: new ObjectId(id) };
        const result = await collections.clubs.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed club with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove club with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Club with id ${id} does not exist`);
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(msg);
        res.status(400).send(msg);
    }
});