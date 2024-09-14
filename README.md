## Fantasy Football PPR vs Dynasty Rankings: make your own table

Heroku : https://a3-stryder-crouse-af275422c96c.herokuapp.com/


### Goal of application
The goal of this application is to provide each user with a table they can update to compare football players ranking between PPR(Points Per Reception) and Dynasty formats.

### Challenges Faced
- Needed to create a new method of deleting players from the table as the old method of inputting the id of the player proved to be cumbersome when using Mongodb.
- Uploading the app to Heroku required a lot of trial and error, due lack of support.
- Implementing Oauth for GitHub accounts also required a fair amount of trail and error, due to lack of documentation of the `passport-github2` package
### Authentication strategy chosen
- I chose to use the Oauth 2.0 authentication method (using GitHub accounts) as it allowed me to get around storing passwords for the users and allowed me to challenge my self.
### CSS framework
- I used the tailwind css framework to re-style my application as I was familiar with it from my software engineering course (CS3733)
- Tailwind also allows for a lot of flexibility for designing elements.
- Custom CSS changes include:
  - a rule to change all text to the Google font `Open Sans`

## Technical Achievements
- **OAuth authentication using GitHub**: I implemented OAuth authentication via passport.js GitHub strategy
- **Hosted on Heroku**: I hosted the website on Heroku instead of Glitch
  - Positives:
    - Uploading the project from GitHub was relatively painless
    - Ui showing throughput, memory usage, and response time is a nice touch.
    - Looks like it could be more extendable than glitch but my simple app does not take advantage of this
  - Negatives:
    - Basic hosting requires payment at $7 a month
    - Entering environment variables is confusing as you cannot just upload a .env file like Glitch
      - Instead, you have to go to "setting" -> "config vars" and then manually type in each variable
    - Heroku assigns a port number to your application in the environment variables but does not make it clear that this is the case.
      - This prevents you from using the port number you want and requires you change the application to use the PORT environment variable.
    - Whenever the sever crashes you can restart it, but the button to do so is named "Restart all Dinos" (unintuitive) and is hidden under a menu button called "more"
    - Logs to see how your sever crashed are also hidden under "more" and only provide a stack trace if you are looking at them as the sever crashes.
  - Overall I like Glitch more.
- **Got 100% on LightHouse for both the login and table pages**: see `Light-House-Login-Page.png` and `Light-House-Table-page.png` for proof
- **Middleware packages**: 
  - Passport.js: for implements the Oauth GitHub login system
