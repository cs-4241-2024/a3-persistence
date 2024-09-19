## Game Wishlist

James Cannon https://a3-james-cannon.glitch.me

- The goal of this application is to create a wishlist of games with discounts for individual users. It is functionally indentical to my A2 application at face level except for the login and modify buttons. There is also a logout button set up mostly for testing and debugging purposes which will simply send you back to the base html file when clicked.
- My biggest challenge came from a lack of time to finish the assignment due to issues setting up MongoDB. While most of the requirements weren't too challenging, they were confusing and time consuming. The most challenging things were trying to make the delete and modify buttons work in the new server format. In fact, I'm not entirely sure if they work properly.
- My authentication strategy basically just checks for existing usernames and passwords in MongoDB, and if an existing username is input with a different password it will throw an alert. If the username is new, a new database entry is formed with the given username and password. This seemed like one of the easiest ways to implement this and even let me do a single page site.
- I used the Simple.css classless framework because it looked surprisingly nice with my website for being as simple as advertised. I didn't make any modifications to the framework mostly because mime threw errors at me.

## Technical Achievements
- **100% Lighthouse Tests**: I got 100% for all four required lighthouse tests on desktop, which can be seen in the picture in this repository. The only challenge here was finding the suggestions on previous lighthouse tests to see where I had to improve.

### Design/Evaluation Achievements
- None 
