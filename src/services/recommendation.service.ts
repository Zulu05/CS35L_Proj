import { ObjectId } from "mongodb";
import { collections } from "./database.service";

/**
 * Compute Pearson correlation between two numeric arrays.
 * Arrays must be same length.
 * Returns value in [-1, 1]. If denominator is zero, returns 0.
 */
export function computePearsonCorrelation(a: number[], b: number[]): number {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    throw new Error("Vectors must be arrays of the same length");
  }
  const n = a.length;
  if (n === 0) return 0;

  const sumA = a.reduce((s, v) => s + v, 0);
  const sumB = b.reduce((s, v) => s + v, 0);

  const sumASq = a.reduce((s, v) => s + v * v, 0);
  const sumBSq = b.reduce((s, v) => s + v * v, 0);

  const sumProducts = a.reduce((s, _, i) => s + a[i] * b[i], 0);

  const numerator = sumProducts - (sumA * sumB) / n;
  const denomTermA = sumASq - (sumA * sumA) / n;
  const denomTermB = sumBSq - (sumB * sumB) / n;
  const denominator = Math.sqrt(Math.max(0, denomTermA * denomTermB));

  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Fetches the user's score vector (from collections.userResults) and
 * computes Pearson correlation against every club in collections.clubResults.
 * Returns top N clubs sorted by score descending.
 *
 * userId param can be string or ObjectId-like.
 */
export async function getTopNRecommendations(
  userId: string,
  topN = 5
): Promise<
  {
    clubId: string;
    clubname: string;
    score: number;
    scores?: Record<string, number>;
  }[]
> {
  if (!collections.userResults || !collections.clubResults) {
    throw new Error("Database collections not initialized");
  }

  // Fetch user result by userId
  const userObjectId = new ObjectId(userId);
  const userDoc = await collections.userResults.findOne({ userId: userObjectId });

  if (!userDoc) {
    throw new Error(`No user result found for userId ${userId}`);
  }

  // Expect the scores stored as an object: { social:number, academic:number, leadership:number, creativity:number }
  const userScoresObj = userDoc.scores;
  if (!userScoresObj) {
    throw new Error("User scores missing");
  }

  const userVector = [
    userScoresObj.social,
    userScoresObj.academic,
    userScoresObj.leadership,
    userScoresObj.creativity,
  ];

  // Fetch all club result docs
  const clubsCursor = collections.clubResults.find({});
  const clubs = await clubsCursor.toArray();

  const scored = clubs.map((clubDoc: any) => {
    const clubScoresObj = clubDoc.scores;
    const clubVector = [
      clubScoresObj?.social ?? 0,
      clubScoresObj?.academic ?? 0,
      clubScoresObj?.leadership ?? 0,
      clubScoresObj?.creativity ?? 0,
    ];

    let score = 0;
    try {
      score = computePearsonCorrelation(userVector, clubVector);
    } catch (err) {
      score = 0;
    }

    return {
      clubId: (clubDoc.clubId || clubDoc._id)?.toString(),
      clubname: clubDoc.clubname || clubDoc.name || "Unnamed Club",
      score,
      scores: clubScoresObj,
    };
  });

  // Sort descending by score and return topN
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}
