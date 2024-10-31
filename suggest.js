document.addEventListener("DOMContentLoaded", () => {
    // Fetch categories and ingredients on page load
    fetchCategories();
    fetchIngredients();
});

// Function to fetch categories
function fetchCategories() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById("category");
            data.meals.forEach(category => {
                const option = document.createElement("option");
                option.value = category.strCategory;
                option.textContent = category.strCategory;
                categorySelect.appendChild(option);
            });
        });
}

// Function to fetch ingredients
function fetchIngredients() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
        .then(response => response.json())
        .then(data => {
            const ingredientSelect = document.getElementById("ingredients");
            data.meals.forEach(ingredient => {
                const option = document.createElement("option");
                option.value = ingredient.strIngredient;
                option.textContent = ingredient.strIngredient;
                ingredientSelect.appendChild(option);
            });
        });
}

function buttonClicked() {
    const category = document.getElementById("category").value;
    const ingredients = document.getElementById("ingredients").value;

    // Clear previous results
    document.getElementById("suggestion").innerHTML = "";

    let categoryMeals = [];
    let ingredientMeals = [];

    // Check if both category and ingredients are selected
    if (!category || !ingredients) {
        document.getElementById("suggestion").innerHTML = "<p>Please select both a category and an ingredient.</p>";
        return; 
    }

    // Fetch meals based on category
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                categoryMeals = data.meals;
                // Fetch meals based on ingredients
                fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.meals) {
                            ingredientMeals = data.meals;
                            const commonMeals = categoryMeals.filter(meal => 
                                ingredientMeals.some(ingredientMeal => ingredientMeal.idMeal === meal.idMeal)
                            );
                            displayMealDetails(commonMeals);
                        } else {
                            document.getElementById("suggestion").innerHTML += "<p>No meals found for this ingredient.</p>";
                        }
                    });
            } else {
                document.getElementById("suggestion").innerHTML = "<p>No meals found for this category.</p>";
            }
        });
}

// Function to display meals in a grid format
function displayMealDetails(meals) {
    if (meals.length === 0) {
        document.getElementById("suggestion").innerHTML = "<p>No meals match the selected category and ingredients.</p>";
        return;
    }

    // Create a container div for the grid layout
    const mealGrid = document.createElement('div');
    mealGrid.style.display = 'grid';
    mealGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    mealGrid.style.gap = '20px';

    meals.forEach(meal => {
        // Create a card for each meal with image, name, and button
        const mealCard = document.createElement('div');
        mealCard.style.border = '1px solid #ccc';
        mealCard.style.borderRadius = '8px';
        mealCard.style.padding = '10px';
        mealCard.style.textAlign = 'center';
        mealCard.style.backgroundColor = '#ffcccb';

        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%; height:auto; border-radius:8px;">
            <p style="margin: 10px 0; font-weight: bold;">${meal.strMeal}</p>
            <button onclick="location.href='details.html?id=${meal.idMeal}'">View Details</button>
        `;

        mealGrid.appendChild(mealCard);
    });

    // Append the grid to the suggestion container
    document.getElementById("suggestion").innerHTML = ""; 
    document.getElementById("suggestion").appendChild(mealGrid);
}
