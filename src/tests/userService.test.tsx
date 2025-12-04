import { describe, it, expect, beforeEach, vi } from "vitest";
import User from "../models/users";
import { fetchUsers } from "../services/user.service";

const mostFetchUsers = vi.fn(async () => [
{
  "username": "user2",
  "email": "user2@gmail.com",
  "password": "user2Password!",
  "quizResponses": [
    {
      "submissionDate": {
        "$date": "2025-11-30T23:23:35.119Z"
      },
      "version": 1,
      "answers": {
        "social": 50,
        "academic": 50,
        "leadership": 50,
        "creativity": 50
      },
      "clubMatches": []
    }
  ],
  "updatedAt": {
    "$date": "2025-11-30T23:23:35.377Z"
  },
  "latestClubMatches": [
    {
      "clubId": "692ccfad446497a0a4281051",
      "clubname": "Chess Club",
      "correlation": 0,
      "matchPercent": 0,
      "score": {
        "social": 70,
        "academic": 85,
        "leadership": 60,
        "creativity": 40
      }
    },
    {
      "clubId": "692ccfad446497a0a4281052",
      "clubname": "Robotics Club",
      "correlation": 0,
      "matchPercent": 0,
      "score": {
        "social": 60,
        "academic": 95,
        "leadership": 80,
        "creativity": 75
      }
    },
    {
      "clubId": "692ccfad446497a0a4281053",
      "clubname": "Art Society",
      "correlation": 0,
      "matchPercent": 0,
      "score": {
        "social": 85,
        "academic": 60,
        "leadership": 55,
        "creativity": 95
      }
    },
    {
      "clubId": "692ccfad446497a0a4281054",
      "clubname": "Environmental Club",
      "correlation": 0,
      "matchPercent": 0,
      "score": {
        "social": 90,
        "academic": 75,
        "leadership": 70,
        "creativity": 80
      }
    },
    {
      "clubId": "692ccfad446497a0a4281055",
      "clubname": "Entrepreneurship Club",
      "correlation": 0,
      "matchPercent": 0,
      "score": {
        "social": 75,
        "academic": 80,
        "leadership": 95,
        "creativity": 65
      }
    }
  ]
}
]);
describe("fetchUsers", () =>{

})