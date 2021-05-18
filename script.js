"use strict";
import "./styles.scss";

//ENDPOINTS

//Terms and conditions
let termsAndConditionsData;
let termsAndConditionsEndpoint =
  "https://cecilieslemming.nu/kea/4sem_eksamen_silfen/wordpress/wp-json/wp/v2/pages/49";

//Privacy policy
let privacyPolicyData;
let privacyPolicyEndpoint =
  "https://cecilieslemming.nu/kea/4sem_eksamen_silfen/wordpress/wp-json/wp/v2/pages/51";

//Webshop - products
let productsData = [];
const productsEndpoint =
  "https://cecilieslemming.nu/kea/4sem_eksamen_silfen/wordpress/wp-json/wp/v2/product?per_page=100";
let productsTemplate = document.querySelector("#products_template");
const container = document.querySelector("#products");

//Webshop - single view
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
// console.log("id", id);
const productSingleViewEndpoint =
  "https://cecilieslemming.nu/kea/4sem_eksamen_silfen/wordpress/wp-json/wp/v2/product?per_page=100";
let productSingleViewData = [];
let productSingleView = document.querySelector("#singleProduct");
//Webshop single view - all pictures
let allProductImages;
let allProductImagesEndpoint =
  "https://cecilieslemming.nu/kea/4sem_eksamen_silfen/wordpress/wp-json/wp/v2/product/" +
  id;

const allColors = [
  {
    color: "black",
    hex: "#000000",
  },
  {
    color: "lightblue",
    hex: "#B9D4E5",
  },
  {
    color: "pink",
    hex: "pink",
  },
  {
    color: "silver",
    hex: "#C0C0C0",
  },
  {
    color: "yellow",
    hex: "#EEEC88",
  },
  {
    color: "green",
    hex: "#9BAE86",
  },
];
console.log("allColors", allColors);

//The prototype for all bags
const cartItem = {
  name: "",
  color: "",
  tag: "",
  price: "",
  image: "",
  inCart: 0,
};

//The prototype for wishlist item
const wishlistItem = {
  name: "",
  color: "",
  tag: "",
  price: "",
  image: "",
  remove_button: "",
  inStock: "",
};

let findTheColorsArray = [];
let colorboxes = [];
let number = 0;
let itemName;

document.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("script start");
  displayCart();
  displayWishlist();
  onLoadCartNumbers();
  checkWishlistOnReload();
  getProductsData();
  getSingleProductData();

  // createWishlistObject();

  // getTermsAndConditionsData();
  // getPrivacyData();
}

//ASYNC FUNCTIONS

async function getProductsData() {
  const productsResponse = await fetch(productsEndpoint);
  productsData = await productsResponse.json();
  console.log("productsData", productsData);
  showProducts();
}

async function getTermsAndConditionsData() {
  const termsAndConditionsResponse = await fetch(termsAndConditionsEndpoint);
  termsAndConditionsData = await termsAndConditionsResponse.json();
  showTermsAndConditionsPage();
}

async function getPrivacyData() {
  const privacyPolicyResponse = await fetch(privacyPolicyEndpoint);
  privacyPolicyData = await privacyPolicyResponse.json();
  showPrivacyPage();
}

async function getSingleProductData() {
  //product single view data
  const singleProductResponse = await fetch(productSingleViewEndpoint);
  productSingleViewData = await singleProductResponse.json();
  console.log("productSingleViewData", productSingleViewData);

  //All product images
  const allProductImagesResponse = await fetch(allProductImagesEndpoint);
  allProductImages = await allProductImagesResponse.json();
  // console.log("allProductImages", allProductImages);

  showSingleProduct();
}

//LOADING DATA TO DOM

//Terms and conditions
function showTermsAndConditionsPage() {
  console.log("showTermsAndConditions");
  document.querySelector("#terms_and_conditions").innerHTML =
    termsAndConditionsData.content.rendered;
}

//Privacy Policy
function showPrivacyPage() {
  console.log("showPrivacyPage");

  document.querySelector("#privacy_policy").innerHTML =
    privacyPolicyData.content.rendered;
}

