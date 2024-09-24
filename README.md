Anime Tracker Web App (now with login and persistent data!)
===
https://a3-ananya-jayamoorthy.glitch.me/login 
 
The goal of my application was to build on the existing project from A2 in order to make it a portfolio piece. While developing, the most difficult parts were definitely trying to get the registration page to work because I had to create that from scratch as opposed to index.html, where the starter code provided some help. I chose to use a basic authentication strategy where the username/password checks all occur within my code and not through the use of an external library because I knew I wouldn't have the time to wrangle something like passport.js.

For the CSS framework, I chose to take inspiration from the Bootstrap library but I did all of the CSS myself. As I am interested in full-stack web development as a career, I wanted to try my hand and designing the web app completely. It was difficult and time consuming but the result was pretty solid and visually appealing. With practice, I think I could make some real nice UI in the future.

My `Google Lighthouse` scores were all over 90, with a majority of them being 100s.

Login Page Lighthouse:
![image](https://github.com/user-attachments/assets/801bbeb6-fd2a-4c1a-989e-ff2ce374735f)

Registration Page Lighthouse:
![image](https://github.com/user-attachments/assets/8eadefd3-3e79-4641-ae3f-565ff38d2324)

Main Page Lighthouse:
![image](https://github.com/user-attachments/assets/01763abc-c97f-4b40-b0e2-b5f590625d2d)

===

### Technical Achievements
- **Tech Achievement 1**: While not all three of my pages have a full 100 in all 4 lighthouse tests, 2 of my webpages do hit that mark so I think I should get some partial credit, especially when I consider the time spent wrangling with the accessibility marker.
- **Tech Achievement 2**: I installed a lot of things through the terminal and npm for this project, so here they are with short descriptions:
    - `body-parser`: middleware; parses incoming request bodies in a middleware before it reaches the handlers, making them accessible under req.body
    - `cookie-parser`: middleware; parses cookies attached to the client request object, making them accessible under req.cookies
    - `bcrypt`: library; used to hash passwords, providing security to user authentication
    - `dotenv`: module; loads environment files from a .env file and adds a layer of security for "secret" variables and admin details
    - `nodemon`: tool; restarts the node server automatically when file changes are detected
 - **Tech Achievement 3**: I added a level of user security by saving a hash of a user's password in the database, instead of just saving the password straight up. At no point during my development was there a moment where a user's privacy wasn't protected. I did this hashing by using the `bcrypt` library which utilizes a cryptographically secure hash function. I would say this acheivement is worth between 3 and 5 points.

### Design/Evaluation Achievements
- **Design Achievement 1**: I chose to forego CSS styling libraries/frameworks and instead did all the styling myself. I did get inspiration from Bootstrap and Tailwind but the code was mine. The challengng part of this achievement was definitely working with flecbox and trying to make a somewhat visually appealing design. Of course, I can see *many* places for improvement on the design. Since a significant portion of time went into the UI aspect, I think this achievement is worth between 2 and 5 points.
- **Design Achievement 2**: Design according to the CRAP Principles:
    - Contrast: This was probably the most difficult principle to nail down because I like curated and aesthetic color palettes but a lot of those palettes are NOT meant for web design. To determine what colors I used on my webpages, I looked at various animation screengrabs because the colors in those scenes have already been taken care of by real artists. Once I decided on a screengrab, I pulled colors from those images and tweaked them until the contrast values passed the accessibility tests. My web app is definitely far from perfect, but I'm working on it.
    - Repetition: I stuck to only one font for my web app, which was Montserrat. I chose this font because it was simple and clean but also because it has a lot of variations. I also wanted to have a theme to my website that matched its purpose so because the app tracks anime progress, the backgrounds were gifs taken from well known animes. All of the gifs are from Studio Ghibli so that's another element of repetition. The main index page has a forest theme, with muted greens and browns. The login page is more bright and pink and the register page was a more vibrant green. All of the pictures were based in nature.
    - Alignment: Against the advice of the book I used different alignments to get a look I wanted, including the dreaded center alignment. A lot of the forms I see out in the wild (on the Internet) are center justified because they tend to be the only thing on the page. That is why all of the forms in my web app have a center alignment. For the hero element on the index.html page, I chose the left align option, mainly because I liked the way it looked.
    - Proximity: The elements of my app are divided into visual blocks. The forms are coupled with descriptive headings and surrounded by an opaque box to visually signify that these elements are related to one another. Cards are a different color from anything else on the page and are surrounded by a border.
 
Background Image Sources: 
- My Neighbor Totoro: https://i.pinimg.com/originals/11/7b/ea/117bea6777b5ad4e03bb63a154f1603d.gif
- Spirited Away: https://i.gifer.com/4tkR.gif
- The Secret World of Arietty: https://i.pinimg.com/originals/76/01/a3/7601a31e47247077856ed69b7b4fa124.gif 
