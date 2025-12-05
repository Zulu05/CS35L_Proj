// External dependencies
import { ObjectId } from "mongodb";

export default class Admin {
  constructor(
    public username: string,
    private password: string,
    public id?: ObjectId
  ) {}
}