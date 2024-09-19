## Yarn Project Cost Calculator

https://a3-direlupus.glitch.me/
  
This application, much like my a2 application, is a cost calculator for crochet projects involving yarn, it has just been revamped to have persisting data, a login page, and the server has been redone in express.js

There really weren't too many actual challenges I faced to get this all working, other than fighting mongodb syntax and navigating the change to express + undoing old bad choices I made in a2. The largest issue was aiming for the 4 100 score on google lighthouse and needing to figure out how to not make the framework CSS load all at once because that was hurting the 'performance' score because of its 400ms load time

I chose usename and password for authentication strategy because... thats what I thought we were expected to do outside of the 10 point 'hardest acheivment offered in webware' which I do *not* feel qualified to attempt

I used Simple.css for my framework, as it is a clean, small, classless CSS framework which basically means that it just... works, while allowing me to make small edits through my own classes. It also didn't break my tables like the first two I tried so that was a nice bonus.

The few CSS changes I made were either colors or centering changes, with a few spacing changes

## Technical Achievements
- **Tech Achievement 1**: The only achievement I did was 100% on all four lighthouse metrics. The only one that isn't consistently 100% is performace, which I think is only lower than 100% when the server on glitch spins down and is outside of my control, so I hope it still counts.

