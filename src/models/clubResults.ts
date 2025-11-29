/**
 * UserResults represents the *numeric feature vector* of a user that is used
 * exclusively for recommendation, analytics, and statistical matching.
 *
 * DESIGN PRINCIPLES APPLIED:
 *
 * - Separation of Concerns:
 *   The `User` model handles identity/profile data, while this model handles
 *   only the user's scored attributes. This prevents mixing unrelated types
 *   of data and keeps each model conceptually clean.
 *
 * - Single Responsibility Principle (SRP):
 *   This class has exactly one purpose: storing the user’s scoring vector.
 *   It does not deal with authentication, routing, or recommendation logic.
 *
 * - Modularity & Reusability:
 *   By isolating score data in its own model, the recommendation engine can
 *   reuse this module directly without depending on user identity structures.
 *   It also makes it easier to version or extend scoring dimensions later.
 */

import { ObjectId } from "mongodb";

export default class UserResults {
  constructor(
    public userId: ObjectId,
    public id?: ObjectId
  ) {}
}