//Webshop - all products
function showProducts() {
  console.log("showProducts");
  container.innerHTML = "";
  productsData.forEach((product) => {
    const clone = productsTemplate.cloneNode(true).content;
    clone.querySelector(".product_image").src = product.product_image.guid;
    clone.querySelector(".product_name").innerHTML = product.product_name;
    clone.querySelector(".product_price").innerHTML =
      product.product_price + " DKK";
    clone
      .querySelector(".product_image_container")
      .addEventListener("click", () => {
        location.href = "product_singelView.html?id=" + product.id;
      });
    clone
      .querySelector(".product_heart_container")
      .addEventListener("click", function () {
        console.log("heart click");
        console.log("this", this);
        this.classList.add("active");
        const wishlistBag = Object.create(wishlistItem);
        wishlistBag.name = product.product_name;
        wishlistBag.color = product.product_color;
        wishlistBag.tag = product.product_name + "_" + wishlistBag.color;
        wishlistBag.price = product.product_price;
        wishlistBag.image = product.product_image.guid;
        wishlistBag.inStock = "In Stock";
        wishlistBag.remove_button = "static/ui-elements/delete.svg";
        if (this.classList.contains("active")) {
          removeFromWishlist();
          this.classList.remove("active");
        } else {
          numberOfWishListItems(wishlistBag);
          this.classList.add("active");
        }

        console.log("wishlistBagObject", wishlistBag);
      });

    container.appendChild(clone);
  });
}

