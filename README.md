Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 19th, by 11:59 AM.
Rose Strobel

---
*Technical*

I received a 100 in all 4 categories on lighthouse for the login.
I also implemented github's OAuth in my login screen

*Design/UX*

1) I provided unique and informative page titles. My page titles describe what webpage you are on, whether you are on the login and sign up page or the to-do list page.
2) I used headings to convey meaning and structure. The headings on the to-do page clearly notes what the website is meant for. Along with the heading, I also described it in a paragraph below it.
3) I kept content clear and concise. The content on the page contains either login or signup, or information for the to-do tasks. The content on the to-do page includes a text box where the user can input their task, a submit button to submit their task, and a list of all the tasks below it.
4) I provided sufficient contrast between the foreground and background. The foreground and background are two different colors.
5) I associated a label with every form control. All of the forms in my website have a label that clearly describes what that textbox does. On the log in page, there is a label for both login and signup. On the to-do page, there is a label for tasks using a placeholder.
6) I reflected the reading order in the code order. My code goes from top to bottom how you would see the website. For example, I have the header first, then the paragraph, then the text inputs and submit button, then the lists.
7) I ensured that interactive elements are easy to identify. I made sure that the user's cursor turns into a pointer when hovering over interactive elements. I also made these elements less bold than the other text on the page and made their opacity slightly less when hovering over them.
8) I provided clear and consistent navigation options. The navigation accross the webpage includes clear and consistent navigation by using clear headings and displaying informative content on the page.
9) I used markups, or divs, to create a sense of meaning and structure. The divs divide each section by their content.
10) I used headings and spacing to group related content. I used whitespace to make different content more apparent. There is sufficient white space between the heading and paragraphs, as well as the list of tasks. I also used a hr line to make it more apparent.
11) I identified the main language used on the webpage. In the meta tag, <html lang="en">, I said that the language of the website is english.
12) I did not use color to convey information. I did not use color, but rather prompts to display information. If the user did not input a value in to the task textbox, a prompt would show notifying them to input a value before submitting. If the user wanted to delete a task, I would prompt them making sure that they want to delete their task.

## CRAP:

Contrast: In my website, I applied contrast by using different colors to make each element stand out. For example, I made the headings bold and applied a larger font-size to them. I made the body text, including the paragraph tag, placeholders, and buttons, much smaller in comparison to the header. This made the content look more visually appealing due to how it guides the user's eye down the page and displays the information in a reading order. I also applied a border-radius to my buttons to make them more round. I did the same for the text boxes and the containers to give the entire website a much softer feel. I also wanted it to contrast against the sharp font applied to the text. Overall, this made the shapes and the font stand out, ensuring that the user has a good experience.

Repetition: Regarding repetition, I created a color scheme throughout the entire website. I used this color scheme on both the log in page and the to-do page. This made the website look more put together and made navigating to different webpages feel on theme. Had I used different colors, navigating to a different webpage would feel like visiting a whole new webiste. I also applied a border-radius to all of the text boxes and buttons on both webpages. This made all of the interactible elements seem on theme. One element did not stand out over another. Regarding the fonts, I used the same font for all of the text elements and made sure that they all used the same color. Using repetition, I made the webpages seem more consistent and "on brand."

Alignment: My website had a structured sense of alignment. I focused on centering all of the text and objects in the center. This includes the container element, the buttons, and the text boxes. The centering of these elements made the pages look alot more symmetrical and professional. I also made sure that objects were spaced correctly, where one element is not too close or too far from another element. This helps guide the user's eye down the website. With everything centered, it makes reading the text easier. This prevents the user from being confused with the alignment. They can easily find all interactible buttons and text boxes due to knowing what to expect and knowing where objects may be. Overall, centering the content is what made my website easier to navigate and readable.

Proximity:  Regarding proximity, I grouped all related elements together code wise. I grouped them in a container div to make it easier separating and styling different elements. I placed large headings at the top of the page to show the user what the webpage is. Below the heading, I placed a smaller body section with a description of the website. I then created a todo-container that had the user inputs, such as the text box and the button to submit their task. These are below the description but in their own div. Below the inputs, I create a horizontal line to separate the tasks from the content above and made an unlisted list to place the tasks. I used white space and horizontal lines to organize the overall page layout, making it easier for the user to navigate through the website.

---

## Your Web Application Title

your glitch (or alternative server) link e.g. https://a3-rose-strobel.glitch.me

My project is a to-do list. The user will sign in or sign up. If the user signs up, their username and password will be sent to
my MongoDB database. They will now be able to sign in with their given username and password. Cookies allows my website to store their username and password for 24 hours, which makes logging in easier. If the user enters the wrong password or they don't have an account, it will send a log to the console. Once the user logs in and loads into the to-do list webpage, they are able to create tasks. These tasks are edittable and deletable. Users can also check off their task if it is completed. Adding and deleting tasks are also sent to my MongoDB database in the "tasks" section. It stores the user's username and the task they added, so that when that user logs in, their tasks will be stored. Some challenges were making the server work, as well as displaying the task data. It was difficult debugging my code figuring out why I would be getting error codes.

The CSS framework I used was bootstrap. I mainly relied on bootstrap for its text-font and its container. I have also used bootstrap before, which is why I felt more comfortable using it for this project. Regarding custom CSS, I just changed the background colors of the containers and text so that it matched my own theme. I also centered everything and added some padding to the borders so that they were more rounded.

## Achievements
My achievements are worth however you see fit

## Technical Achievements
- **Tech Achievement 1**: The middleware I used were express.json(), express.urlencoded, passport.initialize, passport.session, express.static, and passport.authenticate

**Tech Achievement 2**: I received a 100 in all 4 categories on lighthouse

**Tech Achievement 3**: I used MongoDB to save user data

**Tech Achievement 4**: I used github's authentication service as an alternative for user's to log in

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative

**Design Achievement 2**: I added some of my own design elements to bring the whole page together, such as centering text and content, and creating a color scheme.
