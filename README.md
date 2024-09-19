# Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

## Event Management System

a3-lorenzockio.glitch.me/

**Overview**:

- This application is used to manage events. After logging in, the user can create new events, edit previously made events, and delete events that have already happened. Each user will have access to their own table of events.

**Usage**:

- Start by logging in. If your username has not been used before then it will create an account for you and save your password. If the username has already been set up then the correct password will be needed to get past the login screen.
- The event form allows submissions, edits, and deletions. Editing or deleting an event will use the event name. Attempting to edit an event that does not exist will create said event. Deleting an event that does not exist will do nothing.

**Challenges**:

- My biggest challenge was working mongoDB. I was able to add to the database fairly easily, but I struggled with processing the data once I took it out. I also had to figure out how to organize seperate users.
- My biggest frustration came with switching from the login page to my main.html. It was working fine at first, but broke when I was working on my server.

**Authentication Strategy**:

- I used a collection of usernames and passwords in my database.

**CSS Framework**:

- I used the Sakura css framework. It was the first one I tried because I liked the name, and I did not try anything else.

### Technical Achievements

- **Google Lighthouse**: 100 points in all 4 criteria

### Design/Evaluation Achievements

- **W3C Web Accessibility**:
- Color contrast
  - Light blue background with dark text
  - Table has alternating colored rows
- Color meaning
  - Hovering over buttons turns them red
- Headings provide structure
  - Clearly purposed sections
- Forms
  - All forms clearly labled
- Viewport sizes
  - I used <meta name="viewport" content="width=device-width, initial-scale=1" /> ...
