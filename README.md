# Task Tracker Application

**Hosted at**: [Task Tracker](https://a3-yourname.glitch.me)

## Overview

The **Assignment Tracker** allows users to create and delete tasks. Each task can be given a priority of high or low and is stored in a MongoDB database. You can log in with either GitHub or create an account using a username and password to manage tasks.

This project was developed as part of Assignment 3 which focuses on persistence.

## Goals of the Application

- **User Authentication**: Users can log in using either GitHub OAuth or a sign up for an account.
- **Task Management**: Users can create and delete their tasks, which are stored in a MongoDB database for persistence between sessions.
- **Minimalistic UI**: The CSS design focuses on simplicity and user friendliness.
- **Security**: Data is securely handled as sessions are being maintained using Passport.js.

## Features

1. **User Authentication**:

   - Users can log in via **GitHub OAuth** or **locally**.
   - New users can sign up, and returning users can log in and manage their tasks.

2. **Task Management**:

   - **Add Tasks**: Users can create tasks and give them a priority level (High/Low).
   - **View Tasks**: Tasks are displayed in a table format, showing the task description, priority, date it was created, and a delete button for when they are finished.
   - **Delete Tasks**: Users can remove tasks by clicking the delete button.

3. **Persistent Data Storage**:

   - The tasks are all saved in **MongoDB**, so data is stored between sessions and be accessed by any device that connects to the website.

4. **Responsive Design**:
   - The user interface is responsive and simplistic to help users easily navigate and use the site its purpose but still designed with intent.

## Challenges Faced

- **Authentication Integration**: I also implemented GitHub OAuth alongside locally having an account. This required use of Passport.js, which took some time to properly get to implement.
- **MongoDB Integration**: Ensuring persistent data storage with MongoDB, especially when trying to organize tasks and attach them to the user who created it was a bit of a hurdle.
- **Responsive Design**: I had to mess with CSS a bit to provide a mobile friendly and uniform design across login, signup, and the actual assignment tracker,

## Authentication Strategy

The application uses **Passport.js** for authentication. I used it in this project in two different ways:

1. **Local Strategy**: Allows users to create an account and log in using a username and password. For security reasons, the passwords are hashed using **bcryptjs**.
2. **GitHub OAuth**: Users can also log in via GitHub, where their GitHub ID is connected to their specific assignment tracker and tasks in the table.

As many modern sites where log in is necessary provide a local sign up option as well as others like using a google email option, I decided to use both to replicate that experience.

## CSS Framework Used

The project uses **custom CSS** to structure the login page, task tracker page, and other visual components.

## Technical Achievements

1. **OAuth Authentication**: Implemented GitHub OAuth by using **Passport.js**, which gave users the option to log in with their GitHub account. This required redirect URIs and an understanding of how to handle user data.
2. **MongoDB Integration**: Used **MongoDB** to persist data between log ins. All tasks are stored in MongoDB and connected with the logged in user. Tasks can be seen in the display and deleted, and the data is accessible after logging out and then back in.
3. **User Session Management**: Managed user sessions via **express-session** to ensure persistent login states across different pages.

## Design and UX Achievements

1. **Custom CSS Styling**: I manually styled the CSS, to focus on a engaging but simple site that is focused on its main purpose but also visually neat and professional.
   - **Contrast**: Emphasized the buttons (Login, Sign Up, Add Task) by giving them a color that constrasts against the darker background.
   - **Repetition**: Repeated design elements such as button shapes, input fields, and spacing.
   - **Alignment**: Carefully aligned all elements in a box like formatting to create a clean and organized layout.
   - **Proximity**: Grouped related items like inputs boxes and task table columns to help the user easily grasp how to navigate the site and use it for its given purpose.

## Lighthouse Performance

The application was tested using **Google Lighthouse**.

## Lighthouse Scores:

- Performance: 100
- Best Practices: 100
- Accessibility: 84
- SEO: 90

## How to Run

1. Clone this repository or fork it.
2. Install dependencies using `npm install`.
3. Set up a **MongoDB Atlas** account and add your database URI to the `.env` file.
4. Create GitHub OAuth credentials and add them to the `.env` file.
5. Run the app with `npm start`.
6. The app should be available at `http://localhost:3000` or your Glitch deployment.
