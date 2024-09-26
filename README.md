## Task Manager

https://a3-kaylaa2003-kayla-afonseca.glitch.me/

This site allows a user to track tasks. To enter the site first click register and create an account. Once the account is created click login and login. Once logged in you will be able to add tasks. To delete task input your username then click delete.

- Allow users to add and remove tasks to their personal account.
- The biggest challenege I faced while creating this task manager was getting my login and registration page to work correctly. I started off with a site that tracks tasks, but realized I had no way of having usernames stored without a login and registration page. Creating the javascript for these pages took more time then I expected.
- I chose to implement OAuth authentication using the GitHub strategy. This method was selected for its simplicity and ease of implementation, allowing users to log in securely without the need for additional password management.
- I used Bootstrap as the CSS framework for this application. Bootstrap was chosen for its responsive design capabilities and pre-styled components, which helped speed up the development process.
- The five Express middleware packages
express: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js that provides a schema-based solution to model application data.
bson: A library that provides BSON (Binary JSON) serialization and deserialization for working with MongoDB.
mongodb: The official MongoDB driver for Node.js, allowing for direct interaction with MongoDB databases.
dotenv: A zero-dependency module that loads environment variables from a .env file into process.env, helping to manage configuration settings securely.

## Technical Achievements

- **Tech Achievement 1**: I chose to implement OAuth authentication using the GitHub strategy. This method was selected for its simplicity and ease of implementation, allowing users to log in securely without the need for additional password management.

### Design/Evaluation Achievements

- **Design Achievement 1**: 
1. Contrast 

My site used contrast to draw attention to the section of the page that used user input. The titles and other text are dark while the surrounding background is white.  More specifically, the most prominent elements on my pages are the header titles like "Task Manager" and "Login," which stand out due to their larger font size, color, and placement. I’ve also used color contrast effectively with the blue header titles and buttons against the lighter background color. This contrast helps users immediately recognize the purpose of each page and emphasizes the primary actions, such as logging in or adding a task. Additionally, the contrast between the button colors (btn-custom class with blue background and white text) and the rest of the elements makes interactive components visually distinct, guiding users toward the actions I want them to take. This design choice helps to maintain user focus and guides them through the task management process intuitively. 

2. Proximity 

My site used proximity to organize related visual information, helping users understand the structure and flow of content. In my code, form elements are grouped logically, such as the task input fields (taskName, dueDate, userName) being placed closely together within the task management form. This grouping makes it clear that these elements are related and belong to the same process. Similarly, the buttons and input fields in the login form are grouped, which visually communicates that they are part of the login process. The use of proximity helps users easily scan and understand which elements belong together without confusion. Separating different sections with divides and colors further enhances readability and helps the users navigate the site without feeling overwhelmed. 

3. Repetition 

My site has repetition in its design, which reinforces consistency and creates a cohesive experience throughout my site. I’ve effectively used consistent colors, fonts, and layout structures across all the pages, which helps in creating a unified look and feel. For example, the repeated use of the blue color scheme (#007bff) for headers and buttons, along with the consistent font styles, maintains visual harmony. The repeated layout of forms inside card elements (card class) with shadows gives a familiar, cohesive design across different functionalities, like the task manager and login page. Repetition of design elements ensures that users have a predictable experience, knowing what to expect as they interact with various parts of my site. This consistency is essential for usability and helps in building user confidence as they navigate. 

4. Alignment 

My site uses alignment to create order and increase readability. I’ve organized elements systematically on each page. In my code, the elements that are only meant to be read and not interacted with are aligned centrally (text-center class) within the cards to create a clean, organized appearance. This approach not only increases visual appeal but also enhances readability, making it easier for users to follow along with the content and instructions. Alignment is particularly evident in the structured layout of forms and lists, which are consistently aligned and spaced, allowing for a streamlined user experience. By aligning text and form elements neatly, I've increased the contrast for specific elements, like buttons, which allowed the buttons to stand out considering they were at the end of the forms, providing a clear visual cue for actions. This organized approach guides the user’s eye naturally through each section, ensuring that the design is both functional and balanced visually. 
- **Design Achievement 2**: I used CSS to make my site visually appealing and created sections that guide the user through my site.
![alt text](https://cdn.glitch.global/6e3f5eb5-6008-4d26-acce-b3066d02114a/f63dbd6e-ef4d-4d9a-a997-6eeaa3165edc.image.png?v=1727254957216)