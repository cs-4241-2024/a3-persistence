## Your Web Application Title

Glitch website link: http://a3-eddie048.glitch.me

This is a racing game that stores user's times in a database and allows deletion and editing of times.

To authenticate users, I simply store username and password combinations in the database. The password is stored hashed for security. The server simply checks an entry against all combinations. This seemed like an easy but secure authentication approach.

I was not able to use a css framework as I was having trouble allowing external css stylesheets to get through the server.

For testing purposes, the username password combination 'test', 'test' has some data in it already.

## Technical Achievements

- **Lighthouse Scores**: I got a 100 on all 4 lighthouse scores on both my login page and main page.

- **Middleware Packages**:

1. cookies-session: Helps handle cookies and maintaining a session between client and server.
2. express-handlebars: allows server to render html and inject data into it.
