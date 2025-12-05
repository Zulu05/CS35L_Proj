Programm currently implements VERY basic Typecript Application. App.tsx returns homePage and button to quizPage (which doesn't work yet).

Resources Recommended/Used:
End-to-end Web Testing Frameworks

Playwright

futureImplementations.txt has elements that we will probabbly be using but haven't been implemented into the interface yet. 

current stack: MERN 

(Let's use assignment 5's README as a template)

https://www.sohamkamani.com/typescript/rest-http-api-call/

The app is a personality type quiz meant to match users with different UCLA clubs based on their answers
Must be a logged in user to take the test, new users should use the create account button on the login page
Profile saves username, email and top 5 matches from the latest quiz taken
Club Information page shows the users match percentage with all clubs (from the latest quiz), but the ability to search by name 

How to run and install project:
    Run "git clone https://github.com/Zulu05/CS35L_Proj"
    Run "npm install"
    Create .env from the .env.example file and change "<username>" and "<password>" in "DB_CONN_STRING" to your username and password
    Run "npm run dev" to test out the application

Note: end to end testing implemeneted with cucumber and playwright, run via "npm test"
