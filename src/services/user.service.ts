import User from "../models/users";

export async function fetchUsers(){
    // Fetch Users
    try{
        const res = await fetch("/users");
        const data = await res.json();
        let rawUserData: any[] = [];
        if (Array.isArray(data)){
            console.log(data);
            rawUserData = data;
        }
        else if (data && Array.isArray(data.users)) {
            console.log(data.users);
            rawUserData = data.users;
        }
        else{
            return [];
        }
        return rawUserData.map(  (u) => new User(u.username, u.email, u.password, u._id || u.id));
    } catch (err)
    {
        console.log("error fetching users: ", err);
        return [];
    }
}