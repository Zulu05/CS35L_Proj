// External Dependencies
import { ObjectId } from "mongodb";
import express, { Request, Response } from "express";

// Internal Dependencies
// Models
import Club from "../models/clubs";

// Services
import { collections } from "../services/database.service";

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

    // getting the clubs as an array
    const clubs = (await collections.clubs.find({}).toArray()) as unknown as Club[];

    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

// POST
clubsRouter.post("/", async (req: Request, res: Response) => {
  try {
    // create a new club from request info
    const newClub = req.body as Club;

    if (!collections.clubs) {
      res.status(500).send("Database not initialized");
      return;
    }

    // add club to db
    const addedClub = await collections.clubs.insertOne(newClub);

    if (addedClub && addedClub.insertedId) {
      // look for the added club in db with id and return it
      const created = await collections.clubs.findOne({ _id: addedClub.insertedId });
      res.status(201).json(created);
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
  // getting the id from request info
  const id = req?.params?.id;

  try {
    // get a partial club from the user request
    const updates: Partial<Club> = req.body as Partial<Club>;

    if (!collections.clubs) {
      res.status(500).send("Database not initialized");
      return;
    }

    // update the database by searching for the id and setting the updates
    const query = { _id: new ObjectId(id) };
    const updatedClub = await collections.clubs.updateOne(query, { $set: updates });

    if (updatedClub && updatedClub.matchedCount) {
      // return the updated club
      const updated = await collections.clubs.findOne(query);
      res.status(200).json(updated);
    } else if (updatedClub && !updatedClub.matchedCount) {
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
  // get the user id from the request
  const id = req?.params?.id;

  try {
    if (!collections.clubs) {
      res.status(500).send("Database not initialized");
      return;
    }

    // delete the club from the db based on the id
    const query = { _id: new ObjectId(id) };
    const deletedClub = await collections.clubs.deleteOne(query);

    if (deletedClub && deletedClub.deletedCount) {
      res.status(202).send(`Successfully removed club with id ${id}`);
    } else if (!deletedClub) {
      res.status(400).send(`Failed to remove club with id ${id}`);
    } else if (!deletedClub.deletedCount) {
      res.status(404).send(`Club with id ${id} does not exist`);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    res.status(400).send(msg);
  }
});