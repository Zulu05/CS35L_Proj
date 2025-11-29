// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class User {
    constructor(
    public username: string,
    public email: string, 
    private password: string,
    public id?: ObjectId) {}

    // Quiz responses stored on the user document
    public quizResponses?: Array<{
      submissionDate: Date;
      version: number;
      answers: {
        social: number;
        academic: number;
        leadership: number;
        creativity: number;
      },
      clubMatches: string[];
    }> = [];

    // Method to check password (plaintext comparison for now)
    public hasPassword(): boolean {
      return !!this.password
    }

    public checkPassword(password: string): boolean {
        return this.password === password;
    }
}