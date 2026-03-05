const categoriesButtonsContainer = document.getElementById(
  "categories-container",
);
const treesCardContainer = document.getElementById("trees-card-container");
const spinnerContainer = document.getElementById("loadingSpinner");
const userCartContainer = document.getElementById("user-cart-container");
const plantDetailsModal = document.getElementById("plant_details_modal");
const modalDataContainer = document.getElementById("dynamic_modal_data");
const cartTotalCount = document.getElementById("total-count");
let userCart = [];
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
      getAllPlants();
    } else {
      const categoryId = targetButton.dataset.categoryid;

      categoryPlant(Number(categoryId));
    }
  }
});

async function categoryPlant(categoryId) {
  loadingSpiner(true);
  const categoryPlantsData = await fetch(
    `https://openapi.programming-hero.com/api/category/${categoryId}`,
  );
  const convWait = await categoryPlantsData.json();
  loadingSpiner(false);
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
    const { id, image, name, description, category, price } = card;
    const plantCard = document.createElement("div");

    plantCard.innerHTML = `

  
            <figure class='overflow-hidden'>
              <img 
              data-id='${id}'
                src="${image}"
                alt='${name}'
                class='details-show transition-transform h-52 w-full object-cover hover:scale-[1.2] cursor-pointer'
              />
            </figure>
            <div class="card-body p-4">
              <h2  data-id='${id}'class="details-show card-title hover:text-primary cursor-pointer hover:underline">${name}</h2>
              <p class="line-clamp-2">
                ${description}
              </p>
              <div class="flex justify-between ">
                <div class="badge badge-soft badge-success">${category}</div>
                <div><p class="font-semibold">$${price}</p></div>
              </div>
              <div class="card-actions">
                <button data-id='${id}' data-name='${name}' data-price='${price}' class="add-cart-btn btn primary-bg text-white w-full rounded-full">Add to Cart</button>
              </div>
            </div>
       

`;

    plantCard.className = "card bg-base-100 shadow-sm";
    treesCardContainer.appendChild(plantCard);
  });
}

// plant details get

async function plantsDetailsGet(id) {
  const getPlantDetails = await fetch(
    `https://openapi.programming-hero.com/api/plant/${id}`,
  );
  const convertData = await getPlantDetails.json();
  const { plants } = convertData;

  renderModal(plants);
}

// show details on  modal

function renderModal(data) {
  const { image, name, description, category, price } = data;

  modalDataContainer.innerHTML = `
<div><img src='${image}' class='max-h-52 w-full rounded-lg'></div>
<div class=' space-y-2.5'>
      <h2 class="card-title font-bold ">${name}</h2>
              <p class="">
                ${description}
              </p>
         <div class="flex justify-between">
                <div class="badge badge-soft badge-success">${category}</div>
                <div><p class="font-semibold">$${price}</p></div>
              </div>
</div>

`;

  plantDetailsModal.showModal();
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

function renderCart(getData) {
  if (getData.length === 0) {
    userCartContainer.innerHTML = "";
    cartTotalCount.innerText = `$0`;
    const blankCart = document.createElement("div");
    blankCart.innerHTML = `
    
      <div class="py-4 text-center ">
            <h6 class=''>Your cart is empthy <i class="fa-solid  fa-triangle-exclamation" style="color: rgb(0, 0, 0);"></i></h6>    </div>`;
    userCartContainer.appendChild(blankCart);
    return;
  }

  userCartContainer.innerHTML = "";

  getData.forEach((cart) => {
    const { id, name, price, quantity } = cart;

    const cartCard = document.createElement("div");
    cartCard.innerHTML = `

    <div class="p-2 flex justify-between items-center shadow rounded-lg bg-slate-200">
                <div class="space-y-1">
                  <p class="font-semibold text-[#1F2937]">${name}</p>
                  <p>$${price * quantity} x <span>${quantity}</span></p>
                </div>
                <button data-cart-id='${id}' class="delete-cart btn btn-ghost btn-circle">X</button>
              </div>
`;

    userCartContainer.appendChild(cartCard);
  });

  const getTotalPrice = userCart.reduce((x, y) => x + y.price * y.quantity, 0);

  cartTotalCount.innerText = `$${getTotalPrice}`;
}

// user cart container event delegation for cart delete functionality

userCartContainer.addEventListener("click", (e) => {
  const targetBtn = e.target;

  if (targetBtn.classList.contains("delete-cart")) {
    const id = targetBtn.dataset.cartId;

    userCart = userCart.filter((cart) => cart.id !== Number(id));

    renderCart(userCart);
  }
});

// trees card main container event delgeation
treesCardContainer.addEventListener("click", function (event) {
  const targetElement = event.target;

  if (targetElement.classList.contains("details-show")) {
    const dataId = targetElement.dataset.id;
    plantsDetailsGet(Number(dataId));
  } else if (targetElement.classList.contains("add-cart-btn")) {
    const details = targetElement.dataset;
    const { id, name, price } = details;

    // find data same cart alread stored or not

    const findCard = userCart.find((cart) => cart.id === Number(id));

    if (findCard) {
      findCard.quantity += 1;
      renderCart(userCart);

      return;
    }
    const pushData = {
      id: Number(id),
      name,
      price: Number(price),
      quantity: 1,
    };
    userCart.push(pushData);
    renderCart(userCart);
  }
});

getAllCategories();
getAllPlants();
renderCart(userCart);
