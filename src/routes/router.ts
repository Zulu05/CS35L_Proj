// External Dependencies
import { ObjectId } from "mongodb";
import express, { Request, Response } from "express";

// Internal Dependencies
// Models
import Club from "../models/clubs";

// Services
import { collections } from "../services/database.service";

// Global Config
export const siteRouter = express.Router();

siteRouter.use(express.json());

// GET
siteRouter.get("/", async (_req: Request, res: Response) => {
    try {
        // geting the clubs from the db
       const clubs = (await collections.clubs!.find({}).toArray()) as unknown as  Club[];

        res.status(200).send(clubs);
    } catch (error:any) {
        res.status(500).send(error.message);
    }
});

siteRouter.get("/:id", async (req: Request, res: Response) => {
    // get the id from the request
    const id = req?.params?.id;

    try {
        // find the clubs that match that id in the db
        const query = { _id: new ObjectId(id) };
        const club = (await collections.clubs!.findOne(query)) as unknown as Club;

        // send the club if it exists
        if (club) {
            res.status(200).send(club);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});
// POST
siteRouter.post("/", async (req: Request, res: Response) => {
    try {
        // get the club that was sent from request and insert into db
        const newClub = req.body as Club;
        const addedClub = await collections.clubs!.insertOne(newClub);

        addedClub
            ? res.status(201).send(`Successfully created a new club with id ${addedClub.insertedId}`)
            : res.status(500).send("Failed to create a new club.");
    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
});
// PUT
siteRouter.put("/:id", async (req: Request, res: Response) => {
    // get the id from the request
    const id = req?.params?.id;

    try {
        // get the new club from the requirements 
        const updates: Club = req.body as Club;
        const query = { _id: new ObjectId(id) };
      
        // set the club with that id with the updates
        const updatedClub = await collections.clubs!.updateOne(query, { $set: updates });

        updatedClub
            ? res.status(200).send(`Successfully updated club with id ${id}`)
            : res.status(304).send(`Club with id: ${id} not updated`);
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
// DELETE
siteRouter.delete("/:id", async (req: Request, res: Response) => {
    // get the id from the user request
    const id = req?.params?.id;

    try {
        // delete the club with that id
        const query = { _id: new ObjectId(id) };
        const deletedClub = await collections.clubs!.deleteOne(query);

        if (deletedClub && deletedClub.deletedCount) {
            res.status(202).send(`Successfully removed club with id ${id}`);
        } else if (!deletedClub) {
            res.status(400).send(`Failed to remove club with id ${id}`);
        } else if (!deletedClub.deletedCount) {
            res.status(404).send(`Club with id ${id} does not exist`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
