/**
 * Core Club entity for metadata (name, contact, description, etc.)
 * 
 * Analytic scoring attributes live in `ClubResults` to avoid mixing
 * identity data with numerical vectors used by the recommendation system.
 */


// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class club {
    constructor(
    public clubname: string,
    public email: string, 
    public scores: {
        social: number;
        academic: number;
        leadership: number;
        creativity: number;
    },
    public id?: ObjectId) {}
}