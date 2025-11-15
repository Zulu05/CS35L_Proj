// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Club from "../models/clubs";
// Global Config
export const siteRouter = express.Router();

siteRouter.use(express.json());
// GET
siteRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const clubs = (await collections.clubs!.find({}).toArray()) as unknown as  Club[];

        res.status(200).send(clubs);
    } catch (error:any) {
        res.status(500).send(error.message);
    }
});

siteRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        
        const query = { _id: new ObjectId(id) };
        const game = (await collections.clubs!.findOne(query)) as unknown as Club;

        if (game) {
            res.status(200).send(game);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});
// POST
siteRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newClub = req.body as Club;
        const result = await collections.clubs!.insertOne(newClub);

        result
            ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new game.");
    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
});
// PUT
siteRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedClub: Club = req.body as Club;
        const query = { _id: new ObjectId(id) };
      
        const result = await collections.clubs!.updateOne(query, { $set: updatedClub });

        result
            ? res.status(200).send(`Successfully updated game with id ${id}`)
            : res.status(304).send(`Club with id: ${id} not updated`);
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
// DELETE
siteRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.clubs!.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed game with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove game with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Club with id ${id} does not exist`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
