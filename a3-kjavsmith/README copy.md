# Simple Todo App with Authentication

[Live Application Link](http://your-glitch-link-here)

## Project Summary

The Simple Todo App is a web application that allows users to create, update, and delete tasks while associating them with their account. It features user authentication, persistent data storage with MongoDB, and uses Bootstrap for styling to provide a responsive and clean interface.

### Goals of the Application
- Provide a simple yet functional Todo list where users can add, edit, and delete tasks.
- Implement user authentication to allow users to have their own personalized task lists.
- Use MongoDB for persistent data storage, ensuring data is saved across sessions.
- Ensure a user-friendly and accessible interface using a CSS framework.

### Challenges Faced
- **Authentication**: Implementing user authentication was challenging, especially in terms of securely handling passwords and managing user sessions. Setting up session management and ensuring user data is protected was complex.
- **Data Persistence**: Integrating MongoDB for persistent storage required careful planning, especially to ensure that todos are linked to the authenticated user and securely managed.
- **Sorting and Displaying Data**: Ensuring that todos are sorted correctly by priority and deadline required careful logic to make sure the most urgent tasks are highlighted.

### Authentication Strategy
I chose to implement simple username/password authentication using `express-session` to manage user sessions and `bcrypt` for password hashing. This method was chosen for its simplicity and ease of implementation while providing a basic level of security.

### CSS Framework
I used Bootstrap for the styling of the application. Bootstrap was chosen because it offers a wide range of ready-to-use components that help to quickly build a responsive and clean user interface. I made minor customizations to the framework using custom CSS for specific styling needs like changing colors and adjusting layout details.

## Technical Achievements

- **Integration with MongoDB**: Set up MongoDB as the persistent data store, allowing users' todos to be saved across sessions and server restarts.
- **User Authentication**: Implemented user authentication using `express-session` and `bcrypt`. This allows for secure login, user-specific task lists, and password protection.
- **CRUD Operations**: Created RESTful routes for adding, updating, and deleting todos. Ensured these operations are linked to the authenticated user, providing a personalized experience.

## Design/Evaluation Achievements

- **Responsive Design**: Leveraged Bootstrap to create a responsive layout that works well on different screen sizes, ensuring accessibility and usability on mobile devices.
- **Accessibility**: Followed W3C Web Accessibility Initiative guidelines to ensure the form fields are properly labeled and the interface is navigable using a keyboard, enhancing the user experience for people with disabilities.
- **Sorting and Display**: Implemented a function to sort todos based on priority and deadline to improve usability, making it easier for users to manage and focus on the most urgent tasks.

## What Worked and What Didn't
I was able to implement the core functionalities of the application, including:
- User registration and login.
- CRUD operations for todos with MongoDB as the data store.
- Real-time updates to the todo list using the server's API and client-side JavaScript.

However, I faced challenges in fully integrating some of these components:
- **Authentication Edge Cases**: Handling various edge cases during login, such as ensuring users are informed about unsuccessful login attempts or duplicate usernames.
- **Error Handling**: While the main operations work, more robust error handling could be implemented to provide better user feedback when issues occur (e.g., database errors, network issues).
- **User Interface Enhancements**: While Bootstrap was used for styling, further customization could improve the application's aesthetic and user experience.

## How to Run Locally
1. Clone the repository.
2. Install the dependencies:
   ```bash
   npm install
   npm start
