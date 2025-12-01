import { ObjectId } from "mongodb";
import { collections } from "./database.service";

/**
 * Distance-based similarity between two numeric arrays in [0,1].
 * 1 = identical, 0 = as far apart as possible (0 vs maxScore in every dimension).
 */
export function computeDistanceSimilarity(
  a: number[],
  b: number[],
  maxScore = 100
): number {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    throw new Error("Vectors must be arrays of the same length");
  }

  const n = a.length;
  if (n === 0) return 0;

  let sumSq = 0;
  for (let i = 0; i < n; i++) {
    const diff = a[i] - b[i];
    sumSq += diff * diff;
  }

  const distance = Math.sqrt(sumSq);
  const maxDistance = Math.sqrt(n) * maxScore;

  if (maxDistance === 0) return 0;

  const similarity = 1 - distance / maxDistance;
  // Clamp to [0,1] to be safe with floating point noise
  return Math.max(0, Math.min(1, similarity));
}

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
export async function getAllRecommendations(userId: string): Promise<any[]> {
  if (!collections.users || !collections.clubs) {
    throw new Error("Database collections not initialized");
  }

  const userObjectId = new ObjectId(userId);
  const userDoc: any = await collections.users.findOne({ _id: userObjectId });

  if (!userDoc) {
    throw new Error(`No user found for userId ${userId}`);
  }

  const quizResponses = Array.isArray(userDoc.quizResponses)
    ? userDoc.quizResponses
    : [];

  if (quizResponses.length === 0) {
    throw new Error(`No quiz responses found for userId ${userId}`);
  }

  const latestQuiz = quizResponses[quizResponses.length - 1];
  const userScoresObj = latestQuiz.answers;
  if (!userScoresObj) {
    throw new Error("Latest quiz response is missing answers");
  }

  const userVector = [
    userScoresObj.social ?? 0,
    userScoresObj.academic ?? 0,
    userScoresObj.leadership ?? 0,
    userScoresObj.creativity ?? 0,
  ];

  console.log("userVector for recommendations:", userVector);

  const clubsCursor = collections.clubs.find({});
  const clubs = await clubsCursor.toArray();

  const scored = clubs.map((clubDoc: any) => {
    const clubScoresObj = clubDoc.scores || {};
    const clubVector = [
      clubScoresObj.social ?? 0,
      clubScoresObj.academic ?? 0,
      clubScoresObj.leadership ?? 0,
      clubScoresObj.creativity ?? 0,
    ];

    const similarity = computeDistanceSimilarity(userVector, clubVector);
    const matchPercent = Math.round(similarity * 100);

    console.log(
      `club ${clubDoc.clubname} | user=${JSON.stringify(
        userVector
      )} club=${JSON.stringify(clubVector)} similarity=${similarity} matchPercent=${matchPercent}`
    );

    return {
      clubId: (clubDoc.clubId || clubDoc._id)?.toString(),
      clubname: clubDoc.clubname || clubDoc.name || "Unnamed Club",
      similarity,
      matchPercent,
      scores: clubScoresObj,
    };
  });

  return scored.sort((a, b) => b.similarity - a.similarity);
}

export async function getTopNRecommendations(userId: string, topN = 5) {
  const all = await getAllRecommendations(userId);
  return all.slice(0, topN);
}