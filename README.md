Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
Brittany Ficarra

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Your Web Application Title

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

Project Summary

- The goal of my application is to allow individual users to keep track of the homework that they have to get done.
- A challenge I faced was mostly just time due to my other classes other than that it went pretty smoothly. I just porteed A2 to use MongoDB and added user accounts and data specific per user from there.
- The authenticatin strategy I used was to just store usernames and passwords in MongoDB. Pretty much it checks if the username exists in which case if it does exist it then checks if the password is correct and if it is logs the user in and if not has a popup alert letting the user know that their password was incorrect. In the case of a new username the username and password entered becomes a new user that then is stored in the database. I used this authentication strategy because it seemed the easiest to implement.
- The CSS framework that I used was Tacit CSS which I used because I liked the modern and simplistic look of it. I did not make any changes to it.

## Technical Achievements
- **Tech Achievement 2**: I attempted to use both Heroku and Digital Ocean but was unable to due to their requirement to hook up a payment method which I was not comfortable supplying. I also attempted to try another site called Plunker but it kept thinking that the main page of the site was the CSS file for some reason and it was unable to properly install the npm files. I also had to copy and paste all the files manually into it due to a lack of the ability to import or upload files. I understand that I did not succeed in this achievement and will likely not recieve the points but I did my best to attempt it at the least.
- - **Tech Achievement 3**: I got 100% in all categoried on Google Lighthouse. See lighthouse.png for an image of the results.

### Design/Evaluation Achievements
- I did not do any design achievements due to my workload and time constraints.
