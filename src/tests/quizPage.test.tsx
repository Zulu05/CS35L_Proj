import React from "react";
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, test, Mock } from "vitest"

// Internal Dependencies
import QuizPage from "../components/Pages/quizPage"
import { fetchTraits } from '../services/traits.service';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
});

const renderQuiz = () =>
    render(<MemoryRouter><QuizPage/></MemoryRouter>);

vi.mock("../services/traits.service", () => ({
    fetchTraits: vi.fn(),
  }));

// Mock fetches from QuizPage:
    // const saveAnswersResp = await fetch(`/users/${userId}/quiz`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ answers: answersArray }),
    // });
    // ...
    // const recResp = await fetch(`/recommendations/${userId}/all`);
    // ...
    // await fetch(`/users/${userId}/quiz/latest-matches`, {
    // method: "PATCH",
    // headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({ clubMatches: recJson.results }),
    // });

global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: vi.fn(),
    text: vi.fn()
}).mockResolvedValueOnce({
    ok: true,
    json: vi.fn().mockResolvedValue({
        results: ["club1", "club2", "club3", "club4", "club5"]
    })
}).mockResolvedValueOnce({
    ok: true,
    json: vi.fn(),
    text: vi.fn()
});


  describe("QuizPage tests if user is not logged in", () => {
    beforeEach(()=>{
        vi.clearAllMocks();
        localStorage.clear();
        (fetchTraits as Mock).mockResolvedValue([]); 
        renderQuiz();
    })

    // test if in loading state
    test("loading state before quiz page appears", async () => {
        expect(screen.getByText('Loading traits...')).toBeInTheDocument();
    })
    // test if after loading, there is a submit button
    test("no traits should still show submit button", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Submit')).toBeInTheDocument();
    })
    // test if submit button shows error
    test("submit button leads to no traits error", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Submit')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Submit'));
        expect(screen.getByText('No user id found. Please log in again.')).toBeInTheDocument();
    })
    // test if back to home button exists
    test("shows back to Back to Home button", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Back to Home')).toBeInTheDocument();
    })
    // test if back to home button works
    test("Back to Home button should navigate to /", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Back to Home')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Back to Home'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    })
})

describe("QuizPage tests if user is logged in but no traits", () => {
    beforeEach(()=>{
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('userId', 'ID');
        (fetchTraits as Mock).mockResolvedValue([]); 
        renderQuiz();
    })

    // test if in loading state
    test("loading state before quiz page appears", async () => {
        expect(screen.getByText('Loading traits...')).toBeInTheDocument();
    })
    // test if after loading, there is a submit button
    test("no traits should still show submit button", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Submit')).toBeInTheDocument();
    })
    // test if submit button shows error
    test("submit button leads to no traits error", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Submit')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Submit'));
        expect(screen.getByText('No traits are configured yet. Try again later.')).toBeInTheDocument();
    })
    // test if back to home button exists
    test("shows back to Back to Home button", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Back to Home')).toBeInTheDocument();
    })
    // test if back to home button works
    test("Back to Home button should navigate to /", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Back to Home')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Back to Home'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    })
})

