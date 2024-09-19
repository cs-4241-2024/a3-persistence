Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 19th, by 11:59 AM.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), 
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

Baseline Requirements
---

Your application is required to implement the following functionalities:

- a `Server`, created using Express (no alternatives will be accepted for this assignment)
- a `Results` functionality which shows all data associated with a logged in user (except passwords)
- a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account. 
- Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas) (you *must* use mongodb for this assignment). You can use either the [official mongodb node.js library](https://www.npmjs.com/package/mongodb) or use the [Mongoose library](https://www.npmjs.com/package/mongoose), which enables you to define formal schemas for your database. Please be aware that the course staff cannot provide in-depth support for use of Mongoose.  
- Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks). 
This should do the bulk of your styling/CSS for you and be appropriate to your application. 
For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.

Your application is required to demonstrate the use of the following concepts:  

HTML:  
- HTML input tags and form fields of various flavors (`<textarea>`, `<input>`, checkboxes, radio buttons etc.)
- HTML that can display all data *for a particular authenticated user*. Note that this is different from the last assignnment, which required the display of all data in memory on the server.

Note that it might make sense to have two pages for this assignment, one that handles login / authentication, and one that contains the rest of your application.
For example, when visiting the home page for the assignment, users could be presented with a login form. After submitting the login form, if the login is 
successful, they are taken to the main application. If they fail, they are sent back to the login to try again. For this assignment, it is acceptable to simply create 
new user accounts upon login if none exist, however, you must alert your users to this fact.  

CSS:  
- CSS styling should primarily be provided by your chosen template/framework. 
Oftentimes a great deal of care has been put into designing CSS templates; 
don't override their stylesheets unless you are extremely confident in your graphic design capabilities. 
The idea is to use CSS templates that give you a professional looking design aesthetic without requiring you to be a graphic designer yourself.

