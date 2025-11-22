import express, { Request, Response } from "express";
import { getTopNRecommendations } from "../services/recommendation.service";

export const recommendationRouter = express.Router();
recommendationRouter.use(express.json());

/**
 * GET /recommendations/:userId/top?limit=5
 * Returns top N matching clubs sorted by Pearson correlation score.
 */
recommendationRouter.get("/:userId/top", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const limitParam = req.query.limit as string | undefined;
  const limit = limitParam ? parseInt(limitParam, 10) : 5;

  if (!userId) {
    res.status(400).json({ error: "userId path parameter is required" });
    return;
  }

  try {
    const top = await getTopNRecommendations(userId, limit);
    res.status(200).json({ results: top });
  } catch (err: any) {
    console.error("Recommendation error:", err?.message ?? err);
    res.status(500).json({ error: err?.message ?? "Internal server error" });
  }
});
