// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class User {
    constructor(
    public username: string,
    public email: string, 
    //private password: string,
    public id?: ObjectId) {}

    // Method to check password
    //public checkPassword(password: string): boolean {
        //return this.password === password;
    //}
}