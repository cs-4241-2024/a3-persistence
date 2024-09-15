# Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

### Student Gradebook System

- Link to Project: <https://a3-alden-cutler.onrender.com>

#### Description

- **Goal of the Application**: The goal of this application is to provide a comprehensive student gradebook system that allows users to add, update, and delete student records, as well as view real-time statistics about the students.
- **Challenges Faced**:
  1. **Database Integration**: Integrating the MongoDB database with the Express server was challenging, especially ensuring that the database operations were performed asynchronously and handling potential errors gracefully.
  2. **Deployment**: Deploying the application to Render (talked about later) and ensuring that it worked correctly in a production environment was challenging. For a while, I kept getting somewhat cryptic error messages, saying that the server could not connect to MongoDB. Multiple online resources mentioned URI-encoding each part of the connection string, but that didn't work. I'm not quite sure what the issue was, but I seemed to fix it by moving the last section of the connection string to the .env file, along with the username and password.
- **Authentication Strategy**: I implemented my own very simple authentication system. The user inputs a username and password, then clicks the "Login" button to authenticate. The server then goes and fetches the `users` collection from the database and checks if the username and password match any of the documents in the collection. If a match is found, the user is authenticated and the main page is updated to show the student gradebook system. If no match is found, the user is shown an error message and prompted to try again.
  - If a user doesn't have an account, they can enter a username and password, then press the "Create Account" button. This creates a new document in the `users` collection with the username and password. The user is then prompted to login with their new username and password.
- **CSS Framework**: I used `Simple.css` as the CSS framework for this project because it is lightweight and easy to use. I also added a couple of custom styles to group elements better and improve the overall layout of the page.

## Technical Achievements

- **Achieved 100% in all four Google Lighthouse metrics**: I achieved a perfect score in all four Google Lighthouse metrics: Performance, Accessibility, Best Practices, and SEO:
![Lighthouse Report](lighthouse.png?raw=true "Lighthouse Score")
![Lighthouse Report (while logged in)](lighthouse-loggedin.png?raw=true "Lighthouse Score")

- **Express Middleware Packages**:
  1. **`morgan`**: Used for logging HTTP requests to the console for easier debugging.
  2. **`serve-static`**: Used to serve static files such as HTML, CSS, and JavaScript from the `public` directory.
  3. **`dotenv`**: Used to load environment variables from a `.env` file into `process.env`.
  4. **`errorhandler`**: Used to handle errors in a development environment by displaying a stack trace and error message in the browser.

- **Deployed to Render**: Render is a cloud platform, similar to Glitch, that allows you to deploy web applications. It differs from Glitch in a couple ways. First of all, whenever you push a new update to your Git repository, Render can automatically redeploy the changes. You also have the option of deploying from a Docker image or public Git repository. Render also lets you specify a build command, start command, and root directory in which to run commands. This is useful for projects that require a build step, like React projects. Render also provides a free SSL certificate for your domain, which is a nice touch. It supports rollbacks as well. On paid instances, it also supports SSH access and persistent disks.
  - However, Render doesn't allow you to edit your code directly like Glitch does. If you notice an error in your code, you have to push a new commit to your Git repository and redeploy.
  - Because of these features, I decided to deploy my project to Render. You can view the deployed project [here](https://a3-alden-cutler.onrender.com), or by clicking the link at the top of this README.

## Design/Evaluation Achievements

- **W3C Accessibility Initiative**:
  1. Writing:
     1. **Provide informative, unique page titles**: While the user is not logged in, the page title is "Login - CS4241 Assignment 3". Once the user logs in, the page title changes to "`user`'s Gradebook".
     2. **Use headings to convey meaning and structure**: Headings are used throughout the HTML to structure the content. For example, the "Class Statistics" section uses a `<caption>` element to provide a clear heading for the statistics table.
     3. **Provide clear instructions**: Instructions are provided in the form of alerts and form validation messages. For instance, in the `handleAdd` function, users are alerted if they fail to fill out all fields or enter an invalid grade. Another example is the `Info/Help` button, which provides a brief description of the application and how to use it.
     4. **Keep content clear and concise**: The content is kept concise and to the point. For example, the labels and buttons in the forms are straightforward, such as "Delete" for the delete button and "Logout" for the logout button. There is no unnecessary text or clutter.
  
  2. Designing:
     1. **Provide sufficient contrast between foreground and background**: The CSS ensures sufficient contrast between text and background colors. For example, the modal background is a semi-transparent black, while the modal content has a light grey background with dark text, improving readability.
     2. **Ensure that interactive elements are easy to identify**: Interactive elements like buttons are styled to be easily identifiable. The delete button, for instance, has a class `delete-button` that can be styled to stand out.
     3. **Ensure that form elements include clearly associated labels**: Form elements are associated with labels to ensure clarity. For example, input fields for student details are clearly labeled in the form.
     4. **Provide easily identifiable feedback**: Feedback is provided through alerts and updates to the DOM. For example, when a student is successfully added or deleted, the table updates immediately to reflect the changes. When an error occurs, an alert is displayed to inform the user what went wrong.
     5. **Use headings and spacing to group related content**: Headings and spacing are used to group related content. For example, the statistics section is clearly separated from the student table, and each section has appropriate headings.
  
  3. Developing:
     1. **Identify page language and language changes**: The page language is identified in the `<html lang="en">` tag, ensuring that screen readers and other assistive technologies can correctly interpret the content.
     2. **Use mark-up to convey meaning and structure**: Semantic HTML elements are used to convey meaning and structure. For example, tables are used for tabular data, and headings are used to structure the content.
     3. **Help users avoid and correct mistakes**: Form validation helps users avoid and correct mistakes. For example, the `handleAdd` function checks for empty fields and invalid grades before submitting the form. When a response is received from the server, the user is informed of the outcome, whether successful or unsuccessful. If unsuccessful, an alert is displayed with the error message so the user knows what to fix.
     4. **Ensure that all interactive elements are keyboard accessible**: Interactive elements like buttons and form fields are accessible via keyboard. For example, the `Delete` button can be activated by navigating to the button using the Tab key, then using the Enter key, ensuring that users who rely on keyboard navigation can interact with the page. The modal that pops up when users click on the `Info/Help` button can also be navigated using the keyboard, and dismissed either by pressing the Escape key or pressing tab to focus on the close button and then pressing Enter.
