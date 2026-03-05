const categoriesButtonsContainer = document.getElementById(
  "categories-container",
);
const treesCardContainer = document.getElementById("trees-card-container");
const spinnerContainer = document.getElementById("loadingSpinner");
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

<button data-categoryid='${categoryId}' class="category-btn btn btn-ghost border-none  w-full ">${category_name}</button>

`;
    categoriesButtonsContainer.appendChild(div);
  });
}

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

    // conditional data category fitler

    if (targetButton.innerText.trim() === "All Trees") {
    } else {
      const categoryId = targetButton.dataset.categoryid;

      categoryPlant(Number(categoryId));
    }
  }
});

async function categoryPlant(categoryId) {
  const categoryPlantsData = await fetch(
    `https://openapi.programming-hero.com/api/category/${categoryId}`,
  );
  const convWait = await categoryPlantsData.json();

  const { plants } = convWait;

  renderDataonTheUI(plants);
}

async function getAllPlants() {
  try {
    loadingSpiner(true);
    const getPlantsData = await fetch(
      "https://openapi.programming-hero.com/api/plants",
    );
    const convData = await getPlantsData.json();
    loadingSpiner(false);
    const { plants } = convData;
    renderDataonTheUI(plants);
  } catch (e) {
    console.log("cannot load data");
  }
}

function renderDataonTheUI(getDataContainer) {
  treesCardContainer.innerHTML = "";

  getDataContainer.forEach((card) => {
    const { image, name, description, category, price } = card;
    const plantCard = document.createElement("div");

    plantCard.innerHTML = `

  
            <figure class='overflow-hidden'>
              <img 
                src="${image}"
                alt='${name}'
                class='transition-transform h-52 w-full object-cover hover:scale-[1.2]'
              />
            </figure>
            <div class="card-body p-4">
              <h2 class="card-title">${name}</h2>
              <p class="line-clamp-2">
                ${description}
              </p>
              <div class="flex justify-between ">
                <div class="badge badge-soft badge-success">${category}</div>
                <div><p class="font-semibold">$${price}</p></div>
              </div>
              <div class="card-actions">
                <button class="add-cart-btn btn primary-bg text-white w-full rounded-full">Buy Now</button>
              </div>
            </div>
       

`;

    plantCard.className = "card bg-base-100 shadow-sm";
    treesCardContainer.appendChild(plantCard);
  });
}

// loading spiner

function loadingSpiner(wanna) {
  if (wanna) {
    spinnerContainer.classList.remove("hidden");
    treesCardContainer.classList.add("hidden");
  } else {
    treesCardContainer.classList.remove("hidden");
    spinnerContainer.classList.add("hidden");
  }
}

getAllCategories();
getAllPlants();
