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

## Your Web Application Title

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
add a little more detail about what it does.


I used the Bulma CSS framework as it offers good flexbox utility and provided a clean look to the site. I made no changes to the Bulma framework itself.

## Technical Achievements
- **Lighthouse Grading**: I achieved 100% in Lighthouse for both my login page and main data display page. (Images can be found in the repo)
- **Web hosting**: I used Railway to host my webpage for this assignment. One obvious benefit is that it allowed for free hosting without giving any credit card info,
                   which I found to be particularly noteworthy as I am not a fan of giving companies any financial information. other than that, it functions remarkably similarly to Glitch.
- **List of Express Middleware**: Cookie-parser: Used with req.cookies to help with unique logins
                                  Handlebars: Helped with backend integration with MongoDB


### Design/Evaluation Achievements
- **W3C Accessibility**: I followed the following tips from the W3C Web Accessibility Initiative below
DESIGN TIPS:
Significant contrast: My foreground text is white while the background is typically a dark green, which is sufficient enough contrast to easily read the words.

Don't convey info using only colors: Color is primarily used to direct users' attention to forms or instructions which clearly demonstrate
what is necessary in order to operate the site in the intended way. These instructions are clear and coherent leaving no uncertainty in the user.

Label all form elements: All forms have placeholder text within that show what is required to enter and also have titles that describe what they are.
E.g. "Employee ID" or "ID Registration Year"

Interactive elements are easy to identify: All interactables are in the form of buttons, which are commonly seen as interactive elements, meaning there is
no confusion over whether or not a user can interact with it in some way.

Use spacing to group content: I grouped the form and table together, as an example, to demonstrate their relationship.



DEVELOPMENT TIPS:
Label with all form controls: Each form has a label that shows what its purpose is. (Employee ID, Name, etc.)

Help users avoid/correct mistakes: Instructions given when filling out employee form allows users to avoid mistakenly entering incomplete data.

Reflect reading order in code order: Everything in both pages is organized in a proper top-down format. Things that appear first in the page appear
first in the code as well.



WRITING TIPS:
Unique, informative page titles: "Login" page title clearly demonstrates the purpose of the page.

Headings to provide structure: The two headings on each page convey their purpose, one to login and another as an employee database.

Provide clear instructions: For the form, I specified the necessary number of digits for the employee ID (9) and to enter a first and last name
for an employee.

Clear and consise content: All instructions are kept to a sentence or two in length, with no overly-complex words or acronyms.


- **CRAP Principles**: I followed the four principles of CRAP below
Contrast:
By using dark green and bright red as my primary colors for both webpages, I used their natural contrast to draw the viewer's attention to important
information on the page. I primarily used it as a border around the login and employee forms and the data table, which are the most important parts of
my page. I also used a red background for my header to naturally draw the viewer's attention to the title, which explains what exactly the website is used for.
Finally, I used mostly light text on the dark green background to allow for easy readability on the page. This is especially important as the text not only contains
the necessary instructions for what the user must do to successfully operate the page, but also shows the important data that is stored on this hypothetical employee
form webpage.

Repetition:
As discussed above, I used a border around all important forms on the page. I used these flex-boxes as a way to signal to the user that the information contained is
of great importance to the website. This is heightened by the inherent contrasting colors that were described in the above paragragh. I also made sure to align all text
the same way, which will be discussed in more detail later, to make reading the instructions and data far more efficient for any users who want to quickly parse out the
necessary bits of information. The same core colors, green and red, are also used in both pages not just because of their good contrast, but to show a sense of cohesion
throughout the site. The goal was to demonstrate that both pages were connected before the user started reading any of the text on the screen, thereby allowing the user
to understand the purpose of each screen without necessarily needing to read all of the information presented.

Alignment:
For this page, I aligned all text left-wards, including the header title, to make reading any and all information more efficient. As English speakers read from left to
right, having all web text left-aligned enables a more natural flow of information when viewing my webpage. I also made sure to align the text to be as close to vertically straight as possible. Put more clearly, I created a strong line on the left side of the screen by making sure the text and flex-boxes aligned vertically. This is to create a sense of cohesion and neatness when viewing the page and allows for quick parsing of the information stored on both pages. This is to avoid any
potential confusion when it comes to accessing and creating data.

Proximity:
For my main page, I positioned the form and table away from the header, and had them near each other to signal to any user that the two were related. This
also served to make seeing the data easier, as because of its close proximity to the form, people with smaller screen sizes don't need to scroll down far after submitting data, and those with large screen heights won't need to scroll at all. This helps avoid any unnecessary confusion as users are able to see the top of the table at all times. Similarly to the form and table, I positioned the instruction text near the form so users could see it while glancing at the form. The goal was to create a link between the two in the user's head, and avoid any unneeded errors when filling out the form.
