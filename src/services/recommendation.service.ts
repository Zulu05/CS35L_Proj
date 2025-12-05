// External Dependencies
import { ObjectId } from "mongodb";

// Internal Dependencies
// Services
import { collections } from "./database.service";

/**
 * Distance-based similarity between two numeric arrays a and b (user answer and club scores usually) in [0,1].
 * 1 = identical, 0 = as far apart as possible.
 */
export function computeDistanceSimilarity( 
  a: number[],
  b: number[],
  maxScore = 100 // Assuming scores are in [0, 100]
): number {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    throw new Error("Vectors must be arrays of the same length");
  }

  const n = a.length;
  if (n === 0) return 0; // No dimensions, no similarity

  let sumSq = 0;
  for (let i = 0; i < n; i++) { // Compute the sum of squared differences
    const diff = a[i] - b[i];   
    sumSq += diff * diff;      
  }

  const distance = Math.sqrt(sumSq); 
  const maxDistance = Math.sqrt(n) * maxScore; // Convert distance to be out of maxScore (100)

  if (maxDistance === 0) return 0;

  const similarity = 1 - distance / maxDistance;  // Convert distance to similarity percentage
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
 * Normalize any score structure (object or array of trait objects)
 * into a map { [traitId]: value }.
 *
 * Supports:
 * - { social: 50, academic: 60, ... }
 * - [{ traitId: "social", value: 50 }, ...]
 * - [{ id: "social", value: 50 }, ...]  // if your quiz uses 'id'
 */

function normalizeScoresToMap(raw: any): Record<string, number> {
  const result: Record<string, number> = {};

  if (Array.isArray(raw)) {
    for (const entry of raw) {
      if (!entry) continue;
      const id = entry.traitId ?? entry.id;
      if (!id) continue;
      const num = Number(entry.value ?? 0);
      result[id] = isNaN(num) ? 0 : num;
    }
    return result;
  }

  if (raw && typeof raw === "object") {
    for (const key of Object.keys(raw)) {
      const num = Number((raw as any)[key] ?? 0);
      result[key] = isNaN(num) ? 0 : num;
    }
  }

  return result;
}

/**
 * Build aligned numeric vectors for user and club from score maps.
 * Trait order is derived from the user's traits so adding/removing traits
 * requires no code change – just change the quiz / club scores.
 */
function buildAlignedVectors(
  userScoresMap: Record<string, number>,
  clubScoresMap: Record<string, number>
): { userVector: number[]; clubVector: number[]; traitIds: string[] } {
  const traitIds = Object.keys(userScoresMap);

  const userVector = traitIds.map((id) => userScoresMap[id] ?? 0);
  const clubVector = traitIds.map((id) => clubScoresMap[id] ?? 0);

  return { userVector, clubVector, traitIds };
}

/**
 * Fetches the user's score map from quizResponses and
 * computes similarity against every club in collections.clubs.
 * Returns all clubs sorted by similarity descending.
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
  const userScoresRaw = latestQuiz.answers;
  if (!userScoresRaw) {
    throw new Error("Latest quiz response is missing answers");
  }

  // Normalize user scores to a { traitId: value } map
  const userScoresMap = normalizeScoresToMap(userScoresRaw);
  const userTraitIds = Object.keys(userScoresMap);
  if (userTraitIds.length === 0) {
    throw new Error("User has no valid trait scores");
  }

  const clubsCursor = collections.clubs.find({});
  const clubs = await clubsCursor.toArray();

  const scored = clubs.map((clubDoc: any) => {
    const clubScoresRaw = clubDoc.scores || {};
    const clubScoresMap = normalizeScoresToMap(clubScoresRaw);

    const { userVector, clubVector } = buildAlignedVectors(
      userScoresMap,
      clubScoresMap
    );

    const similarity = computeDistanceSimilarity(userVector, clubVector);
    const matchPercent = Math.round(similarity * 100);

    // console.log(
    //   `club ${clubDoc.clubname} | user=${JSON.stringify(
    //     userVector
    //   )} club=${JSON.stringify(clubVector)} similarity=${similarity} matchPercent=${matchPercent}`
    // );

    return {
      clubId: (clubDoc.clubId || clubDoc._id)?.toString(),
      clubname: clubDoc.clubname || clubDoc.name || "Unnamed Club",
      similarity,
      matchPercent,
      scores: clubScoresRaw,
    };
  });

  return scored.sort((a, b) => b.similarity - a.similarity);
}

export async function getTopNRecommendations(userId: string, topN = 5) {
  const all = await getAllRecommendations(userId);
  return all.slice(0, topN);
}