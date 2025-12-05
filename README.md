The app is a personality type quiz meant to match users with different UCLA clubs based on their answers<br />
Must be a logged in user to take the test, new users should use the create account button on the login page<br />
Profile saves username, email and top 5 matches from the latest quiz taken<br />
Club Information page shows the users match percentage with all clubs (from the latest quiz). Has the ability to search by name and filter by club traits <br />


How to run and install project: <br />
    &emsp;Run "git clone https://github.com/Zulu05/CS35L_Proj"<br />
    &emsp;Run "npm install"<br />
    &emsp;Create .env from the .env.example file and change "username" and "password" in "DB_CONN_STRING" to your username and password<br />
    &emsp;Run "npm run dev" to test out the application

    
Note: end to end testing implemeneted with cucumber and playwright, run via "npm test"<br />
Note: more tests can be run with the command "npm run test:unit"<br />
Note: UML Diagrams are in the Diagrams folder 
