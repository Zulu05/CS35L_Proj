// External Dependencies
import React from "react";
import { useNavigate } from 'react-router-dom';


const Banner: React.FC = () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const username = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
    console.log(username);
    const navigate = useNavigate();
    return(
    <>
    <div style={{
        position: "fixed",
        top: 10,
        left: 10,
        display: "flex",
        gap: "10px",
        zIndex: 1000,
      }}>
        <button
            onClick={() => {
              navigate('/');
            }}
            style={{ marginLeft: 8 }}
          >
            Home
          </button>
    </div> 
    <div style={{
        position: "fixed",
        top: 10,
        right: 10,
        display: "flex",
        gap: "10px",
        zIndex: 1000,
      }}> 
      {userId && (
        <>
          <button
            onClick={() => {
              localStorage.removeItem('userId');
              localStorage.removeItem('userName');
              navigate('/');
            }}
            style={{ marginLeft: 8 }}
          >
            Logout
          </button>
          <button
            onClick={() => {
              const id = localStorage.getItem('userId');
              navigate(id ? '/profile' : '/login');
            }}
            style={{ marginLeft: 8 }}
          >
            {username}
          </button>
        </>
      )}
            {!userId && (
        <button
          onClick={() => {
            navigate('/login');
          }}
          style={{ marginLeft: 8 }}
        >
          Login/Create Account 
        </button>
      )}
    </div>
    </>
)
}

export default Banner 
