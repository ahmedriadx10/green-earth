const categoriesButtonsContainer = document.getElementById(
  "categories-container",
);

async function getAllCategories() {
  const getData = await fetch(
    "https://openapi.programming-hero.com/api/categories",
  );
  const convJSData = await getData.json();
  const { categories } = convJSData;
  renderCategory(categories);
}

function renderCategory(getCategories) {
  getCategories.forEach((x) => {
    const { id: categoryId, category_name } = x;

    const div = document.createElement("div");

    div.innerHTML = `

<button data-categoryId='${categoryId}' class="category-btn btn btn-ghost border-none  w-full ">${category_name}</button>

`;
    categoriesButtonsContainer.appendChild(div);
  });
}

getAllCategories();

// categories button event listener
categoriesButtonsContainer.addEventListener("click", function (event) {
  const targetButton = event.target;

  const allButtons =
    categoriesButtonsContainer.querySelectorAll(".category-btn");

  if (targetButton.classList.contains("category-btn")) {
    allButtons.forEach((button) => {
      button.classList.remove("primary-bg", "text-white");
    });
    targetButton.classList.add("primary-bg", "text-white");
  }
});