describe("QuizPage tests if user is logged in and all traits fetched successfully", () => {
    beforeEach(()=>{
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('userId', 'ID');
        (fetchTraits as Mock).mockResolvedValue([
            {
                "_id": "692de874446497a0a42810e7",
                "id": "academic",
                "labelLeft": "Laid-back",
                "labelRight": "Academic",
                "questionText": "How academically focused are you right now?"
            },
            {
                "_id": "692de874446497a0a42810ee",
                "id": "artistic",
                "labelLeft": "Practical",
                "labelRight": "Artistic",
                "questionText": "Would you like it to include artistic or expressive activities?"
            },
            {
                "_id": "692de874446497a0a42810ea",
                "id": "athletic",
                "labelLeft": "Non-athletic",
                "labelRight": "Athletic",
                "questionText": "How active or athletic would you like the club to be?"
            },
            {
                "_id": "692de874446497a0a42810eb",
                "id": "community",
                "labelLeft": "Independent",
                "labelRight": "Community-oriented",
                "questionText": "Do you prefer working in groups or on your own?"
            },
            {
                "_id": "692de874446497a0a42810f3",
                "id": "competitive",
                "labelLeft": "Casual",
                "labelRight": "Competitive",
                "questionText": "How competitive are you when participating in activities?"
            },
            {
                "_id": "692de874446497a0a42810e9",
                "id": "creativity",
                "labelLeft": "Analytical",
                "labelRight": "Creative",
                "questionText": "How do you prefer to approach problems or projects?"
            },
            {
                "_id": "692de874446497a0a42810ef",
                "id": "cultural",
                "labelLeft": "Non-Cultural",
                "labelRight": "Culturally Engaged",
                "questionText": "How involved would you like to be in cultural or heritage-based communities?"
            },
            {
                "_id": "692de874446497a0a42810e8",
                "id": "leadership",
                "labelLeft": "Supporter",
                "labelRight": "Leader",
                "questionText": "How would you describe your leadership tendencies?"
            },
            {
                "_id": "692de874446497a0a42810f5",
                "id": "outdoors",
                "labelLeft": "Indoorsy",
                "labelRight": "Outdoorsy",
                "questionText": "Do you prefer activities outdoors or indoors?"
            },
            {
                "_id": "692de874446497a0a42810ec",
                "id": "professional",
                "labelLeft": "Just for fun",
                "labelRight": "Career-focused",
                "questionText": "How focused are you on career or professional development?"
            },
            {
                "_id": "692de874446497a0a42810f1",
                "id": "research",
                "labelLeft": "Hands-on",
                "labelRight": "Research-oriented",
                "questionText": "Do you prefer deep research or practical project work?"
            },
            {
                "_id": "692de874446497a0a42810f0",
                "id": "service",
                "labelLeft": "Self-focused",
                "labelRight": "Service-oriented",
                "questionText": "Do you prefer clubs that focus on community service or personal growth?"
            },
            {
                "_id": "692de874446497a0a42810e6",
                "id": "social",
                "labelLeft": "Introvert",
                "labelRight": "Extrovert",
                "questionText": "Use the slider to indicate where you fall on this spectrum:"
            },
            {
                "_id": "692de874446497a0a42810f2",
                "id": "social_impact",
                "labelLeft": "Fun-driven",
                "labelRight": "Impact-driven",
                "questionText": "Would you like more impact or enjoyment?"
            },
            {
                "_id": "692de874446497a0a42810ed",
                "id": "technical",
                "labelLeft": "Non-technical",
                "labelRight": "Technical",
                "questionText": "How comfortable are you with technology and technical work?"
            },
            {
                "_id": "692de874446497a0a42810f4",
                "id": "time_commitment",
                "labelLeft": "Low Commitment",
                "labelRight": "High Commitment",
                "questionText": "How much time would you like to dedicate to a club?"
            }]); 
        renderQuiz();
    })

    // test if in loading state
    test("loading state to start", async () => {
        expect(screen.getByText('Loading traits...')).toBeInTheDocument();
    })
    // test if there is a submit button
    test("shows submit button", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Submit')).toBeInTheDocument();
    })
    //test if questions appear
    test("renders all questions", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.queryByText('How academically focused are you right now?')).toBeInTheDocument();
        expect(screen.queryByText('Would you like it to include artistic or expressive activities?')).toBeInTheDocument();
        expect(screen.queryByText('How active or athletic would you like the club to be?')).toBeInTheDocument();
        expect(screen.queryByText('Do you prefer working in groups or on your own?')).toBeInTheDocument();
        expect(screen.queryByText('How competitive are you when participating in activities?')).toBeInTheDocument();
        expect(screen.queryByText('How do you prefer to approach problems or projects?')).toBeInTheDocument();
        expect(screen.queryByText('How involved would you like to be in cultural or heritage-based communities?')).toBeInTheDocument();
        expect(screen.queryByText('How would you describe your leadership tendencies?')).toBeInTheDocument();
        expect(screen.queryByText('Do you prefer activities outdoors or indoors?')).toBeInTheDocument();
        expect(screen.queryByText('How focused are you on career or professional development?')).toBeInTheDocument();
        expect(screen.queryByText('Do you prefer deep research or practical project work?')).toBeInTheDocument();
        expect(screen.queryByText('Do you prefer clubs that focus on community service or personal growth?')).toBeInTheDocument();
        expect(screen.queryByText('Use the slider to indicate where you fall on this spectrum:')).toBeInTheDocument();
        expect(screen.queryByText('Would you like more impact or enjoyment?')).toBeInTheDocument();
        expect(screen.queryByText('How comfortable are you with technology and technical work?')).toBeInTheDocument();
        expect(screen.queryByText('How much time would you like to dedicate to a club?')).toBeInTheDocument();
    })
    // test if correct number of sliders appear
    test("quiz page has sliders with default value", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        const sliders = await screen.findAllByRole('slider');

        expect(sliders.length).toBe(16);
    
        sliders.forEach((slider, index) => {
          expect((slider as HTMLInputElement).value).toBe('50');
        });
    })
    // test if sliders work as intended
    test("quiz page has working slider", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        const sliders = await screen.findAllByRole('slider');
    
        fireEvent.change(sliders[0], { target: { value: '80' } });
        fireEvent.change(sliders[1], { target: { value: '30' } });
        fireEvent.change(sliders[2], { target: { value: '100' } });
    
        expect((sliders[0] as HTMLInputElement).value).toBe('80');
        expect((sliders[1] as HTMLInputElement).value).toBe('30');
        expect((sliders[2] as HTMLInputElement).value).toBe('100');
      })
    // test if submit button works
    test("submit button leads to results page", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Submit')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(
              '/matches',
              expect.objectContaining({
                state: { top5: ["club1", "club2", "club3", "club4", "club5"] }
              })
            );
        });
    })
    // test if back to home button exists
    test("shows back to Back to Home button", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Back to Home')).toBeInTheDocument();
    })
    // test if back to home button works
    test("Back to Home button should navigate to /", async () => {
        await waitFor(() => expect(screen.getByText('Quiz')).toBeInTheDocument());
        expect(screen.getByText('Back to Home')).toBeInTheDocument();
    
        fireEvent.click(screen.getByText('Back to Home'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    })
})