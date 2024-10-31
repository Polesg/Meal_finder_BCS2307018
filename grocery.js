document.addEventListener("DOMContentLoaded", function () {
    const groceryListContainer = document.getElementById("grocery-list");
    const removeAllButton = document.getElementById("remove-all-button");

    // Function to load grocery items from local storage and display in the list
    function loadGroceryList() {
        let groceryList = JSON.parse(localStorage.getItem('groceryList')) || [];
        let savedMeals = JSON.parse(localStorage.getItem('mealPlanner')) || [];

        // Clear existing content in the container
        groceryListContainer.innerHTML = '';

        // Check if there are grocery items
        if (groceryList.length === 0) {
            groceryListContainer.textContent = "No items in the grocery list.";
            return;
        }

        // Create a list for grocery items
        const groceryListUl = document.createElement("ul");
        groceryList.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = item; // Set the text for the list item

            // Find meals that include this ingredient
            const relatedMeals = savedMeals.filter(meal => meal.ingredients.includes(item));

            // Create a display for meal details
            if (relatedMeals.length > 0) {
                const mealDetails = document.createElement("div");
                relatedMeals.forEach(meal => {
                    // Create a paragraph for the meal name
                    const mealName = document.createElement("p");
                    mealName.textContent = `Meal: ${meal.name}`;
                    
                    // Create a paragraph for the meal notes
                    const mealNotes = document.createElement("p");
                    mealNotes.textContent = `Notes: ${meal.notes || "No notes"}`;
                    
                    // Create a paragraph for the purchase date
                    const mealDate = document.createElement("p");
                    mealDate.textContent = `Purchase Date: ${meal.purchaseDate || "No date"}`;

                    // Append the paragraphs to the meal details div
                    mealDetails.appendChild(mealName);
                    mealDetails.appendChild(mealNotes);
                    mealDetails.appendChild(mealDate);
                });
                listItem.appendChild(mealDetails); // Append meal details to the list item
            }

            // Create a span for the "X" button
            const removeItemSpan = document.createElement("span");
            removeItemSpan.textContent = " ❌"; // Add "X" character
            removeItemSpan.className = "remove-item"; // Class for styling
            removeItemSpan.style.cursor = "pointer"; // Change cursor to pointer
            removeItemSpan.addEventListener("click", function () {
                removeItem(item); // Remove specific item on click
            });

            listItem.appendChild(removeItemSpan); // Append the "X" to the list item
            groceryListUl.appendChild(listItem); // Append the list item to the grocery list
        });

        groceryListContainer.appendChild(groceryListUl); // Append the list to the container
    }

    // Function to remove a specific item from the grocery list
    function removeItem(item) {
        let groceryList = JSON.parse(localStorage.getItem('groceryList')) || [];
        groceryList = groceryList.filter(groceryItem => groceryItem !== item); // Filter out the item to be removed
        localStorage.setItem('groceryList', JSON.stringify(groceryList)); // Update local storage
        loadGroceryList(); // Reload the list to reflect changes
    }

    // Function to remove all items from the grocery list
    function removeAllItems() {
        localStorage.removeItem('groceryList'); // Clear grocery list in local storage
        loadGroceryList(); // Reload the list
    }

    // Attach event listener to the remove all button
    removeAllButton.addEventListener("click", removeAllItems);

    loadGroceryList(); // Load grocery list on page load
});
