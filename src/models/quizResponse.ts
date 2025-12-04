// External Dependencies
import { ObjectId } from "mongodb";

export default class QuizResponse{
constructor(
    public submissionDate: Date,
    public version: number,
    public answers: { [key: string]: number },
    public clubMatches: string[],
    public id?: ObjectId
){}
}