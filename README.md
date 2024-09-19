## Book Manager
Eleanor Foley
your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me
===

Description
---
To run you must type node server.js in the terminal
Then do localhost in a browser tab

- the goal of the application is for users to add books on their book manager
- challenges you faced in realizing the application. I thought for logging in I had to access "database access" on mangodb and did a lot of googling and wasted a day then went to office hours the next day and realized I could just make a table containing users passwords and usernames. That was unclear on the github how to go about accessing/storing users and passwords.
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable). I just had logging in with a username and password
- what CSS framework you used and why. I used bulma since it said it was realitively easy and simple
  - include any modifications to the CSS framework you made via custom CSS you authored. None
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.. This was optional so I didn't do it.



Acheivements
---
Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the 
assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%. 
These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README, 
why it was challenging, and how many points you think the achievement should be worth. 
ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

*Technical*
- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/). 
*You must either use Github authenticaion or provide a username/password to access a dummy account*. 
Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. 
Please contact the course staff if you have any questions about this. THIS IS THE HARDEST ACHEIVEMENT OFFERED IN WEBWARE. You have been warned!  
- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse? 
- (5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment.  

*Design/UX*
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*. 

1. Associate a label with every form control
2. Help users avoid and correct mistakes
- For any numbers input required I made it have little arrows for up or down
3. Don’t use color alone to convey information
- I have some words bolded and buttons with color
4. Ensure that interactive elements are easy to identify
- all buttons are colorful
5. Provide informative, unique page titles
- Main Page, Log In Page, Create User Page
6. Use headings to convey meaning and structure
- I have subheadings in locations 
7. Provide clear instructions
- I have instructions for the limits of certain forms
8. Keep content clear and concise
- text is rather minimal and only there for helping the user
9. Provide sufficient contrast between foreground and background
- the background is either black or white (dark mode starts in the evening), there is a clear contrast with the colors
10. Ensure that form elements include clearly associated labels
11. Provide easily identifiable feedback
- when creating an account you will be told if you have successfully created an account or not
12. Use headings and spacing to group related content
- pretty self explanitory on my main page, they are grouped and have a heading



- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. 
Which element received the most emphasis (contrast) on each page? 
How did you use proximity to organize the visual information on your page? 
What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? 
How did you use alignment to organize information and/or increase contrast for particular elements. 
Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total). 

The titles and buttons on the page receive the most emphasis, making them key focal points. The titles are intentionally large, ensuring they stand out to users, while the buttons are all designed in a consistent blue, which contrasts with the surrounding text. This color choice helps direct attention to the interactive elements. Additionally, the input fields on the main page feature a different shade of blue, clearly indicating where users can enter information. To further enhance readability, certain words are bolded, highlighting essential information that users should not overlook. Lastly, the implementation of a dark mode offers a more comfortable viewing experience during the evening, allowing users to switch according to their lighting needs, ultimately improving usability at all times of day.
Proximity is a fundamental design principle used to organize data across all pages of the site. Each section is encapsulated within its own container, visually differentiating the various functionalities. This method allows users to easily identify the purpose of each area, whether it’s for adding, deleting, or modifying data. For account-related actions, such as creating an account or logging in, dedicated containers clearly display relevant fields like username and password input. This organization not only aids in navigation but also simplifies the user experience, as individuals can quickly find the information they need. By grouping related content together, users can complete tasks more efficiently, minimizing confusion and enhancing overall satisfaction with the site.
To build the site’s design, I utilized the Bulma template and carefully selected colors that complemented the overall aesthetic. All buttons share the same color palette, providing a cohesive look and feel throughout the interface. Input fields on the main page are also consistently colored, reinforcing the visual identity. Initially, I encountered challenges while integrating Bulma, as I was transitioning from previous assignment files where I manually inputted CSS elements. This adjustment required a bit of time to familiarize myself with Bulma's predefined styles. However, the framework’s range of options allowed me to pick and choose specific styles and colors that aligned with my vision, ultimately leading to a more polished and cohesive design.
Alignment plays a crucial role in establishing a clear hierarchy and guiding the viewer’s eye through the information presented on the site. By consistently positioning elements, I created a structured layout that enhances the overall readability of the content. This sense of order allows users to navigate the site effortlessly, as their attention is directed to the most important information first. Strategic alignment of headings, buttons, and other key elements not only improves aesthetics but also ensures that users can quickly digest the information. This thoughtful approach to design enhances user experience, making it easier for visitors to interact with the site and accomplish their goals, whether they are looking for information or performing specific actions.


