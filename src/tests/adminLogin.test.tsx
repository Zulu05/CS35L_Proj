// External Dependencies
import React, { useState } from "react";
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import { describe, expect, vi, beforeEach, test } from "vitest"
 
// Internal Dependencies
import AdminLogin from "../components/Pages/adminLogin"


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
});

const Wrapper: React.FC = () => {
    const [isAdmin, setIsAdmin] = React.useState(false);
    return <AdminLogin setIsAdmin={setIsAdmin} />;
  };

const renderHome = () =>
    render(<MemoryRouter><Wrapper/></MemoryRouter>);


describe("HomePage tests if admin not logged in", () => {
    beforeEach(()=>{
        vi.clearAllMocks();
        localStorage.clear();
        renderHome();
    })

    //testing if the login exists
    test("renders username", ()=>{
        expect(screen.getByText('Username')).toBeInTheDocument();
    })
    test("renders password", ()=>{
        expect(screen.getByText('Password')).toBeInTheDocument();
    })

    // testing if the information hidden doesn't show
    test("doesn't render hidden information", ()=>{
        expect(screen.queryByText('Add New User')).not.toBeInTheDocument();
        expect(screen.queryByText('Add User')).not.toBeInTheDocument();
        expect(screen.queryByText('Add Club')).not.toBeInTheDocument();
    })
    test("doesn't render club score change buttons", ()=>{
        expect(screen.queryByText('Update Scores')).not.toBeInTheDocument();
    })

    // testing that false usernames / passwords don't work
    test("false usernames / passwords don't work", async () =>{
        const user = userEvent.setup();

        const usernameInput = await screen.getByLabelText(/Username/i);
        const passwordInput = await screen.getByLabelText(/Password/i);
    
        await user.type(usernameInput, "admin123");
        await user.type(passwordInput, "Password123!");
    
        expect(usernameInput).toHaveValue("admin123");
        expect(passwordInput).toHaveValue("Password123!");

        await user.keyboard("{Enter}");

        const hacker = screen.getAllByText("HACKER");
        expect(hacker.length).toBe(2); 
        
        expect(screen.queryByText('Username')).not.toBeInTheDocument();
        expect(screen.queryByText('Password')).not.toBeInTheDocument();
    })
    test("typing updates the username and password fields", async () => {
        const user = userEvent.setup();
    
        const username = screen.getByLabelText("Username") as HTMLInputElement;
        const password = screen.getByLabelText("Password") as HTMLInputElement;
    
        await user.type(username, "pedro123");
        await user.type(password, "mypassword");
    
        expect(username.value).toBe("pedro123");
        expect(password.value).toBe("mypassword");
      });
})
