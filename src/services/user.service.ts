import { syncBuiltinESMExports } from "module";
import User from "../models/users";

export async function fetchUsers() {
  try {
    const res = await fetch("/users");
    const data = await res.json();

    let rawUserData: any[] = [];
    if (Array.isArray(data)) {
      rawUserData = data;
    } else if (data && Array.isArray(data.users)) {
      rawUserData = data.users;
    } else {
      return [];
    }

    return rawUserData.map((u) => {
      const user = new User(u.username, u.email, u.password, u._id || u.id);
      user.quizResponses = u.quizResponses ?? []; 
      user.latestClubMatches = u.latestClubMatches ?? [];
      return user;
    });
  } catch (err) {
    console.log("error fetching users: ", err);
    return [];
  }
}

export async function createUser(user: {username: string, email: string, password?: string }) {
    try {
      const res = await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error('Failed to create club');
      const data = await res.json();
      return new User(data.username, data.email, data._id || data.id);
    } catch (err) {
      console.error(err);
      console.log('Error adding user');
      return null
    }
}

export async function addPassword(id: string, password: string){
    // Fetch Users
    try{
        const res = await fetch(`/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        });
        if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to set password: ${res.status}`);
        }
        const data = await res.json();
        return new User(data.username, data.email, data.password, data._id || data.id);
    } catch (err)
    {
        console.log("error fetching users: ", err);
        return null;
    }
}

export async function addResult(userId: string, answersDict: { [key: string]: number }){
    try {
      const res = await fetch(`/users/${userId}/quiz`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersDict }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Failed to submit quiz:', msg);
      throw new Error(msg);
    }
}

export async function fetchSingleUser(userId: string): Promise<User | null> {
  try {
    const res = await fetch("/users");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    let rawUserData: any[] = [];
    if (Array.isArray(data)) {
      rawUserData = data;
    } else if (data && Array.isArray(data.users)) {
      rawUserData = data.users;
    } else {
      return null;
    }

    const targetId = userId.toString();

    const match = rawUserData.find((u) => {
      const rawId = (u._id ?? u.id)?.toString();
      return rawId === targetId;
    });

    if (!match) return null;

    const user = new User(
      match.username,
      match.email,
      match.password,
      (match._id ?? match.id)?.toString()
    );
    user.quizResponses = match.quizResponses ?? [];
    user.latestClubMatches = match.latestClubMatches ?? [];

    return user;
  } catch (err) {
    console.error("error fetching single user:", err);
    return null;
  }
}