JavaScript:  
- At minimum, a small amount of front-end JavaScript to get / fetch data from the server. 
See the [previous assignment](https://github.com/cs-4241-23/shortstack) for reference.

Node.js:  
- A server using Express and a persistent database (mongodb).

General:  
- Your site should achieve at least 90% on the `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests 
using Google [Lighthouse](https://developers.google.com/web/tools/lighthouse) (don't worry about the PWA test, and don't worry about scores for mobile devices).
Test early and often so that fixing problems doesn't lead to suffering at the end of the assignment. 

Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements. I'd begin by converting your A2 assignment. First, change the server to use express. Then, modify the server to use mongodb instead of storing data locally. Last but not least, implement user accounts and login. User accounts and login is often the hardest part of this assignment, so budget your time accordingly.
2. If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
3. Test your project to make sure that when someone goes to your main page on Glitch (or an alternative server), it displays correctly.
4. Ensure that your project has the proper naming scheme `a3-yourfirstname-yourlastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-firstname-lastname`.

Acheivements
---

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the 
assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%. 
These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README, 
why it was challenging, and how many points you think the achievement should be worth. 
ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

*Technical*
- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/). 
*You must either use Github authenticaion or provide a username/password to access a dummy account*. 
Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. 
Please contact the course staff if you have any questions about this. THIS IS THE HARDEST ACHEIVEMENT OFFERED IN WEBWARE. You have been warned!  
- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse? 
- (5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment.
- (up to 5 points) List up to five Express middleware packages you used and a short (one sentence) summary of what each one does. THESE MUST BE SEPARATE PACKAGES THAT YOU INSTALL VIA NPM, NOT THE ONES INCLUDED WITH EXPRESS. So express.json and express.static don't count here. For a starting point on middleware, see [this list](https://expressjs.com/en/resources/middleware.html).

*Design/UX*
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*. 
For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively 
getting it "for free" without having to actively change anything about your site. 
Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard. 
List each tip that you followed and describe what you did to follow it in your site.
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. 
Which element received the most emphasis (contrast) on each page? 
How did you use proximity to organize the visual information on your page? 
What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? 
How did you use alignment to organize information and/or increase contrast for particular elements. 
Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total). 

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Quick-Bites Food Service!

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored

  
## Description

The goal of this application is to send food orders in the Quick Bite Food Service, detailing your name, food order, and the food quantity. The following inputs will net a cumulative total price for all orders. All the orders are unique, based on the user logged in.
The main challenge that I faced while creating this application is definitely manipulating the MongoDB database and its data, via using the fetch functions that can add, edit, and delete food orders. It was a tough learning curve! 
I used both the traditional login and also OAuth (passport for GitHub). This allows more variety in ways of logging into the application but also I really wanted to learn how to use OAuth. The cookie-parser definitely helped with my authentication on both methods.
I used the Tailwind framework because I am much more familiar with the framework in comparison to the others. I have used it before in my Software Engineering class, but also my Internship.

Here are the middlewares I have used for this application:
1. **body-parser**: The middleware parses the incoming JSON request bodies, making it accessible via req.body.
2. **cors**: This middleware enables Cross-Origin Resource Sharing (CORS), allowing requests from other domains.
3. **express.static**: Serves static files from the public directory.
4. **Helmet**: Provides more security by setting various HTTP headers.
5. **morgan**: Logs HTTP requests in the terminal, using the 'tiny' format.
6. **cookie-parser**: Parses the cookies attached on the client side, allowing easy access to cookie values.
7. **express-session**: Helps manage user sessions, storing the session data on the server using cookies.
8. **passport.initialize()**: Initializes Passport for user authentication
9. **passport.session()**: Implements Passport with session management which allows the users to be authenticated across multiple requests
10. **passportAuthenticated**: A custom middleware. Checks if the user is authenticated via Passport or a session cookie. If authenticated, grant the user access to the protected routes. If not, then keeps the user from entering the main page without access.  

## Lighthouse Tests
- **Login Page**: ![login.png](login.png)
- **Main Page**: ![main.png](main.png)

## Technical Achievements
- **OAuth for GitHub**: Implemented OAuth for GitHub users. Set authentication for both cookies and passport (traditional Logjn and OAuth Login)
- **Unique Data for each particular user**: Each user logged in has unique data that is created by the authenticated user. 
- **Added log out button**: Added a logout button that clears the cookies cached by the user and restricts the user from reentering without logging in again.
- **Hosted on a different site**: I used Vercel as another hosting site for the application other than glitch. I was able to quickly deploy my project and use my GitHub to display all my repositories needed for A3. However, the main issue is not being able to use my MongoDB database for some reason.
- **HTML Forms**: I have used the correct HTML form inputs to gather data from the user, which includes their login credentials and their food orders. The data inputted is then captured using res and req with body to send the data into the server.
- **MongoDB and Express Middleware**: I have incorporated the MongoDB and Express Middleware to house the data provided by the user, which includes their login credentials and their food orders.
- **Add/Edit/Delete**: I have given the ability to add,edit and delete their data from the database which is also reflected in the MongoDB database. I have added these functions in the Server.js file.
- **Different Middlewares used**: I have incorporated other Middlewares to enhance runtime and help with security. These middlewares are: Cors, Body-parser, Helmet, Morgan, Cookie-parser, Express-static and more. Check the Middleware section in my Server.js file.
- **Persistent Data**: My data displayed on the application is reflective on the MongoDB database. The data can be modified and is still reflective on the database, whether you add, edit, or delete the data.
- **Server requests using Fetch**: I made all of my functions in Main.js using fetch to use server requests, which includes the function to fetch all initial orders from a particular user, functions working with the data for each other, adding food orders, and also for logging/registering a user into the application.
- **Lighthouse Test**: I have achieved 100% for all the lighthouse tests on this assignment. Look at the pictures above.

## Design/Evaluation Achievements
- **W3C Accessibility**: I followed the following tips from the W3C Web Accessibility Initiative:
  - Provide Clear and Simple Language (Writing): Added more descriptive placeholder texts (instructions) for the login page such as "Enter your username (e.g email or username)" for better understanding and reduces cognitive load.
  - Use Labels and Instructions for Form Inputs (Designing): I made sure that all input fields are using label elements and the aria-label attribute to provide additional information for screen readers. The labels help users with accessibility, especially for those relying on screen readers
  - Provide Visible Focus States for Interactive Elements (Designing): I added focus styles for all interactive elements such as the form files, buttons, and any links provided using Tailwind. I used the focus class as seen in those elements for both login.html/index.html. This makes it easier for users to navigate the form by highlighting focused elements.
  - Use Meaningful and Descriptive Page Titles (Writing): I have my title tags in both HTML files provide context as to what that page is meant to do. The title tag for Login is "Login to Quick-Bites Food Service" and for the Main page, it is "Quick-Bites Food Ordering System". The descriptive titles help users (especially those using assistive technologies) know the function of the page they are on.
  - Use Semantic HTML and ARIA Roles (Developing): I wrapped the main form content inside <main> element and added the aria-labelledby to all forms and interactive content. This helps improve screen reader navigation and provides a more structured form to the contents on the page.
  - Provide Helper Text with Form Inputs (Designing): I added helper texts below input fields like username and password to explain input expectations as "Please enter the password for your username here". This helps users avoid input errors and gives them more clarity as to what they should input in those fields.
  - Use Descriptive Link Text (Writing): Added a Link text to the Login.html for forgetting passwords (Note: there is no functionality) and made it descriptive. It reads "Forgot your password? Recover it here!". This helps users, especially screen readers, to know where the link is taking them.
  - Ensure Sufficient Color Contrast (Designing): Made the text color and background color closely meet the WCAG's contrast ratio guidelines. The contrast on both pages passed the Lighthouse Test. Ensuring sufficient contrast between the text and background improves the readability for users with visual impairments.
  - Enable Keyboard Navigation (Developing): I made sure that all form elements are focusable via the keyboard and added a clear focus state for the inputs. This is available in both Index.html and Login.html, just by pressing the Tab key. This is essential for users with motor disabilities that might rely on the keyboard instead of a mouse.
  - Group Related Elements Together (Designing): I grouped all related form elements (labels, inputs, and helper texts) using the <div> component and added aria-describedby attributes to link the inputs with their helper texts. This allows better context for screen readers and users relying on assistive technologies.
  - Responsive and Mobile-Friendly Design (Developing): I adjusted the viewport settings to make sure that the forms are responsive and optimized for mobile devices using <meta name="viewport"> tag in both html files. This allows the website to be more accessible and usable on a variety of devices, including smartphones and tablets.
  - Avoid Using Only Color to Convey Information (Designing): I made sure that the critical information (form errors and required fields) is not only conveyed by color alone. I added both bold text and helper text to indicate required fields. If we only use color, it might be problematic for users with color blindness or low vision. Adding textual information provides a healthy alternative.
- **CSS Framework**: I have implemented Tailwind as my main CSS Framework, which is used in both login.html and index.html. Look at the top of the html files for the stylesheet.
- **CRAP Principles**: I added a PDF detailing the CRAP principles and its usage for both Login.html and Index.html.

### Websites
- **Glitch**: https://standing-tarry-lunge.glitch.me
- **Vercel**: a3-nexus-18.vercel.app (put this in your browser, the deployment doesn't work with the login)