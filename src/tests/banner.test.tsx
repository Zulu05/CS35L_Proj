// External Dependencies
import React from "react";
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, test } from "vitest"

// Internal Dependencies
import Banner from "../components/Pages/banner"

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
});

const renderBanner = () =>
    render(<MemoryRouter><Banner/></MemoryRouter>);


describe("Banner tests if user not logged in", () => {
    beforeEach(()=>{
        vi.clearAllMocks();
        localStorage.clear();
        renderBanner();
    })

    //testing if the buttons exist 
    test("renders home button", ()=>{
        expect(screen.getByText('Home')).toBeInTheDocument();
    })
    test("renders login/create account button", ()=>{
        expect(screen.getByText('Login/Create Account')).toBeInTheDocument();
    })

    //testing navigation
    test("login button navigates to /login", () =>{
        fireEvent.click(screen.getByText('Login/Create Account'));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    })
    test("home button navigates to main screen", () =>{
        fireEvent.click(screen.getByText('Home'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    })
})

describe("HomePage tests if user is logged in", () => {
    beforeEach(()=>{
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('userId', 'ID');
        localStorage.setItem('userName', 'user');
        renderBanner();
    })

    //testing if the buttons exist 
    test("renders home button", ()=>{
        expect(screen.getByText('Home')).toBeInTheDocument();
    })
    test("renders logout button", ()=>{
        expect(screen.getByText('Logout')).toBeInTheDocument();
    })
    test("renders profile button", ()=>{
        expect(screen.getByText('user')).toBeInTheDocument();
    })

    //testing navigation
    test("logout button clears local storage", () =>{
        fireEvent.click(screen.getByText('Logout'));
        expect(localStorage.getItem('userId')).toBeNull();
    })
    test("home button navigates to main screen", () =>{
        fireEvent.click(screen.getByText('Home'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    })
    test("profile button navigates to profile screen", () =>{
        fireEvent.click(screen.getByText('user'));
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    })

})