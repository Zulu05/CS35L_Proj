import { userInfo } from "os";
import Club from "../models/clubs";

export async function fetchClubs(){
    // Fetch Users
    try{
        const res = await fetch("/clubs");
        const data = await res.json();
        let rawUserData: any[] = [];
        if (Array.isArray(data)){
            console.log(".isarray", data);
            rawUserData = data;
        }
        else if (data && Array.isArray(data.clubs)) {
            console.log(data.clubs);
            rawUserData = data.clubs;
        }
        else{
            return [];
        }
        return rawUserData.map(  (u) => new Club(u.username, u.email, u._id || u.id));
    } catch (err)
    {
        console.log("error fetching clubs: ", err);
        return [];
    }
}

export async function createClub(club: {username: string, email: string}) {
    try {
      const res = await fetch('/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(club),
      });
      if (!res.ok) throw new Error('Failed to create club');
      const data = await res.json();
      return new Club(data.username, data.email, data._id || data.id);
    } catch (err) {
      console.error(err);
      console.log('Error adding club');
    }
}