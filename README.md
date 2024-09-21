Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

https://a3-jjcool1128.glitch.me/login.html

username: jj
password: jj (or register your own :))

I ended up making a complete new website due to the issues with my last assignment.

The primary goal of the journal website is to provide users with a secure and private platform to write and manage their personal journal entries. 
One of the significant challenges in realizing this application was ensuring a seamless user experience across different functionalities such as 
registration, login, entry submission, and entry management, while maintaining robust security standards. 
To handle user authentication, I opted for Passport.js with the local strategy. 
This choice was driven by its simplicity and widespread adoption, which made it easier to implement and reliable for managing credentials securely. 
It also supports a range of other authentication methods should the need for expansion arise.

For the website's styling, I chose Pico.css because of its minimalistic approach that offers a clean and modern design with a small footprint, making it fast to load and simple to customize. 
This framework provides sensible defaults, which reduces the effort needed to make the site look presentable right out of the gate. 
I made specific modifications to the default CSS provided by Pico.css by adding custom styles to enhance form elements and buttons, ensuring they are more prominent and user-friendly. 
These customizations included changing button colors to improve contrast against the background, increasing font sizes for better readability, and adjusting padding for a more tactile interface. 
The alterations were aimed at enhancing the user interface without overloading the site with excessive design elements, keeping the focus on functionality and user experience.


## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication using passport
- **Tech Achievement 2**: express-session: Manages sessions across HTTP requests by storing server-side session data and using cookies to identify client requests, useful for maintaining user login states.
passport: Authentication middleware for Node.js that is extremely flexible and modular, supporting a variety of strategies like OAuth, OpenID, and credentials.
passport-local: A Passport strategy for authenticating with a username and password, typically used in applications where users register with login credentials stored locally.
body-parser:Parses incoming request bodies in a middleware before your handlers, available under the req.body property, supporting JSON, and URL-encoded forms.
bcryptjs: A library to help you hash passwords securely, often used in middleware to process and secure user password data before storing it in a database.

### Design/Evaluation Achievements
- **Design Achievement 1**: 
Contrast
The website employs contrast most notably through the use of colors and typography to draw attention to different elements across the pages. 
On the login page, the "Login" button is styled with a distinct, bold color that stands out from the rest of the form elements, ensuring it catches the user’s eye immediately. 
This button uses a contrasting blue shade compared to the neutral background, making it the element with the most emphasis. 
This design choice not only enhances the visual appeal but also functionally guides users towards the next step in the interaction process.

Repetition
Repetition is used throughout the site to create a cohesive visual experience and reinforce familiarity and branding. 
The same set of colors, fonts, and button styles are used across all pages, which helps in creating a unified look. 
The use of a consistent font family (Arial, sans-serif) and color scheme (shades of blue and gray) across all pages establishes a professional and accessible appearance. 
This repetition not only aids in branding but also helps users navigate the site more intuitively as they come to recognize the recurring styles and layouts.

Alignment
Alignment is strategically used to organize information cleanly and effectively throughout the site. 
All text fields and labels in forms are left-aligned, creating a clean and organized structure that facilitates quick scanning and input. 
This alignment extends to button placement, which is consistently positioned at the center below the form fields, maintaining a clear and predictable flow from top to bottom. 
On the index page, journal entries are displayed in a grid layout where each entry aligns with others in columns and rows, enhancing readability and order.

Proximity
Proximity is employed to logically group related content and controls, which helps in reducing clutter and increasing user comprehension. 
On the registration page, input fields for username and password are placed closely together to indicate that they are part of the same form group, separate from the register and login buttons that are spaced further below. 
This grouping informs the user of the form's structure and expected interaction sequence without overwhelming them with too much information at once. 
Similarly, on the index page, related elements like the date, time, and entry description of a journal post are grouped together, making it easy for users to associate these elements with each other.


