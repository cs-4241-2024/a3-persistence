## Birthday Tracker - mkneuffer - Matthew Neuffer - Assignment A3

https://a3-mkneuffer.glitch.me/

**login information**: you can use either your github, or the test account created. To use the test account, the username is test and the password is test

I built off of my idea and project from a2. In a2, I made a site that let you put in a date/birthday and it would tell you the age of the person, the day of the week, and other information. In this iteration,
I built a birthday tracker to give an easy way to keep track of peoples birthdays. It shows you their name, their birthday, their age, and the number of days until their next birthday.
From a2, I had already figured out the derived fields that get saved to the database and I had the math/calculations for finding age, and other date related items.

I use express and mongodb to save the users as well as the people and birthdays entered by each user. The entered data for each user is shown in a table for each corresponding user.
Then, you can also edit and delete the entries. Since most of the fields are derived, you only need to edit the name or birthday, then the derived fields get updated based on those changes.
Deleting removes the entry entirely. For form entry, I have a text box for the name and a date field for the date. This allows the user to scroll through a calendar view which makes it easier to
control date format, which was an issue I faced on my first version in a2.

For logging in, you can either have an account manually added, and sign in that way, or you can use github oAuth. This seemed like the best option because the project is submitted and graded through github, so everyone should have an account.

For the CSS, I used the bootstrap framework. I chose this one because it is one of the more popular ones and it sounded familiar to me.

I was also able to get 100 for all categories in lighthouse. I will add a picture to the repository as well. Half way through development, I tested, and fixed to get 100, then later it dropped back down, so I had to go backthrough and make the improvements to get back to 100

## Technical Achievements

- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: Still hosting on glitch, not one of the others.
- **Tech Achievement 3**: Got 100 on all 4 categories. Image attached in repository.
- **Tech Achievement 4**: express middleware: express-session, passport, passport-github2, passport-local, connect-flash, express.json

### Design/Evaluation Achievements

- **Design Achievement 1**: I created descriptive titles and descriptions to add to the accessibility, which comes from the tips for writing. Then for design, contrast is important. The contrast was implemented through use of the css framework, and has colors that are distict.
- **Design Achievement 2**: For Contrast, the Bootstrap framework has built in contrast that allows for easy distriction between differnet parts of the page. For repitition, the table allows for easy repition. Buttons with the same function have the same color.
  For Alignment, teh two entry fields are aligned with the submit button. Then the table also, allows for easy alignments making it easier to visually understand. Finally, for proximity, the entry fields are in their own section, and the table is in its own section, using proximity to seperate the two. Then with the table, it makes it easy to tell what belongs together because of the proximity and alignment.
