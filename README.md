
## Clicker Website 2.0 (With Login functionality

https://d52199b4-b1d4-4d06-ac2c-e492a9bd9c78-00-2cg1ciq4j7yzp.janeway.replit.dev

#### Key Features:
- User registration and login system
- Click speed game with a 5-second timer
- Leaderboard showing top scores
- Play again functionality

### Application Goal
The goal of the application is to just be a fun game for users to test their click speed and compare scores on a leaderboard. It also allows users to register and log in to track their scores and compete with others.

### Challenges Faced
- **Leaderboard Display:** Sorting and displaying the leaderboard dynamically while ensuring that only the logged-in user could delete their own scores was a challenge. I got the log in functionality working pretty early but integrating that with my score system and making it so only users can delete their scores was difficult. I ended up deleting the ability for users to add their own scores because i couldnt get it to work. 

### Authentication Strategy
I chose to use **session-based authentication** with `express-session`. because it was the easiest to implement

### CSS Framework
I used **NES.css** for the retro video game aesthetic and it was listed in the a3 read me. I customized the framework using additional custom CSS to:
- Center game elements on the page.
- Modify the leaderboard table with background colors and borders.
- Add pulsating animation to the click counter for visual feedback during the game.

### Express Middleware
1. **`express.static`**: Serves static files (e.g., HTML, CSS, JavaScript) from the `public` folder, allowing the app to display the front-end resources.
2. **`express.json`**: Parses incoming request bodies in JSON format, making it easier to handle form submissions and API requests.
3. **`express-session`**: Manages user sessions for authentication, storing user information securely on the server.
4. **`bcryptjs`**: Used for hashing passwords before storing them in MongoDB, ensuring user credentials are securely stored.
5. **Custom Middleware for Authentication**: I created a middleware function (`isAuthenticated`) that checks if a user is logged in before allowing them to access certain routes, ensuring that only authenticated users can interact with specific features like submitting scores.

## Technical Achievements
- Used replit instead of Glitch, since a1 I have had an issue getting my website to display in glitch because I transer it from vscode. It look me 1-2 hours of troubleshooting with glitch each assignment to get it to work properly. Replit I just cloned my git repo and it just worked. I do prefer how glitch has a link that always works. I hope that y replit link does not stop working by the time grading begins. 

