// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import ClubResult from "../models/clubResults";

// Global Configuration
export const clubResultsRouter = express.Router();

clubResultsRouter.use(express.json());

// GET
clubResultsRouter.get("/", async (_req: Request, res: Response) => {
    try {
       if (!collections.clubResults) {
           res.status(500).send("Database not initialized");
           return;
       }

       // `collections.clubs.find().toArray()` returns `WithId<Document>[]` from the driver.
       // cast via `unknown` to align with our `Club` class type for now.
       const clubResults = (await collections.clubResults.find({}).toArray()) as unknown as ClubResult[];

        res.status(200).send(clubResults);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

// POST
clubResultsRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newClubResult = req.body as ClubResult;

        if (!collections.clubResults) {
            res.status(500).send("Database not initialized");
            return;
        }

        const result = await collections.clubResults.insertOne(newClubResult);

        if (result && result.insertedId) {
            res.status(201).send(`Successfully created a new club result with id ${result.insertedId}`);
        } else {
            res.status(500).send("Failed to create a new club result.");
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(msg);
        res.status(400).send(msg);
    }
});

// PUT
clubResultsRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedClubResults: ClubResult = req.body as ClubResult;

        if (!collections.clubResults) {
            res.status(500).send("Database not initialized");
            return;
        }

        const query = { _id: new ObjectId(id) };

        const result = await collections.clubResults.updateOne(query, { $set: updatedClubResults });

        if (result && result.matchedCount) {
            res.status(200).send(`Successfully updated club results with id ${id}`);
        } else if (result && !result.matchedCount) {
            res.status(404).send(`Club results with id ${id} does not exist`);
        } else {
            res.status(500).send(`Failed to update club results with id ${id}`);
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(msg);
        res.status(400).send(msg);
    }
});

// DELETE

clubResultsRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
       if (!collections.clubResults) {
           res.status(500).send("Database not initialized");
           return;
       }

        const query = { _id: new ObjectId(id) };
        const result = await collections.clubResults.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed club results with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove club results with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Club results with id ${id} does not exist`);
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(msg);
        res.status(400).send(msg);
    }
});