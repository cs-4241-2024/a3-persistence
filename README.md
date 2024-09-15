Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
---

## Task Master v2

https://a3-colegw-cole-welcher-6ba1da897e4b.herokuapp.com/login 

Login: Via Github or a@a with password a

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:
Picture of Task (should always be dark even in lightmode):
![image](https://github.com/user-attachments/assets/9c0193b1-ec9f-4dd2-9c99-36fe7fd631b7)

- The goal of the application:
  The goal of the application is to have a simple web sticky note with tasks so that you can always remeber what you need to do as long as you have internet access
- Challenges you faced in realizing the application:
  Some challenges I faced were using a predetermined style, and using express for the first time, but there were tons of videos online that helped!
- What authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable):
  I made my own login/password authentication but I also added OAuth for Github because that was what was recommened as everyone in this class needs a github!
- What CSS framework you used and why:
  I used simple min css: https://cdn.simplecss.org/simple.min.css , because I had already implemented a custom css for my stuff before realizing I needed to use one
  so I used a simple one that didn't override my current css to give my site some more enrichment
  - The customization is in style.css and it has to do with login pages and the table set.
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please add a little more detail about what it does.:
    1.express.urlencoded({ extended: true }): Parses URL-encoded data from forms and makes it accessible via req.body.
    2.express-session: Manages user sessions with a server-side store and a unique session ID sent to the client, configured with a secret and options to control session behavior.
    3.express-flash: Enables flash messages, which are temporary messages (e.g., success or error) stored in the session and displayed to users on the next request.
    4.passport.initialize(): Initializes Passport for authentication, setting up middleware to handle user authentication and session management.
    5.passport.session(): Integrates Passport with Express session management to support persistent login sessions.
    6.method-override('_method'): Allows HTTP methods such as PUT or DELETE to be used in forms by overriding the method specified in a form’s _method field.
    7.express.static(path.join(__dirname, 'public')): Serves static files (like CSS, JavaScript, and images) from the public directory.
    8.express.json(): Parses incoming JSON payloads and makes them accessible via req.body.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy on passport.js, I also implemented my own login using bycrypt and env variables for salting and hashing into my own database.
- **Tech Achievement 2**: I used heroku to host my website. I liked it alot better then glitch because it gave me more information about my website and what was wrong then the simplicty of glitch which I really enjoyed. The only thing worse was there was no guide on the canvas page so I had to find my own :).
- **Tech Achievement 3**: I have 100% on lighthouse on all pages:
  Login:
  
  ![image](https://github.com/user-attachments/assets/cc13f260-e1aa-4c3b-a1dc-541c79403cf9)
  
  Register:
  
  ![image](https://github.com/user-attachments/assets/9e6dbb28-8c6a-4675-ba93-8cc80d4d41b4)
  
  Main Page:
  
  ![image](https://github.com/user-attachments/assets/064c51a9-6d27-4edb-b3f9-8d9b14abda93)

-  **Tech Achievement 4**:
    1.express.urlencoded({ extended: true }): Parses URL-encoded data from forms and makes it accessible via req.body.
    2.express-session: Manages user sessions with a server-side store and a unique session ID sent to the client, configured with a secret and options to control session behavior.
    3.express-flash: Enables flash messages, which are temporary messages (e.g., success or error) stored in the session and displayed to users on the next request.
    4.passport.initialize(): Initializes Passport for authentication, setting up middleware to handle user authentication and session management.
    5.passport.session(): Integrates Passport with Express session management to support persistent login sessions.
    6.method-override('_method'): Allows HTTP methods such as PUT or DELETE to be used in forms by overriding the method specified in a form’s _method field.
    7.express.static(path.join(__dirname, 'public')): Serves static files (like CSS, JavaScript, and images) from the public directory.
    8.express.json(): Parses incoming JSON payloads and makes them accessible via req.body.

