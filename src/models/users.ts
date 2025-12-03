// External dependencies
import { ObjectId } from "mongodb";

export default class User {
  constructor(
    public username: string,
    public email: string,
    private password: string,
    public id?: ObjectId
  ) {}

  public latestClubMatches: Array<{
    clubId: string;
    clubname: string;
    similarity: number;
    matchPercent: number;
  }> = [];

  public quizResponses?: Array<{
    submissionDate: Date;
    version: number;
    answers: {
      social: number;
      academic: number;
      leadership: number;
      creativity: number;
    }
  }> = [];

  public hasPassword(): boolean {
    return !!this.password;
  }
}