## To-Do List

As of right now, I've been debugging for the past two days, most SAs and TAs can't help or figure out the issue.
I coded most of this before the issue started to occur so I didn't get to add to and modify the CSS or the Google Lighthouse testing
I'm using the default port 3000 but in the logs I am getting this:

    events.js:174

    throw er; // Unhandled 'error' event

    Error: listen EADDRINUSE: address already in use :::3000

To try and solve it, going through possible solutions like my node.js and mongodb not being on supported versions but I attempted to fix that.
It looks like it is connecting to mongodb but there's a port problem that I can't seem to identify.
I'm really not sure why it is doing this at this point, I have no instances of Glitch running at the same time and can't seem to find any way to make this run properly.
So here's my code attempt, hopefully I can gain some credit for my server code and login logic.
