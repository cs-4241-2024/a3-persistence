## Grocery List

https://cs-4241-a3-production.up.railway.app/

## Description

This is a simple web application that allows users to add items to their grocery list. It uses Github OAuth to authenticate users and stores the grocery lists per-user in a MongoDB database.

OAuth was by far the most challenging aspect of this project; even though Passport.js made it quite easy, there were a lot of quirks with integrating it with Express. I used the Github OAuth strategy (as required by the assignment), and aside from the issues within Passport.js, Github's OAuth implementation was relatively straightforward.

Another challenging aspect was the database design; I've never used MongoDB before, so using a non-relational database for the first time was a challenge. It required writing some workarounds for certain features of the app; for example, removing an element from an array by index in MongoDB is not built-in to MongoDB by default, so I had to instead write a workaround that concatenated the array up to that index, then the array from that index to the end, thereby deleting the element at that index.

This app uses blocks.css as a CSS framework for styling. I found out about this framework because I met the inventor of it through an online community called Hack Club and was inspired by his work. I did not make any modifications to the framework because I found the styling choices quite pleasant and the DX very minimal and intuitive.

I used a few Express middleware packages:
1. `cookie-parser`: Parses cookies from the request and stores them in the `req.cookies` object.
2. `express-session`: Provides session management for the app. This was required for Passport.js to work.
3. `passport`: Provides authentication for the app. This was required for Passport.js to work.
4. `passport-github2`: Provides authentication for the app using Github OAuth.
5. A custom middlware function that redirects from the homepage to the login page before the homepage gets served if the user is not authenticated.

## Technical Achievements
- **Implement OAuth Authentication**: I used OAuth authentication via the GitHub strategy in Passport.js
- **Host your site on a non-Glitch hosting service**: I used Railway to host my site. It's better than Glitch because it updates on every push to your Github repository. It also just runs and spins up subdomains immediately, similar to Glitch. Railway deployment was slightly slower than Glitch, however. I much prefer Railway because of its UI/UX, ease, and convenience.
- **Get 100% on all four Lighthouse tests**: You can see the screenshot of the results below (I use Arc browser):
![Lighthouse test scores: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO](image.png)