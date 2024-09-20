## To-Do List with Login Credentials

Jake Olsen: http://a3-charlie-roberts.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored

The goal of this application is to create a To-Do list for many users to be able to keep track of tasks they need to complete. During the creation of this site I faced challenges in mostly the back end development. Connecting to the database as well as diving into cookies for a user session proved to be more challenging than I expected. To create the authentication portion of the website I just created a seperate database for usernames and passwords and queried the database on sign in to check if there was a valid username and password. I chose this method because I felt it would be the easiest. I also used the beercss framework because it seemed very simple to implement and had a modern design. 

## Technical Achievements
- **Express-session**: I used the express-session middle ware in order to handle different user sessions. I used it by checking if a users request includes a session cookie. If it does, the middleware retrieves the session data from the server and attaches it to the request so that it can be displahyed in the app.
