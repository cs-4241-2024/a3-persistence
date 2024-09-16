## a3-smoliner1

https://a3-smoliner1.glitch.me/

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.

This project takes the program from a2 a step further, while still being an Arcade Scoreboard website, but now including the use of a database for data storage, as well as a login page and the use of nes.css.
There were several times where I got stuck, but I managed to figure it out within the same day most of the time. There were a few things that took longer, and ended up being very minor and simple fixes.
Authentication simply checks the database for matching credentials to what was entered. If a match exists, it logs in with those credentials. If not, it creates an account with those credentials if the given username doesn't already exist (if it does, it will simply fail to login and you will need to try again). I went with this because it's both easy and relatively user-friendly.
I used nes.css because it fits with the Arcade theme.

## Technical Achievements
- **Express Middleware Packages**: I used cookie-session, which essentially stores a cookie with the login credentials used.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
