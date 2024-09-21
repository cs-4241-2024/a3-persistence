## To Do List Application

http://a3-ian-poulsen.glitch.me

This application is a simple to do list created using Express and MongoDB.
Users can create accounts and log in to access their very own to do list.
It was challenging to implement authentication, but I went with the easiest option using cookies and plaintext credentials (yikes!).
It was also quite challenging to optimise the Lighthouse tests. I used the MVP CSS framework because I thought it looked nice.
I had to overwrite the color used for the buttons because there was not enough contrast to pass the accessibility requirements.
I only used two middleware packages: cookie-session and compression

- Cookie-session is used to store the user session identifier.
- Compression is used to compress text to improve performance.

## Technical Achievements

- **Technical Achievement 1**: Achieved 100% on all four lighthouse tests (see lighthouse.jpg)

### Design/Evaluation Achievements

- **Design Achievement 1**: I followed the following ten tips from the W3C Web Accessibility Initiative:
  - **Associate a label with every form control:** I put labels on all of my forms: login, signup, add, edit, delete, and the "Done" checkbox in the table.
  - **Identify page language:** \<html lang="en"\>
  - **Write code that adapts to the user’s technology:** I adapted the code to user technology using the line "name="viewport"content="width=device-width, initial-scale=1"
  - **Provide sufficient contrast between foreground and background:** I overwrite the CSS to ensure that the buttons had an appropriate contrast ratio
  - **Provide clear instructions:** When a user successfully signs up, the app then tells them "Registration successful, you can now log in." The labels for the log in, sign up, and table explain to the user what to do
  - **Provide easily identifiable feedback:** Since the login and signup fields are required, the app tells the user "Please fill in this field"
  - **Provide informative, unique page titles:** Page titles are "To Do List" and "Login – To Do List"
  - **Make link text meaningful:** The link to my github has the text "Check out the GitHub repo for this app!"
  - **Include alternative text for images &&**
  - **Write meaningful text alternatives for images:** The smiley face image has the alternative text of "Smiling emoji giving a thumbs up"
