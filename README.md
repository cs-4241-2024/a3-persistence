## Company XYZ Employee Database

your glitch (or alternative server) link e.g. https://a3-justin-s-23-production.up.railway.app/

## Goal
The goal of this application was to create a simple employee database containing an ID, name, salary, and registration date for any registered employees. In theory,
this would serve as a simple way of organizing a large number of employees.

## Authentication
I used primarily cookies for login, making it so that each login had their own separate "table" to store data on making the site cleaner. I generally decided on using cookies because I had some experience with using them, and I wasn't keen on trying out OAuth again. Note that there are three accounts made for the convenience of this assignment.
  { username: 'JohnD2020', password: 'tester456' }
  { username: 'Wizard4600', password: 'ShaneZ55' }
  { username: 'XYZ123', password: 'JD2600' }

## Challenges
I had issues initially with MongoDB accepting Users and Logins, not made any easier when implementing the user login via cookies. Thankfully, MongoDB was really the only major hurdle I had for this assignment.

## CSS Framework
I used the Bulma CSS framework as it offers good flexbox utility and provided a clean look to the site. I made no changes to the Bulma framework itself.

## Technical Achievements
- **Lighthouse Grading**: I achieved 100% in Lighthouse for both my login page and main data display page. (Images can be found in the repo)
- **Web hosting**: I used Railway to host my webpage for this assignment. One obvious benefit is that it allowed for free hosting without giving any credit card info,
                   which I found to be particularly noteworthy as I am not a fan of giving companies any financial information. other than that, it functions remarkably similarly to Glitch.
- **List of Express Middleware**: Cookie-parser: Used with req.cookies to help with unique logins
                                  Handlebars: Helped with backend integration with MongoDB


### Design/Evaluation Achievements
- **W3C Accessibility**: I followed the following tips from the W3C Web Accessibility Initiative below
DESIGN TIPS:
Significant contrast: My foreground text is white while the background is typically a dark green, which is sufficient enough contrast to easily read the words.

Don't convey info using only colors: Color is primarily used to direct users' attention to forms or instructions which clearly demonstrate
what is necessary in order to operate the site in the intended way. These instructions are clear and coherent leaving no uncertainty in the user.

Label all form elements: All forms have placeholder text within that show what is required to enter and also have titles that describe what they are.
E.g. "Employee ID" or "ID Registration Year"

Interactive elements are easy to identify: All interactables are in the form of buttons, which are commonly seen as interactive elements, meaning there is
no confusion over whether or not a user can interact with it in some way.

Use spacing to group content: I grouped the form and table together, as an example, to demonstrate their relationship.



DEVELOPMENT TIPS:
Label with all form controls: Each form has a label that shows what its purpose is. (Employee ID, Name, etc.)

Help users avoid/correct mistakes: Instructions given when filling out employee form allows users to avoid mistakenly entering incomplete data.

Reflect reading order in code order: Everything in both pages is organized in a proper top-down format. Things that appear first in the page appear
first in the code as well.



WRITING TIPS:
Unique, informative page titles: "Login" page title clearly demonstrates the purpose of the page.

Headings to provide structure: The two headings on each page convey their purpose, one to login and another as an employee database.

Provide clear instructions: For the form, I specified the necessary number of digits for the employee ID (9) and to enter a first and last name
for an employee.

Clear and consise content: All instructions are kept to a sentence or two in length, with no overly-complex words or acronyms.


- **CRAP Principles**: I followed the four principles of CRAP below
Contrast:
By using dark green and bright red as my primary colors for both webpages, I used their natural contrast to draw the viewer's attention to important
information on the page. I primarily used it as a border around the login and employee forms and the data table, which are the most important parts of
my page. I also used a red background for my header to naturally draw the viewer's attention to the title, which explains what exactly the website is used for.
Finally, I used mostly light text on the dark green background to allow for easy readability on the page. This is especially important as the text not only contains
the necessary instructions for what the user must do to successfully operate the page, but also shows the important data that is stored on this hypothetical employee
form webpage.

Repetition:
As discussed above, I used a border around all important forms on the page. I used these flex-boxes as a way to signal to the user that the information contained is
of great importance to the website. This is heightened by the inherent contrasting colors that were described in the above paragragh. I also made sure to align all text
the same way, which will be discussed in more detail later, to make reading the instructions and data far more efficient for any users who want to quickly parse out the
necessary bits of information. The same core colors, green and red, are also used in both pages not just because of their good contrast, but to show a sense of cohesion
throughout the site. The goal was to demonstrate that both pages were connected before the user started reading any of the text on the screen, thereby allowing the user
to understand the purpose of each screen without necessarily needing to read all of the information presented.

Alignment:
For this page, I aligned all text left-wards, including the header title, to make reading any and all information more efficient. As English speakers read from left to
right, having all web text left-aligned enables a more natural flow of information when viewing my webpage. I also made sure to align the text to be as close to vertically straight as possible. Put more clearly, I created a strong line on the left side of the screen by making sure the text and flex-boxes aligned vertically. This is to create a sense of cohesion and neatness when viewing the page and allows for quick parsing of the information stored on both pages. This is to avoid any
potential confusion when it comes to accessing and creating data.

Proximity:
For my main page, I positioned the form and table away from the header, and had them near each other to signal to any user that the two were related. This
also served to make seeing the data easier, as because of its close proximity to the form, people with smaller screen sizes don't need to scroll down far after submitting data, and those with large screen heights won't need to scroll at all. This helps avoid any unnecessary confusion as users are able to see the top of the table at all times. Similarly to the form and table, I positioned the instruction text near the form so users could see it while glancing at the form. The goal was to create a link between the two in the user's head, and avoid any unneeded errors when filling out the form.
