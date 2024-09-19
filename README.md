## Match Me!
Vercel: https://a3hannatrinh.vercel.app/
Match Me is a simple shape game where players match colored shapes to their silhouettes. Each turn, the game shuffles the shapes to increase difficulty and keep the game engaging. The project is written in JavaScript and run using Node.js. The app utilized MongoDB as the backend which stores player name, score, and time.

I faced a lot of challenges with Auth0 and deploying to Vercel. Auth0 at once point seemed easy to connect but was confusing because I initially followed the Passport.JS docs which made it even worse.

I chose Auth0 because it has the implemented login, logout, and signup page for you. Additionally, this was what my team in SoftEng used but I had never understood how it was implemented so I wanted to give it a go.

I used TailwindCSS because that was the template I was most familiar with, I had used it for almost every application. I had made no changes to the original css.

## Technical Achievements
- **Implementing Auth0**: I used Auth0 through the Github strategy and also a youtubeb video that gave a tutorial on how to implement it without passport.js
-- **Dummy Account**
- User: test@gmail.com
- Pass: cs4241_test!

- **Deployment on Vercel**: I used Vercel to deploy which was a doozy, I had to completely modify my backend and create a vercel.JSON file separately after several hours of research. Turns out deploying to server makes it stateless and thus most of the middleware or sessions get lost, thus we need to handle that. I do love the fact that Vercel automatically updates the website based on your git, so you do not need to reupload to Vercel as it will just do that for you. I also appreciate the build logs Vercel provides as it is very helpful in understanding errors.

- **Middleware**: Used Express.json, Express.static, MongoDBStore middleware,and Express-OpenID-connect middleware

### Design/Evaluation Achievements
- **CRAP Principles**: I used a lot of contrast with the colours which were a mix of cream, pink, and purple to keep all elements easily identifable. Repetition was the use of div elements which was repeated throughout the page. Additionally, I used alignment by keeping everything center, even the whole game itself is centered and made so smaller, which made it a simple game. Finally, I used proximity with the shapes and scores to keep elements easily identifiable.

- **Accessible Website**: I followed the following tips from the W3C Web Accessibility Initiative high contrast for reading ease, using id for attritute for form elements, I used colour and letters to refer to an object, for example buttons with appropriate colours indidcating their use. Interactive elements have a hover effect for clarity and the mouse are changed for clarity. Forms are clearly labeled with their detail. I use quite a bit of space for clarity and clear relationship bby using clear headings.  
