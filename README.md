Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## Tea Log

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

Summary:
  My website is designed to be a personal tea log. You can put in the type of tea, when you had it, and your rating, and the server will add a note based on the rating. If all three fields are left blank under the "Add to Log" section, then a blank row will NOT be added. Therefore, if you refresh the page, it should display the data as it was before you refreshed the page. For the Edit Log Entry part, you can choose to edit any of the 3 fields (type, day, rating). If you choose not to update a certain field, just leave that textbox empty. 

Challenges:
  -Figuring out how to use the database. I am used to schema-based databases, so I didn't realize a "collection" is actually just a table. Once I figured that 
  out, it was easier to structure my data
  -I am dumb and accidentally pushed my .env file to github, so I have to go and change the password and I also deleted the original repo for good measure. That one is on me for not remembering to add the .gitignore file
  -I couldn't figure out how the cookies worked
  -Debugging, I tried to use the debugger a few times, but it took some time to get used to and I still don't feel as confident with it as I do using console.log()

Authentification:
 -I am simply checking if the username is in the database, and if it is, checking the password. If the username is not in the database, I make a new account for the user. This was the easiest and I also couldn't get the cookies to work.

 CSS Framework:
 -I used Bulma. I chose it because out of the ones I looked at, the documentation was the best in my opinion, and I liked the color and style. It ended up being very easy to use, although I think I do prefer my handmade CSS from assignment 2


## Technical Achievements
- **Tech Achievement 1**: I got 100% in all 4 lighthouse test for this assignment (see lighthouseTestScreenshots folder for proof). I also tried to use a different service than glitch, but the two provided in the instructions both required payment information before I could make an account, and I didn't want to provide them with my payment information. Therefore, I personally like Glitch better because it is free.

### Design/Evaluation Achievements
- **Design Achievement 1**: I am not sure if this is going to count, but one small thing I did that took up more time than I thought it would was adding little icons in the username and password fields. I think this makes the login page look more professional. But, I had to set up an account with fontawesome to set up a "kit" of icons, and include that as a seperate link/reference at the top of my html file. Then I had some trouble getting them to be inside of the box, but the CSS framework I used had an example that I was able to work off of. Overall, I think this achievement is worth somewhere between 3-5 points. I think it was equal in difficulty to the lighthouse tests, but it's such a small detail on the actual webpage.
