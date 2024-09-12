## Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  
My project is a very simple one-button clicker "game." You can click the button to increase your score, and then enter your name and press submit to submit it to the high scores table.
You can edit your score by simply writing your name again and pressing submit.
Similarly, you can delete your score by entering your name and pressing delete.

When you submit your name and score, the server then derives a third field for the placement, and sorts the list and updates it live on the client. 

I used the CSS grid to position the elements. They are formed in two columns, with the button on the left and the scores on the right.
On small screens (detected using media queries), it will change to being in one column so that the scores are not pushed off the screen.

All the elements are styled using an external CSS stylesheet. 

## Technical Achievements
- **Tech Achievement 1**: The table updates immediately after pressing submit without refreshing or going to a different page.
- **Tech Achievement 2**: You can edit data by entering the same name and pressing submit and it will update to the new score. You cannot edit score directly, because that would be cheating.

### Design/Evaluation Achievements
- **Design Achievement 1**: Last name: Riley.
They had an issue when they put a very long name that the website got very wide and the button column was squished.
They managed to cheat by editing the POST request directly to get a very high score.

I would change the table to have a maximum width and make long names wrap to the next line. 
