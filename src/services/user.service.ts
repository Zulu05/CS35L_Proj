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

export async function createUser(user: {username: string, email: string}) {
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
    }
}

//need to update
export async function addPassowrd(id: string, password: string){
    // Fetch Users
    try{
        const res = await fetch("/users/${id}");
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