## Grocery List

This is an app to keep track of things you need to buy at the grocery store. You can add items, their prices, and how much you need. You can also edit and delete items. The app will also calculate the total cost of your shopping list.

### CSS

The app uses flexbox to position the elements on the page. I used flex-row to align the table and the submission form horizontally.

### Adding

To add an item, fill in the fields on the right and click the submit button. The item will be added to the table instantly.

### Editing

To edit an item, click on the element in the table and start making your changes. If you want it to save, click outside of the input field you're editing.

### Deleting

To delete an item, click on the delete button in the table and confirm.

## Technical Achievements

-   **Create a single-page app**: I created a single-page app that revalidates the data on every page load and every change to the data.
-   **Editing existing data**: I used the `contentEditable` property to make the data editable, and an `onblur` event listener to validate the input and update the data.

### Design/Evaluation Achievements

-   **Think-Alouds**: I conducted 2 think-alouds to get feedback on the design.

**__Student 1__**
1. **Last Name:** John
2. **Problems:** When you add a new item, you can make the quantity and price negative, which should not be allowed. Editing an item can be confusing, so the student thought that the way to edit an item was to re-enter it in the submission form, with updated values, then delete the old item.
3. **Comments:** Not many comments more than the above.
4. **Changes:** I would fix the bug listed in "problems," but I would make it clearer that editing an item is possible, and find a way to explain how.

**__Student 2__**
1. **Last Name:** Stump
2. **Problems:** When you add a new item but update the quantitiy or price of it, the grand total doesn't update. Additionally, the student wasn't sure how to edit the item. It wasn't made clear that editing was even possible until you click on the table.
3. **Comments:** On top of the problems listed above, the student wanted a clearer indicatgion of what the submission box on the right was. Even though the "submit" button was clear, they wanted a title or a note or something.
4. **Changes:** I would fix the bugs listed in "problems," and I would add a title above the submission form that says "Add Item" or something similar.