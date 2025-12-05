import React, { useEffect, useState } from 'react';

// Services
import { checkPassword } from '../../services/admin.service';
function AdminLogin({setIsAdmin}:{setIsAdmin:any}){
    const[passwordInput, setPasswordInput] = useState('');
    const[usernameInput, setUsernameInput] = useState('');
    const[isHacker, setIsHacker] = useState(false);

      //handleSubmit for adminLogin
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUsernameInput("");
        setPasswordInput("");
        const passwordMatch = await checkPassword(usernameInput, passwordInput);
        if (passwordMatch)
          setIsAdmin(true);
        else 
            setIsHacker(true);
          setIsAdmin(false);
      }
    return (
        <>
        <form onSubmit={handleSubmit} className="login-username-form">
          <label>
            {!isHacker? (<span>Username</span>):(<span style = {{color:"red"}}>HACKER</span>)}
            <input
              className="username-input"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
          </label>
        </form>
        <form onSubmit={handleSubmit} className="login-password-form">
          <label>
            {!isHacker? (<span>Password</span>):(<span style = {{color:"red"}}>HACKER</span>)}
            <input
              className="password-input"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
          </label>
        </form>
        </>
    );
}

export default AdminLogin;
