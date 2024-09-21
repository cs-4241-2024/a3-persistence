Andrew Cash
Assignment 3

## Your Web Application Title
Classmate Tracker

glitch: https://glitch.com/edit/#!/a3-andrew-cash?path=public%2Findex.html%3A1%3A0

The goal of this application is to provide users with a way to store other classmates contact information. The user can log in
and enter a classmates info to be stored to the table. If a user does not have an account they have the option to create one. 
Each account stores different contact information for that specific user.
The current valid accounts are 
  usrname: arcash
  password: cash123
  
  usrname: jmah
  password: mahmah

A big challenge I faced was actually connecting to the database. I was unable to connect using a username and password so I used
the long string that was provided by mongodb and it finally connected. 

For authentication I chose to store usernames and passwords in a separate database cluster. That way I would be able to 
easily implement a sign up form, which would add the user account details to the cluster. Then upon login, I simply verified that
the user info was in the cluster. I did this because I really wanted to implement the sign up sheet because it felt weird to hard
code accounts.

For the CS framework I used sakura.css. I found this to be a very simple theme, which I was looking for. I figured because my
app was strait foreword and simple, it didn't make sense to spice it up with a fancy theme. This framework keeps everything
nicely organized as well. I modified some css to make the buttons change when hovered over, for one of the achievements.

## Technical Achievements
- **Tech Achievement 1**: Server: Somehow couldn't get it to work using AWS (only free one I could find)

### Design/Evaluation Achievements
- **Design Achievement 1**:Site accessibility:
Use headings - Throughout my web app I have multiple headings for each section below. This includes the add person section, delete/ edit person, sign in and sign up.

Make link text meaningful - I use buttons to link to different pages of the app. For each button I specify what it is for such as signup or login, so the user knows to click it to be taken to the correct page.

Provide clear instructions - On my application I have plenty of instructions telling the user how to use the app. The most important being how to add a name to the list.

Keep content clear - I purposely used a simple css template for this version of my app to keep my app clear and simple. I tried to avoid distractions on the page, so that all the info is displayed clearly.

Ensure interactive elements are easy to identify - for my interactive elements (buttons), I make it clear that they are interactive by changing the color of the buttons, and changing the pointer of the mouse.

Consistent navigation options - I have easy navigation options that take the user to the desired page such as a sign in button to take them to the app, a signup button to take them to the signup page, and a logout button to take them back to the sign in page.

Form elements include clearly labeled - I label all my forms so the user knows what to enter such as the username and password forms, as well as the add/ edit forms.

Use headings and spacing to group related content - I separated my apps features into different sections, where each section has its own headers. These include: log in, sign up, enter names, delete names, and edit names.

Create designs for different viewports - In my css file I have a media query that adapts the design for different viewports.

Associate a label with every form - Each form is clearly labeled so the user makes no mistake about what the form is for.

Help users avoid and correct mistakes - i have clear instructions for each feature in my app so users don't make mistakes.

Reflect reading order in the code order - everything in my html code is in order of how it appears on the web page.