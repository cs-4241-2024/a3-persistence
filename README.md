Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template


## To Do List

glitch link: https://a3-asjacob25.glitch.me/ 

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application: to create a todo list for user that can be displayed, added to, modified and deleted. 
- challenges you faced in realizing the application: Implemening the database through mongoDB was a bit tough at first but slowly I became familiar with its functionality.
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable): I used cookies and a loggin page to verify user account informaion.
- what CSS framework you used and why: I used the modern-normalized framework for it's sleek and user friendly design. I implemented this through the CDN reference in my html.
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please :
express.static: Serves static files from a specified directory, allowing clients to access resources like HTML, CSS, and JavaScript files.
express.json: Parses incoming request bodies in JSON format and populates req.body with the parsed data, enabling easier handling of JSON payloads.
express.urlencoded: Parses incoming request bodies with URL-encoded data (typically from form submissions) and populates req.body, allowing easy access to form fields.
cookie-session: Manages session cookies in the browser, enabling session data to be stored on the client side securely and accessed across requests.
MongoClient (from mongodb): Provides a client interface for interacting with a MongoDB database, allowing you to perform operations like connecting to the database and executing queries.
add a little more detail about what it does.

## Technical Achievements

### Design/Evaluation Achievements
- **Design Achievement 1**: 
Here is my CRAP description:
Contrast
In my site, contrast is employed to enhance readability and guide user attention. The most emphasized element on the login page is the "Submit" button, which features a vibrant blue background against a white form section. This stark difference draws the user’s eye, signaling that this is the primary action. Similarly, on the To-Do list page, the header "Your List:" contrasts with the rest of the content through its larger font size and bold weight. This hierarchy not only highlights the importance of the heading but also helps users navigate the information presented. By utilizing contrasting colors and sizes, I ensure that key actions and headings stand out, making the overall user experience more intuitive and engaging. Additionally, by using a subtle background color for the body and a white background for the form sections, I reinforce the contrast further, creating a clean and organized look.

Repetition
Repetition plays a crucial role in creating a cohesive look and feel across my site. I consistently use the same color palette—primarily shades of blue for buttons and headers, with neutral colors for backgrounds and text—to maintain visual unity. The font choice, 'Segoe UI', is applied uniformly throughout, ensuring text readability and consistency. Layout patterns, such as the arrangement of form elements and tables, are repeated to create a familiar structure for users. For instance, both the login form and the To-Do entry form follow a similar design with labels above input fields, ensuring users can easily understand how to interact with them. This repetition of design elements reinforces brand identity and helps users navigate the site without confusion, as they can anticipate where to find information and how to interact with various sections.

Alignment
Alignment is strategically used to create order and enhance clarity within my site. For instance, all form labels are aligned to the left, which provides a clean and organized appearance that makes it easy for users to understand which input corresponds to each label. This intentional alignment reduces cognitive load, allowing users to process information quickly. In the table of the To-Do list, headers are also left-aligned, promoting a sense of organization. Additionally, the buttons are centered within their containers, drawing attention and encouraging interaction. By aligning elements in a purposeful manner, I enhance both the aesthetic quality and functionality of the site, ensuring that users can easily identify and access the features they need.

Proximity
Proximity is utilized to group related elements together, thereby enhancing the overall clarity of information on the site. For example, within the To-Do entry form, the input fields for "Item To Do," "Type of Work," and "Due Date" are placed in close proximity to each other, signaling to users that they are all part of the same task creation process. This organization not only simplifies the visual experience but also aids in user understanding by allowing them to see the relationships between different pieces of information. Similarly, the table rows in the To-Do list are spaced closely together, highlighting that each entry belongs to the same category. By strategically placing related elements near one another, I create a more intuitive user experience, allowing visitors to process information efficiently and effectively.
