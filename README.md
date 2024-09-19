## Online To-Do List

April Bollinger

https://a3-april-bollinger.glitch.me/

Description: Online To-Do List that allows users to login (with or without an account) and view/complete/add/update their tasks.

![Login Page](https://cdn.glitch.global/058bca51-2654-4a89-9d7e-24ac2bf4ebd2/login.jpg?v=17267542628998)

![To-Do List](https://cdn.glitch.global/058bca51-2654-4a89-9d7e-24ac2bf4ebd2/list.jpg?v=1726756676785)

- _Challenges:_ The main challenge I faced was converting to using the CSS Framework and changing the dynamically created html elements to make the tasks easier to edit.
- _Authentication:_ I choose to use database verification and cookies because it seemed to be the simplest implementation.
- _CSS Framework:_ I used Bootstrap. I chose Bootstrap because I am familiar with it and it provides a lot of options for forms.
  - _Edits:_ The only edits I made were to the text in the footer (made it smaller and moved it) and the required CSS for google fonts.

## Technical Achievements

- **Tech Achievement 1**: I got 100% on the lighthouse tests
  - ![lighthouse results](https://cdn.glitch.global/058bca51-2654-4a89-9d7e-24ac2bf4ebd2/lighthouse.jpg?v=1726725386072)
- **Tech Achievement 2**: Middleware Used

  - cookie-session - starts a session with cookies
  - express-handlebars - view engine (template) for express to make it simpler to use

- **Tech Achievement 3**: Installed all required packages through the package.json file instead of running npm i. This is challenging because you must look for up-to-date packages and understand where they should be placed in the the .json file. Worth 1 point.

## Design/Evaluation Achievements

- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...

  1. Changed page titles to be more descriptive
  2. Created more descriptive labels where needed
  3. Ensured strong contrast between backgrounds and text
  4. Ensured color is not used to convey information
  5. Made sure interactive elements are obvious
  6. Ensured that all input fields have a clear label
  7. Responsive layout
  8. Every form element has a label associated with it
  9. Declared the language for all html files
  10. Reading order is reflected in the code
  11. Provided aria labels for all form elements
  12. Added input instructions

- **Design Achievement 2**: CRAP Principles
  - _Contrast_ - The rule of contrast states that if elements are not going to be the same, make them as different as possible so they stand out from each other. I used the rule of contrast in quite a few places throughout my web app. My header and footer have a different font from the rest of the elements. They also have a dark background color while the page itself is white. The main entry forms (login and create a new task) have a yellow background on the white page with dark text and white input fields. The button for these forms is also dark. The tasks retrieved from the database have a dark background on the white page with a yellow border, white text, white input fields, and a yellow button.
  - _Repetition_ - The rule of repetition encourages the repetition of specific design elements across the entire page or website (consistency in design). I employed repetition for text, forms, and general styling across my pages. All of the text is left-aligned and certain elements (the header and footer, all other text) share the same fonts. The header and the footer share the same background color and width across the screen. The tasks that are retrieved from the database all have the same background color, borders and border colors, buttons and button colors, and arrangement within their containers. All containers around the forms within the page have rounded corners. The forms also all have the same type and style of input fields. I also kept spacing between/around elements consistent.
  - _Alignment_ - The rule of alignment states that all elements on a page should have a visual connection with another element on the page in order to create a stronger cohesive unit. I implemented this principle in a lot of places across my web app. The header and footer are both left-aligned and outside of the other elements. There is a clear line from the header to the footer that doesn't align with any other elements. I also used the principle on all of the forms. The text, input fields, and buttons in the forms are aligned with each other. The forms that display the tasks retrieved from the database are aligned on a different line than that of the task entry form or the login form.
  - _Proximity_ - The rule of proximity is to place related items close to each other to improve readability and organization and create a cohesive group. In this project, I utilized the principle of proximity in multiple places—the first and most noticeable being the form input fields. The fields are kept close together on the login page along with the button to submit the form. The same is true of the new task form on the home page. All of the created tasks also have their input fields in close proximity. The fields that can be changed are closer together than they are to the disabled field (for display purposes) . The tasks themselves follow the principle of proximity. All newly created tasks are added to the list of tasks.
