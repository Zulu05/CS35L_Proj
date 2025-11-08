// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class club {
    constructor(
    public clubname: string,
    public email: string, 
    public id?: ObjectId) {}
}