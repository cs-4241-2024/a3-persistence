## To-do List A3
I have an extension from professor Roberts
Glitch: https:https://a3-chenxiiz.glitch.me 

Summary:
- the goal of the application is to make sure people can add tasks as a To-do List and it will show you how many days left before deadline.
- challenges I faced in realizing the application was it's important to be able to get the _id from MongoDb when tasks was submitted, so the delete button can associate with it and to delete tasks from backend too. It took me a couple of days to figure that out. 
- I don't have a login for this assignment becasue I am still working on it.
- I have express and MongoDB setup
- I am able to delete task using the delete button to delete the tasks in the backend that shared the same Mongo id. 
- I used Bulma as my CSS framework
  - Applied a linear gradient background to the entire page 
  - Limited the width of the form to 50% of the viewport width to avoid it taking up too much space and ensured it's centered on the page.
  - Set padding for the table cells and ensured the table headers (th) are bold for better readability.
  - Used Flexbox for layout consistency, ensuring the form and table are centered both vertically and horizontally within the viewport.
- I used express.static() :Serves static files (like HTML, CSS, and JavaScript) from the public directory, allowing the client to access these resources directly. 
- express.json() :Parses incoming requests with JSON payloads and makes the parsed data available via req.body. This is essential for handling form submissions and API requests. 
- dontenv: Loads environment variables from a .env file into process.env, which allows for secure storage and retrieval of sensitive information (e.g., database credentials) without hardcoding them in the codebase. 
- And my custom middleware app.use((req, res, next) => { : ensures that the MongoDB connection is established before handling requests. If the connection to the database is not available, the middleware sends a 503 Service Unavailable response to the client.

## Design/UX
W3C
- Descriptive Button Text: I changed the button labels from "Submit" to "Submit Task" and "Delete" to "Delete Task." This ensures that screen readers provide clear instructions about what each button does, making it easier for users with visual impairments or cognitive difficulties to understand the actions.

- Increased Font Size: I increased the font size to make the text more readable for users with low vision. This change ensures that users can comfortably read and interact with the content without needing to zoom in or use assistive technology.

- Sufficient Contrast Ratio (12.5:1): I tested the contrast between the background and text colors and confirmed it has a ratio of 12.5:1, which exceeds the minimum WCAG standard. This makes the text highly legible, ensuring that everyone, including users with visual impairments, can easily read the content.
CRAP principles


- ### Contrast:
On my to-do list website, the element that receives the most contrast is the header, which features a bold, larger-sized font compared to the rest of the content on the page. I used a darker font color for the title to ensure it stands out from the background, immediately drawing attention when a user visits the page. Additionally, the background gradient—a mix of soft blues, greens, and beige tones—creates a smooth contrast against the text, which is primarily a dark shade. Buttons are given an accent color (brownish tones, like #D2AC8A) to make them pop, especially when compared to the lighter background. This contrast ensures that users immediately know where the interactive elements are and helps them easily locate the key action points.

- ### Repetition:
Repetition is achieved through the consistent use of a singular font family (Montserrat) across the entire website. This maintains uniformity in the design and provides a polished, cohesive look. The use of consistent spacing and margin throughout both the form elements and the table ensures that the layout feels unified. The button design remains the same across all actions, with the same primary color and hover effect, reinforcing a sense of familiarity for the user. This repetition creates predictability in the interface, helping users feel more comfortable navigating the site, as they don’t have to guess where to click or how elements will behave based on inconsistent designs.

- ### Alignment:
Alignment is used to maintain a clean, organized layout. All content is center-aligned, which gives a symmetrical, balanced look to the site, helping it feel approachable and easy to navigate. The form elements are stacked vertically with consistent left alignment for the labels, ensuring clarity in user input areas. Meanwhile, the table of tasks is center-aligned to give a neat, organized feel, with columns arranged consistently across the page. This vertical and horizontal alignment creates an easy-to-follow structure, enabling users to find information quickly and ensuring that the design appears orderly, reducing any visual clutter.

- ### Proximity:
Proximity is used to group related elements together to enhance the user’s understanding of the interface. For instance, in the to-do form, the label and input fields for each task detail (e.g., task name, priority, creation date) are placed in close proximity, indicating they belong together and should be interacted with sequentially. Similarly, the table columns group related information (like task details) together, while actions like delete buttons are placed close to the respective task to clarify their function. This grouping helps users process information efficiently, as related elements are visually close, reducing cognitive load and making the interface more intuitive.
