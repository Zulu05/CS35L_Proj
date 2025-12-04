// External Dependencies
import { ObjectId } from "mongodb";

// export  class UserResults {
//   constructor(
//     public userId: ObjectId,
//     public scores: {
//       social: number;
//       academic: number;
//       leadership: number;
//       creativity: number;
//     },
//     public id?: ObjectId
//   ) {}
// }  
export default class QuizResponse{
constructor(
    public submissionDate: Date,
    public version: number,
    public answers: { [key: string]: number },
    public clubMatches: string[],
    public id?: ObjectId
){}
}