//Webshop - single view
function showSingleProduct() {
  console.log("showSingleProduct");

  let singleBagColors;
  const underscore = "_";
  let bagColor;
  let productImagesArray = allProductImages.product_images;
  console.log("productImagesArray", productImagesArray);

  //Henter data fra WP
  productSingleViewData.forEach((product) => {
    if (product.id == id) {
      console.log("if");
      productSingleView.querySelector(".product_name").innerHTML =
        product.product_name;
      productSingleView.querySelector(".product_price").innerHTML =
        product.product_price + " DKK";
      productSingleView.querySelector(".product_color").innerHTML =
        product.product_color;

      productSingleView.querySelector(".product_description").innerHTML =
        product.product_description;

      //Eventlisteners på add & subtract knapper. Opdaterer antal.
      // document.querySelector(".add_button").addEventListener("click", () => {
      //   console.log("add");
      //   number++;
      //   console.log(number);
      //   productSingleView.querySelector(".number").innerHTML = number;
      // });
      // document.querySelector(".subtract_button").addEventListener("click", () => {
      //   console.log("subtract");
      //   if (number > 0) {
      //     number--;
      //     console.log(number);
      //     productSingleView.querySelector(".number").innerHTML = number;
      //   }
      // });

      //Creating object for cart
      document
        .querySelector(".add_to_cart_button")
        .addEventListener("click", () => {
          console.log("addToCartButtonClick");
          const bag = Object.create(cartItem);
          bag.name = product.product_name;
          bag.price = product.product_price;
          bag.color = document.querySelector(".product_color").innerHTML;
          bag.tag = itemName + "_" + bag.color;
          bag.inCart = 0;
          bag.image = itemName + "_" + bag.color + "_1.jpeg";
          cartNumbers(bag); //RENAME
          totalCost(bag);

          console.log("bag.image", bag.image);
        });

      //Finder hvilke farver tasken findes i
      singleBagColors = product.products_colors;
      console.log("singleBagColors", singleBagColors);
    }
  });
  //De billeder som skal vises til at starte med, har fået property default ind i wordpress. Dem viser vi når man kommer ind på single viewet.
  productImagesArray.forEach((image) => {
    const clone = document.querySelector("template").cloneNode(true).content;
    if (image.post_excerpt === "default") {
      clone.querySelector(".imgs").src = image.guid;
      document
        .querySelector(".all_product_images_container")
        .appendChild(clone);
    }
  });

  //------------------------------- FINDE HVILKEN FARVE AF TASKE ALLE PRODUKTBILLEDER HAR ------------------------------- //

  //Alle billeder hedder navne med samme format: navnPåTaske_farve_nummer. Her looper vi så igennem alle billederne, og splitter navn strengen op, og finder farven. Derefter laver vi en variablen bagColor som indeholder taskens farve. Der efter tilføjer vi property'en color til hver taske og sætter bagColor variablen ind.
  for (let i = 0; i < productImagesArray.length; i++) {
    //Index of first underscore
    let indexOfFirstUnderscore =
      productImagesArray[i].post_title.indexOf(underscore);
    //Index of second underscore
    let indexOfLastUnderscore =
      productImagesArray[i].post_title.lastIndexOf(underscore);
    //Få fat i farven på tasken
    bagColor = productImagesArray[i].post_title.substring(
      indexOfFirstUnderscore + 1,
      indexOfLastUnderscore
    );
    console.log("bagColor", bagColor);
    //Tilføj property og ligge taskens farve på.
    productImagesArray[i].color = bagColor;

    itemName = productImagesArray[i].post_title.substring(
      0,
      indexOfFirstUnderscore
    );
  }

  console.log("bagColor", bagColor);
  console.log("productImagesArray", productImagesArray);
  console.log("productSingelViewData", productSingleViewData);
  console.log("itemName", itemName);

  //------------------------------- FIND ALLE DE FORSKELLIGE FARVER TASKEN FINDES I && LA COLORBOXES ------------------------------- //

  //Ind i WP backenden er der et felt hvor kunden skal skrive alle farver som tasken findes i. Her henter vi den string ind og splitter den op.

  //Splitting string up
  let bagColorArray = singleBagColors.split(",");

  //Ændrer variables to lowercase
  bagColorArray = bagColorArray.map((e) => e.toLowerCase());

  //Fjerner mellemrum
  bagColorArray = bagColorArray.map((e) => e.trim());

  console.log("bagColorArray", bagColorArray);

  //Her filtrerer vi igennem allColors array og den enkelte taskes farver, og ligger de farver der matcher ind i findColorsArray. Derefter laver vi farvebokse ud fra hvor mange farver der findes i findColorsArray og loader dem ind i DOM'en.

  allColors.forEach((color) => {
    bagColorArray.forEach((bagcolor) => {
      if (color.color === bagcolor) {
        findTheColorsArray.push(color);

        const colorbox = document.createElement("div");
        colorbox.classList.add("colorbox");
        // const currentDiv = document.getElementsByClassName("currentDiv");
        document.querySelector(".color_picker").insertBefore(colorbox, null);
        colorboxes.push(colorbox);
      }
    });
  });

  console.log("findTheColorsArray", findTheColorsArray);

  //Her giver vi farveboksene de rigtige farver, og giver dem en property med den farve som de er.
  for (let i = 0; i < colorboxes.length; i++) {
    for (let j = 0; j < findTheColorsArray.length; j++) {
      colorboxes[j].style.backgroundColor = findTheColorsArray[j].hex;
      colorboxes[j].color = findTheColorsArray[j].color;
    }
  }

  console.log("colorboxes", colorboxes);

  //Tilføjer eventlisteners til farvebokse
  //Her siger vi hvilke produktbilleder skal vises, ved klik på de forskellige farvebokse.

  colorboxes.forEach((colorbox) => {
    colorbox.addEventListener("click", () => {
      console.log("colorbox click");
      document.querySelectorAll(".imgs").forEach((img) => {
        img.classList.add("hide");
      });
      productImagesArray.forEach((image) => {
        const clone = document
          .querySelector("template")
          .cloneNode(true).content;
        if (colorbox.color === image.color) {
          clone.querySelector(".imgs").src = image.guid;

          productSingleView.querySelector(".product_color").innerHTML =
            image.color;
          document
            .querySelector(".all_product_images_container")
            .appendChild(clone);
        }
      });
    });
  });
}

//CART

//How many items there are in the cart //RENAME: numberOfCartItems
function cartNumbers(bag) {
  console.log("cartNumbers");
  console.log("the product", bag);
  //RENAME: cartItemCounter;
  let productNumbers = localStorage.getItem("cartNumbers");

  //Converting from string to number
  productNumbers = parseInt(productNumbers);

  if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cart_link span").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart_link span").textContent = 1;
  }

  setItems(bag);
}

function setItems(bag) {
  console.log("setItems");
  console.log("My product is ", bag);

  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  console.log("my products are:", cartItems);
  console.log(cartItems);
  if (cartItems !== null) {
    if (cartItems[bag.tag] == undefined) {
      cartItems = {
        ...cartItems,
        [bag.tag]: bag,
      };
    }
    cartItems[bag.tag].inCart += 1;
  } else {
    bag.inCart = 1;
    cartItems = {
      [bag.tag]: bag,
    };
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}
//Checking if there are any products in the cart on reload //RENAME: checkLocalStorageOnReload
function onLoadCartNumbers() {
  console.log("onLoadCartNumbers");

  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart_link span").textContent = productNumbers;
  }

  let wishlistItemCounter = localStorage.getItem("numberOfWishlistItems");
  if (wishlistItemCounter) {
    document.querySelector(".wishlist_icon span").textContent =
      wishlistItemCounter;
  }
}

