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