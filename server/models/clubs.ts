import { ObjectId } from "mongodb";

export default class Club {
    constructor(public name: string, public stat1: number, public category: string, public id?: ObjectId) {}
}