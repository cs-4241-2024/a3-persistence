# Featherfest Match Submission App
## Description:
### Lighthouse:
![img.png](img.png)

### Glitch: https://a3-jeremymkurtz.glitch.me/


### Goal of the application:
Make it easier for athletes to submit their scores to their badminton matches. 
Was the assistant for my high school's badminton team. Where we held a tournament(Featherfest) for 160 students and 12 schools. 
So wanting to make it easier both on admins and on student athletes. 

Note that I changed my app from a2 to a3 due to me wanting to prep for the final project, will likely use a3 as a starting point for final project.

### Challenges: 
Struggled on approach to implementation of the change and deletion of data. 
I decided to make the buttons for changing and deleting have their id's be the associated data's id in mongo.
So the logic became easier after that.

### Authentication Strategy: 
I used a collection and just stored all users and their associated passwords within there. 
Then queried for specific username and password.
I did this because that's what made the most sense and easiest to me.

### CSS Framework:
I ended up using Bulma and some of my own css hard code as well. I chose buma because I liked the look of it and it had
helper methods that were similar to tailwind css which I am used to. 

Some of the custom css I used was to make the body big enough and center automatically. 
Generic automatic flexbox stuff, vertical and horizontal. Then lastly a lot of custom modal stuff. 
As the bulma framework couldn't supply everything I needed.

### Express Middleware:
To my knowledge I don't think I used any additional middleware then what was provided in the starter code(class examples).

## Achievements
### Technical Achievements
None

### Design/Evaluation Achievements
None
