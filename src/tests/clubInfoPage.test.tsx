import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, test } from "vitest"
import { UNSAFE_getPatchRoutesOnNavigationFunction } from "react-router-dom";
import React from "react";
import { MemoryRouter } from 'react-router-dom';
import ClubDirectory from "../components/Pages/clubInfoPage";

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
});

const renderClubInfoPage = () =>
    render(<MemoryRouter><ClubDirectory/></MemoryRouter>);


describe("ClubDirectory tests", () => {
    beforeEach(()=>{
        vi.clearAllMocks();
        localStorage.clear();
        renderClubInfoPage();
    })
    //testing if the information exists
    test("renders title", ()=>{
        expect(screen.getByText('Club Directory')).toBeInTheDocument();
    })
    test("renders subtitle", ()=>{
        expect(screen.getByText('Discover clubs on campus and find one that matches your interests.')).toBeInTheDocument();
    })

    //testing if the buttons exist 
    test("renders back to home", ()=>{
        expect(screen.getByText('Back to Home')).toBeInTheDocument();
    })

    //testing navigation
    test("back to home button navigates to Home", () =>{
        fireEvent.click(screen.getByText('Back to Home'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    })
})