function checkWishlistOnReload() {
  console.log("checkWishlistOnReload");
  // let wishlistItemCounter = localStorage.getItem("numberOfWishlistItems");
  // if (wishlistItemCounter) {
  //   document.querySelector(".wishlist_icon span").textContent = wishlistItemCounter;
  // }
}

function totalCost(bag) {
  // console.log("The product price is:", bag.price);
  let cartCost = localStorage.getItem("totalCost");

  // console.log("My cartCost is", cartCost);
  console.log("product price is", bag.price);
  let price = parseInt(bag.price);

  console.log("typeof");
  console.log(typeof price);
  if (cartCost != null) {
    cartCost = parseInt(cartCost);
    console.log(typeof cartCost);
    localStorage.setItem("totalCost", cartCost + price);
  } else {
    localStorage.setItem("totalCost", price);
  }
}

function displayCart() {
  console.log("displayCart");
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector(".products");
  console.log(cartItems);
  if (cartItems && productContainer) {
    console.log("running");
    productContainer.innerHTML = "";
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `
            <div class="product">
            <div class="close_button"></div>
            <span>${item.name}</span>
            <span>${item.price} DKK</span>
            <span>${item.inCart}</span>
            <span>${item.color}</span>
            <img src="static/bags/${item.image}">
           </div>

            `;
    });
  }
}

function numberOfWishListItems(wishlistBag) {
  console.log("numberOfWishListItems");
  console.log("the wishlistproduct", wishlistItem);
  // //RENAME: cartItemCounter;
  let wishlistItemCounter = localStorage.getItem("numberOfWishlistItems");
  let wishlistItems = localStorage.getItem("productsInWishlist");

  //Converting from string to number
  wishlistItemCounter = parseInt(wishlistItemCounter);

  if (wishlistItemCounter) {
    localStorage.setItem("numberOfWishlistItems", wishlistItemCounter + 1);
    document.querySelector(".wishlist_icon span").textContent =
      wishlistItemCounter + 1;
  } else {
    localStorage.setItem("numberOfWishlistItems", 1);
    document.querySelector(".wishlist_icon span").textContent = 1;
  }

  setWishlistItems(wishlistBag);
}

function setWishlistItems(wishlistBag) {
  console.log("setWishlistItems");

  console.log("My product is ", wishlistBag);

  let wishlistItems = localStorage.getItem("productsInWishlist");
  wishlistItems = JSON.parse(wishlistItems);
  console.log("my products are:", wishlistItems);

  if (wishlistItems !== null) {
    if (wishlistItems[wishlistBag.tag] == undefined) {
      wishlistItems = {
        ...wishlistItems,
        [wishlistBag.tag]: wishlistBag,
      };
    }
    // wishlistItems[wishlistBag.name].inCart += 1;
  } else {
    // wishbag.inCart = 1;
    wishlistItems = {
      [wishlistBag.tag]: wishlistBag,
    };
  }

  localStorage.setItem("productsInWishlist", JSON.stringify(wishlistItems));
}

function displayWishlist() {
  console.log("displayWishlist");
  let wishlistItems = localStorage.getItem("productsInWishlist");
  wishlistItems = JSON.parse(wishlistItems);
  let wishlistProductContainer = document.querySelector(".wishlist_products");
  console.log(wishlistItems);
  if (wishlistItems && wishlistProductContainer) {
    console.log("running");
    wishlistProductContainer.innerHTML = "";
    Object.values(wishlistItems).map((item) => {
      wishlistProductContainer.innerHTML += `
            <div class="wishlist_product">
            <div class="removeFromWishlist_button">
            
            </div>
            <ion-icon name="trash-outline"></ion-icon>
            <img src="${item.image}">
            <p>${item.name}</p>
            <p>${item.color}</p>
            <p>${item.price} DKK</p>
            <p>${item.inStock}</p>
            <button class="add_to_cart_button">Add To Cart</button>
            
           </div>

            `;
    });
  }
}

function removeFromWishlist() {
  console.log("removeFromWishlist");
}
