Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
=== 

## Cookie Jar - a3-piper-oconnell

glitch: https://glitch.com/~a3-piper-oconnell

**Instructions**:
- Logging in with no username/password will show all data.
- tester login: admin - password

**The Goal of the Application**:
- The goal of the application is to store data on someones name, favorite type of cookie, favorite type of ice cream, and any comments they want to make.
- The dataset will then give each user a type of cake based off of their favorite type of ice cream and cookies.

**Challenges Faced**:
- This project definitely showed its difficulty from the start. Converting my code to express, and the database to MongoDB proved a challege. Then adding the delete/update data functions was a second challenge. The third and hardest challenge was the addition of authentication and user accounts. One of the issues that I ran into was adding another html page in, and I learned that the page you want to appear first should be named "index.html".

**Authentication Strategy**:
- The authentication strategy I chose was to have accounts in my mongodb, to get input from the user, and then check to see if that is the correct username/password. I chose this strategy because it seemed the easiest, although it helped me learn a lot about the login process and multiple pages on a website.

**CSS Framework**:
- The CSS framework I chose for my application is Sakura, a class-less based CSS framework. I chose this framework because I really enjoy the simple style. The buttons with the fun touches of color, that change when you mouse over them. Other nice touches are the input fields and the font family.
  https://github.com/oxalorg/sakura

### Technical Achievements

- **Technical Achievement 1**: I achieved all four Google Lighthouse tests to 100% (please see Assets of the Glitch project, or the file on GitHub /screenshots/ for the picture)

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
- "Use Headings to Convey Meaning and Structure": I used this tip on both of my pages to be able to convey meaning and structure. I think it helps the page flow correctly when the user is looking at it for the first time.
- "Provide Sufficient Contrast Between Foreground and Background": I used a light background color with darker font elements as well as darker colored buttons that stood out.
- "Ensure That Form Elements Include Clearly Associated Labels": Each form element on my page is clearly labeled.
- "Associate a Label with Every Form Control": Same as above, each form element has a label associated with it. 
