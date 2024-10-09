Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
## Grocery List Application

https://a3-krutgoat.glitch.me/ 

- This app is a grocery/item list that was created using an Express server, MongoDB, and a CSS template.

- Users can register a new account or log in with an existing account. 

- Authentication and keeping the data the same between users was implemented using cookies and plaintext credentials (because using plaintext was simple and I did not have tiem to implement hashing.)

- I needed to get rid of the pink colors (such as in the buttons, borders, backgrounds) from my original A2 assignment so that there would be enough contrast for the accessibility requirements. 

- The CSS framework I used is picnic because it seamlessly integrated with my code.
  - I modified the h1 and h2 headings within my CSS file to match the framework colors (blue); originally those were pink and brown from my own design of my site.

- The middleware packages that I used were cookies, requiring authentication, and compression. 


## Technical Achievements
- **Tech Achievement 1**: I implemented authentication with usernames and passwords. Here is a "dummy account" that you can access with some grocery list items in it:

  username: kroot
  password: 123

- **Tech Achievement 2**: I got a 100% in all four of my lighthouse tests for this assignment.  

- **Tech Achievement 3**: I used some middleware for my app. Here is what I used:
  1. cookies in order to store userID for shopping list info and logins
  2. requiring authentication in order to be able to access main.js or any other page 
  3. compression for accessibilty, to compress the text for better performance


### Design/Evaluation Achievements
- **Design Achievement 1**: I used the CRAP principles in my site:

- The most contrast for each item on the page is between the text in the table and the background (black and white)
- I use the color blue (using the CSS template I chose) repeatedly throughout my site. 
- The elements in the site are center-asigned and large, so that they are easily readable. 
- The table groups grocery list items together in a list in order of insertion. I used proximity to keep the "edit" and "delete" buttons next to each other, in the "settings" category/column. Also, adding new items has the input fields all in the same place, above the table. 

- **Design Achievement 2**: I made my site accessible. Here is what I implemented:
  1. Identify page language: I used \<html lang="en"\> in my form.
  2. Write code that adapts to the user’s technology: I used the line "name="viewport"content="width=device-width, initial-scale=1" to adapt to the user's technology.
  3. Provide sufficient contrast between foreground and background: I provided sharp contrast between my text, background, headers, and buttons. 
  4. Provide clear instructions: I have placeholders in all my HTML forms that explain to the user what to type. The application also responds to a user successfully (or unsuccessfully) signing up or registering with an alert/popup.
  5. Provide easily identifiable feedback: The login and signup fields are required, so my app alerts the user to fill in the field if they try to submit a blank form.
  6. Provide informative, unique page titles: My entry page is titled "Login or Sign up" with a sub-heading stating "Access the shopping list". Once signed in, the headings are "Shopping list" and "things to buy" with a list of items under it. 
