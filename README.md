

## To-do app

https://a3-jeffcli-fcc7491c5e77.herokuapp.com/#

- This is an application that allows users to create a to-do list. This is done by entering the task name, task description and priority (low, medium, high) into the provided form. Based on the priority of the inputed task, the app will calculate a deadline for that task to be completed. This app also shows the current list of tasks in a table, and users are also able to delete tasks from the table as well as edit the task name, description and priority of the task. To delete a task, simply click the delete button on the task you want to delete and to edit, click on the attribute you want to edit and it should allow you to modify it. 
- The biggest challenge I faced was authentication as I had never implemented authentication into any of my applications before and getting it to work with the database was pretty challenging at first.
- I used LocalStrategy which is when the user tries to log in, their provided credentials get checked against a database. In this case the login gets checked with the database of users and if the credentials match those of a user already stored in the database, the login is successful and the user gets redirected to the main page. I did this because it seemed like the easiest to implement which made sense for my first time integrating authentication with an application. 
- I used tailwind.css due to my previous familiarity as well its ease of use. 
- The middleware packages I used were Express-session, passport, LocalStrategy and bodyParser. Express-session manages user sessions. Passport is a middleware for authentication that helps with user login. LocalStrategy is an authentication strategy provided by Passport that verifies user credentials against a database. BodyParser parses incoming request bodies such as JSON and makes data accessible through req.body. 

## Technical Achievements
- **100% on Lighthouse**: <img width="1509" alt="Screenshot 2024-09-19 at 4 05 14 AM" src="https://github.com/user-attachments/assets/edeb0dca-f364-4fa6-98aa-307cf241a5ea">

- **Deployed on Heroku**: Instead of Glitch, I used Heroku to deploy my application for this assignment. I found this much better to use as I didn't have to constantly redeploy whenever I made a change as it does that automatically. I also tried using Vercel briefly, but that didn't end up working out too well with my application due to my usage of LocalStrategy for authentication.

### Design/Evaluation Achievements
- **Description of CRAP principles**: 

Contrast:
I uses contrast throughout the application to make important elements stand out. Headings are in white against a dark indigo background, which makes them easy to see. Buttons like "Login" and "Register" have darker colors with hover effects that highlight them when users move their mouse over them. The lighter gray input fields stand out against the dark background, improving visibility. This strong contrast helps users quickly find important information and actions, making the application easier to navigate. By focusing on these contrasting elements, users can clearly see what they need to do and what information is important throughout the app.

Repetition:
I used repetition throughout the application to create a consistent look. The color scheme includes shades of gray, blue, and white, which helps the design feel cohesive. The same font is used across all pages, making it easy to read. Buttons and form fields share similar styles, like rounded corners and borders, which helps users feel familiar with the design. For example, both the login and registration forms look alike, making it simple for users to switch between them. This use of repetition not only makes the app visually appealing but also improves usability, as users can easily recognize consistent elements.

Proximity:
I was able to utilize proximity throughout my application. Related elements, like input fields and labels, are grouped together, making it easy for users to understand their purpose. In both the login and registration forms, the input fields are placed closely below their headings, helping users know what to fill in. The task creation form is separated from the task list by spacing and borders, allowing users to easily see the difference. By keeping related items close together, the app reduces confusion and helps users find what they need quickly. This clear arrangement makes the application user-friendly and easy to navigate.

Alignment: 
I was able to use alignment to create a more organized look in my application. The layout uses a structured grid format, with forms, buttons, and tables aligned neatly. Headings are centered, which gives a balanced look. Input fields and buttons are aligned in a column, making it easy for users to fill them out. The task table has headers and rows that are aligned to help users read and compare information easily. By using alignment thoughtfully, the app looks polished and guides users’ attention to the most important elements. This alignment improves the overall user experience, making the app simple to use.



