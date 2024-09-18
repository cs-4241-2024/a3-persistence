Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  
---

## Taskly

Aaron Zhang

Link: https://a2-azzhang3.glitch.me

I created a website for task management. You can create and display tasks that needs to be completed. The fields you can fill out include task, description, due date, and priority. Additionally, it will provide you the creation date (which is set to the date you created the task), the amount of days left (which is calculated from the due date and the creation date), and the status (which will be automatically set to in-progress). Additionally, when the days left gets to 1 day or below (show past due), the box will light up red, getting the attention of the user that this is almost or overdue. The website will save and show the entire dataset which will reside in the server's memory. The website allows for both adding, completing, deleting, and editing tasks, and will update the table in real time. The CSS positioning technique I used was a display block for the form and a grid for the div (container) containing the tables. 2 Fonts from google fonts were used, "Noto Sans" for the body (the majority of the website), and "Roboto Slab" for the title of the website. Additionally, Element selectors (such as h1, h2, form, label, table, etc), ID selectors (such as #completedTable, #inProgressTable), and Class selectors (such as .container, .table-container, .completed-heading, .inProgress-heading, .pastel-red, edit-btn, etc.) were all used in the CSS.


## Technical Achievements
- **Tech Achievement 1**: The website is a single-page app and provides a form for users to submit data and always shows the current state of the server-side data. When the user creates and submits the task, the server successfully responds and adds the updated data and displays the updated data on the users side.
- **Tech Achievement 2**: The website allows the user to edit and update the fields in tasks (such as task name, description, due date, and priority). Once updated, the days left will be recalculated to reflect the current due date, and again, it will light up red if it is 1 day left or overdue. 

### Design/Evaluation Achievements
**Evaluation**:
During the evaluation a couple specific tasks were asked to be performed with students from the class, without giving them verbal instructions on how to perform it.
The students were tasked with:
1. creating a task named: homework, description: complete assigned homework, date: 9/9/24, priority: urgent
2. editing the created task by changing date to 9/10/24
3. assigning the task as complete
4. deleting the task

<br>

- **Design Achievement 1**:
1. Caproni
2. Overall, faced limited problems during the assigned tasks. Took a bit longer on the editing functionality but did eventually figured out how to use it without assistance. In the end, all the tasks were completed successfully. 
3. Commented that spacing of the website was utilized well. It surprised me because I thought the layout of the website wasn't the best, and I still believe that it can be improved. Additionally, commented that the website was overall easy to navigate, very intuitive, and easy to use. I was glad to hear that as I thought my website would take longer for someone to understand because of the many different features and action buttons. 
4. I would fix the edit functionality by providing a quick popup telling the user that the field is ready to be edited or something, as it took a couple seconds for the student to realize that he was in edit mode. Additionally, to go along with the red highlight on tasks that are almost due, I would add an additional identifier (exclamation mark, or something that tells you that is almost due).

<br>

- **Design Achievement 1**: 
1. Le
2. Overall, there weren't many problems that we ran into. However, he also spent a longer time on the editing functionality compared to the other tasks. Also eventually figured out how to use the it without assistance. In the end, all the tasks were completed successfully. 
3. Commented that highlighting tasks red that were almost due or past due was a good feature and fits well with the design of the website. It surprised me as I thought it needed to have a better indicator and it threw off the clean aesthetic of the website. Additionally, commented that the website looked very nice and had a good UI. This surprised me as I thought the website lacked personality, and was a bit plain and boring. 
4. I would fix the edit functionality by allowing users to edit straight from the table, because as the student stated, it was confusing that it you have to go back to the top to edit it.