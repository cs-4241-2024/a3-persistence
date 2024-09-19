## Book Tracker - Carter Moore

Vercel Deployment: https://a3-carter-moore.vercel.app/

My project allows you to track books that you've read, are reading or are going to read. Books that you have read count towards the set reading goal and changing the status of books will autofill start/end date information if you don't specify any.

Working with a pre-made CSS framework saved time, but it was difficult to style the individual elements in the layout that I wanted on top of the framework styles. I also struggled with OAuth authentication like when applying middleware that checks for authentication, and integrating with Github. It got a little overwhelming on the backend with all the different roots.

I chose to use OAuth authentication via Github and Passport.js. Using Github seemed like the easier choice since Github provides an authentication page and user information that can be used for querying the database.

I chose PicoCSS because it seemed clean and easy to use while providing all the functionality I wanted. It also let me choose a single theme color to use across all the primary elements. I only had to write a couple CSS rules to change the layout and spacing of elements on the page.

## Technical Achievements
- **OAuth Authentication**: I used OAuth authentication via the GitHub strategy to authenticate users. The Github user ID is used when querying the database so that only the user's data is retrieved. Users are redirected to my login/landing page when not authenticated, and will remain login via express session cookies.
- **Vercel Hosting**: Vercel made it super simple to deploy my project by just connecting to my Github repo and automatically building and deploying the project even when the repo gets new commits. It also allowed for easy adding of environment variables. Finally, it provides more analytics and customization compared to Glitch. The only plus that Glitch has is that you can also edit code using it.
- **100% Lighthouse Score**:
![alt 100% lighthouse report](./public/images/lighthouse-report.png)