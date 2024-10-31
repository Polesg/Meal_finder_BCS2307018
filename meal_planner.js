document.addEventListener("DOMContentLoaded", function () {
    const mealContainer = document.getElementById("meal-list");

    // Function to load saved meals from local storage and display in the list
    function loadMeals() {
        let savedMeals = JSON.parse(localStorage.getItem('mealPlanner')) || [];

        // Clear existing content in the container
        mealContainer.innerHTML = '';

        savedMeals.forEach(meal => {
            const mealDiv = document.createElement("div");
            mealDiv.className = "meal-item"; // Add a class for styling if needed

            // Create a container for image and name
            const imageContainer = document.createElement("div");
            imageContainer.className = "image-container"; // Add a class for styling if needed

            // Display meal image
            const mealImage = document.createElement("img");
            mealImage.src = meal.image;
            mealImage.alt = meal.name;
            mealImage.style.width = "100px"; // Set a fixed width for images
            mealImage.style.height = "auto"; // Maintain aspect ratio

            // Display meal name below the image
            const mealName = document.createElement("h3");
            mealName.textContent = meal.name;
            mealName.style.textAlign = "center"; // Center the text under the image

            // Append the image and name to the image container
            imageContainer.appendChild(mealImage);
            imageContainer.appendChild(mealName);

            // Hidden ingredients (not displayed)
            const ingredientsList = document.createElement("ul");
            meal.ingredients.forEach(ingredient => {
                const ingredientItem = document.createElement("li");
                ingredientItem.textContent = ingredient; // Store ingredients but don't display
                ingredientsList.appendChild(ingredientItem);
            });
            ingredientsList.style.display = "none"; // Hide the ingredients list

            // Create a container for notes
            const notesContainer = document.createElement("div");

            // Create a textarea for notes
            const notesTextarea = document.createElement("textarea");
            notesTextarea.placeholder = "Add your notes here...";
            notesTextarea.value = meal.notes || ""; // Load existing notes if any
            notesTextarea.rows = 4; // Set the number of visible rows

            // Create a date input for purchase date
            const purchaseDateInput = document.createElement("input");
            purchaseDateInput.type = "date";
            purchaseDateInput.value = meal.purchaseDate || ""; // Load existing purchase date if any

            // Create a save button for notes, positioned below purchase date
            const saveNotesButton = document.createElement("button");
            saveNotesButton.textContent = "Save Notes & Date";
            saveNotesButton.className = "save-notes-button";
            saveNotesButton.addEventListener("click", function () {
                saveNotesAndDate(meal.name, notesTextarea.value, purchaseDateInput.value); // Save the notes and date
            });

            // Create a remove button
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.className = "remove-button";
            removeButton.addEventListener("click", function () {
                removeMeal(meal); // Pass the entire meal object to remove
            });

            // Create an add to grocery button, positioned above the remove button
            const addToGroceryButton = document.createElement("button");
            addToGroceryButton.textContent = "Add to Grocery";
            addToGroceryButton.className = "add-to-grocery-button";
            addToGroceryButton.addEventListener("click", function () {
                addIngredientsToGrocery(meal.ingredients); // Save the ingredients to grocery
            });

            // Create a display container for saved notes and purchase date
            const displayContainer = document.createElement("div");
            const displayNotes = document.createElement("p");
            const displayPurchaseDate = document.createElement("p");

            displayNotes.textContent = meal.notes ? `Notes: ${meal.notes}` : "No notes provided.";
            displayPurchaseDate.textContent = meal.purchaseDate ? `Date of Purchase: ${meal.purchaseDate}` : "No purchase date provided.";

            // Create an edit button to allow updating notes and date
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-button";
            editButton.style.display = "none"; // Initially hidden

            editButton.addEventListener("click", function () {
                // Show textarea and date input, hide the text display
                notesContainer.style.display = "block";
                displayContainer.style.display = "none";
                editButton.style.display = "none";
            });

            // Append elements to the notesContainer
            notesContainer.appendChild(notesTextarea);
            notesContainer.appendChild(purchaseDateInput);
            notesContainer.appendChild(saveNotesButton); // Save notes button below purchase date
            notesContainer.appendChild(addToGroceryButton); // Append add to grocery button
            notesContainer.appendChild(editButton);

            // Append elements to the mealDiv
            mealDiv.appendChild(imageContainer); // Append image and name container
            mealDiv.appendChild(ingredientsList); // Append ingredients list (hidden)
            mealDiv.appendChild(notesContainer); // Append notes container
            displayContainer.appendChild(displayNotes); // Append notes display
            displayContainer.appendChild(displayPurchaseDate); // Append purchase date display
            mealDiv.appendChild(displayContainer); // Append display container
            mealDiv.appendChild(addToGroceryButton); // Append add to grocery button above remove
            mealDiv.appendChild(removeButton); // Append remove button

            // Append mealDiv to the container
            mealContainer.appendChild(mealDiv);
        });
    }

    // Function to save notes and purchase date for a specific meal
    function saveNotesAndDate(mealName, notes, purchaseDate) {
        let savedMeals = JSON.parse(localStorage.getItem('mealPlanner')) || [];
        const meal = savedMeals.find(meal => meal.name === mealName);
        if (meal) {
            meal.notes = notes; // Update notes for the specified meal
            meal.purchaseDate = purchaseDate; // Update purchase date for the specified meal
            localStorage.setItem('mealPlanner', JSON.stringify(savedMeals)); // Save updated array to local storage
            alert(`Notes and purchase date for ${mealName} have been saved!`);
            loadMeals(); // Reload meals to reflect changes
        }
    }

    // Function to remove a meal from local storage and its ingredients from grocery list
    function removeMeal(meal) {
        let savedMeals = JSON.parse(localStorage.getItem('mealPlanner')) || [];
        savedMeals = savedMeals.filter(m => m.name !== meal.name); // Filter by meal name
        localStorage.setItem('mealPlanner', JSON.stringify(savedMeals));
        removeIngredientsFromGrocery(meal.ingredients); // Remove related ingredients from grocery list
        loadMeals(); // Reload meals to update the displayed list
    }

    // Function to remove ingredients from the grocery list
    function removeIngredientsFromGrocery(ingredients) {
        let groceryList = JSON.parse(localStorage.getItem('groceryList')) || [];
        ingredients.forEach(ingredient => {
            groceryList = groceryList.filter(groceryItem => groceryItem !== ingredient); // Filter out the ingredient
        });
        localStorage.setItem('groceryList', JSON.stringify(groceryList)); // Update local storage
        alert('Ingredients removed from grocery list!'); // Notify the user
    }

    // Function to add ingredients to the grocery list
    function addIngredientsToGrocery(ingredients) {
        let groceryList = JSON.parse(localStorage.getItem('groceryList')) || [];
        ingredients.forEach(ingredient => {
            if (!groceryList.includes(ingredient)) { // Avoid duplicates
                groceryList.push(ingredient);
            }
        });
        localStorage.setItem('groceryList', JSON.stringify(groceryList));
        alert('Ingredients added to grocery list!');
    }

    loadMeals(); // Load meals on page load
});
