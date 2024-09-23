## To-do List A3
I have an extension from professor Roberts
Glitch: https://a3-chenxiiz.glitch.me 

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
