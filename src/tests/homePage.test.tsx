import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, test } from "vitest"
import HomePage from "../components/Pages/homePage"
import { UNSAFE_getPatchRoutesOnNavigationFunction } from "react-router-dom";
import React from "react";
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
});

const renderHome = () =>
    render(<MemoryRouter><HomePage/></MemoryRouter>);


describe("HomePage tests if user not logged in", () => {
    beforeEach(()=>{
        vi.clearAllMocks();
        localStorage.clear();
        renderHome();
    })

    //testing if the buttons exist 
    test("renders start quiz button", ()=>{
        expect(screen.getByText('Start Quiz')).toBeInTheDocument();
    })
    test("renders login button", ()=>{
        expect(screen.getByText('Login')).toBeInTheDocument();
    })
    test("renders club info button", ()=>{
        expect(screen.getByText('Club Information')).toBeInTheDocument();
    })
    test("doesn't render profile button", ()=>{
        expect(screen.queryByText('profile')).not.toBeInTheDocument();
    })
    test("login button navigates to /login", () =>{
        fireEvent.click(screen.getByText('Login'));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    })
    test("quiz page button navigates to /login", () =>{
        fireEvent.click(screen.getByText('Start Quiz'));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    })
    test("club info button navigates to /clubInfo", () =>{
        fireEvent.click(screen.getByText('Club Information'));
        expect(mockNavigate).toHaveBeenCalledWith('/clubInfo');
    })
})

describe("HomePage tests if user is logged in", () => {
    beforeEach(()=>{
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('userId', 'ID');
        renderHome();
    })

    
    //testing if the buttons exist 
    test("renders start quiz button", ()=>{
        expect(screen.getByText('Start Quiz')).toBeInTheDocument();
    })
    test("doesn't render login button", ()=>{
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
    })
    test("renders club info button", ()=>{
        expect(screen.getByText('Club Information')).toBeInTheDocument();
    })
    test("renders profile button", ()=>{
        expect(screen.getByText('Profile')).toBeInTheDocument();
    })
    test("quiz page button navigates to /quiz", () =>{
        fireEvent.click(screen.getByText('Start Quiz'));
        expect(mockNavigate).toHaveBeenCalledWith('/quiz');
    })
    test("club info button navigates to /clubInfo", () =>{
        fireEvent.click(screen.getByText('Club Information'));
        expect(mockNavigate).toHaveBeenCalledWith('/clubInfo');
    })
    test("profile button navigates to /profile", () =>{
        fireEvent.click(screen.getByText('Profile'));
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    })

})