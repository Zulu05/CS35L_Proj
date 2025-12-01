/**
 * Core Club entity for metadata (name, contact, description, etc.)
 *
 * Analytic scoring attributes live in `scores` as an array of TraitScore
 * so we can flexibly add/remove traits without changing the class shape.
 */

// External dependencies
import { ObjectId } from "mongodb";

export interface TraitScore {
  traitId: string; // "social", "academic", etc.
  value: number;   //0–100
}

// Class Implementation
export default class Club {
  constructor(
    public clubname: string,
    public email: string,
    public scores: TraitScore[],
    public id?: ObjectId
  ) {}
}