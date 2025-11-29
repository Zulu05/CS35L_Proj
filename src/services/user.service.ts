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

// export async function addUser(){
//     try {
//       const res = await fetch('/users', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newUser),
//       });

//       if (!res.ok) throw new Error('Failed to create user');

//       const created: User = await res.json();

//       setUsers((prev) => [...prev, created]);
//       setNewUser({ username: '', email: '' });
//     } catch (err) {
//       console.error(err);
//       setUsersError('Error adding user');
//     }
// }

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