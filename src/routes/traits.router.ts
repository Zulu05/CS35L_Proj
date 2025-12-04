// External Dependencies
import express, { Request, Response } from "express";

// Internal Dependencies
// Models
import { TraitDefinition } from "../models/traits";

// Services
import { collections } from "../services/database.service";

export const traitsRouter = express.Router();
traitsRouter.use(express.json());

traitsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    if (!(collections as any).traits) {
      return res.status(500).send("Traits collection not initialized");
    }

    const traits = ((await (collections as any).traits?.find({})?.toArray()) ?? []) as TraitDefinition[];

    traits.sort((a, b) => a.id.localeCompare(b.id));

    res.status(200).json(traits);
  } catch (err: any) {
    console.error("Error fetching traits:", err?.message ?? err);
    res.status(500).send(err?.message ?? "Server error");
  }
});