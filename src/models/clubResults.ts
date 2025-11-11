// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class clubResults {
    constructor(
    public clubname: string,
    public id?: ObjectId) {}
}