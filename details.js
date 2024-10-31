document.addEventListener("DOMContentLoaded", function () {
    const mealDetailsContainer = document.getElementById("meal-details");

    // Get meal ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const mealID = urlParams.get("id");

    if (mealID) {
        // Fetch meal details by ID
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
            .then(response => response.json())
            .then(data => {
                if (data.meals && data.meals.length > 0) {
                    const meal = data.meals[0];
                    displayMealDetails(meal);
                } else {
                    mealDetailsContainer.innerHTML = "<p>Meal details not found.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching meal details:", error);
                mealDetailsContainer.innerHTML = "<p>Error loading meal details.</p>";
            });
    } else {
        mealDetailsContainer.innerHTML = "<p>No meal ID provided.</p>";
    }

    // Function to display meal details in the container
    function displayMealDetails(meal) {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
            }
        }

        mealDetailsContainer.innerHTML = `
            <div class="meal-header">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-details">
                    <h1>${meal.strMeal}</h1>
                    <p><strong>Category:</strong> ${meal.strCategory}</p>
                    <p><strong>Area:</strong> ${meal.strArea || 'Unknown'}</p>
                    <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>
                    <button class="save-button" id="save-meal">Save to Meal Planner</button>
                </div>
            </div>
            <div class="meal-ingredients">
                <h3>Ingredients:</h3>
                <ul>${ingredients.map(ingredient => `<li>${ingredient}</li>`).join("")}</ul>
            </div>
            <div class="meal-instructions">
                <h3>Instructions:</h3>
                <ol>${meal.strInstructions.split('.').map(step => step.trim()).filter(step => step).map(step => `<li>${step}</li>`).join("")}</ol>
            </div>
        `;

        // Add click event to save button
        document.getElementById("save-meal").addEventListener("click", function () {
            saveMeal(meal); // Pass the entire meal object
        });
    }

    // Function to save the meal name and image to local storage
    function saveMeal(meal) {
        // Create a meal object to store the name, image, and ingredients
        const mealToSave = {
            name: meal.strMeal,
            image: meal.strMealThumb,
            ingredients: [] // Add an ingredients array
        };
        
        // Retrieve ingredients from the meal object
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                mealToSave.ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
            }
        }
    
        // Retrieve existing meals from local storage or initialize an empty array
        let savedMeals = JSON.parse(localStorage.getItem('mealPlanner')) || [];
        
        // Check if the meal is already saved
        const mealExists = savedMeals.some(savedMeal => savedMeal.name === mealToSave.name);
        
        if (!mealExists) {
            savedMeals.push(mealToSave); // Add the new meal object to the array
            localStorage.setItem('mealPlanner', JSON.stringify(savedMeals)); // Save updated array to local storage
            alert(`${mealToSave.name} has been saved to your Meal Planner!`);
        } else {
            alert(`${mealToSave.name} is already in your Meal Planner.`);
        }
    }
});
