Andrew Cash
Assignment 3

## Your Web Application Title
Classmate Tracker

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

The goal of this application is to provide users with a way to store other classmates contact information. The user can log in
and enter a classmates info to be stored to the table. If a user does not have an account they have the option to create one. 
Each account stores different contact information for that specific user.

A big challenge I faced was actually connecting to the database. I was unable to connect using a username and password so I used
the long string that was provided by mongodb and it finally connected. 

For authentication I chose to store usernames and passwords in a seperate database cluster. That way I would be able to 
easily implement a sign up form, which would add the user account details to the cluster. Then upon login, I simly verified that
the user info was in the cluster. I did this because I really wanted to implement the sign up sheet because it felt wierd to hard
code accounts.

For the CS framework I used sakura.css. I found this to be a very simple theme, which I was looking for. I figured because my
app was strait foreward and simple, it didnt make sense to spice it up with a fancy theme. This framework keeps everything
nicely organized as well. I modified some css to make the buttons change when hovered over, for one of the achievments.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
