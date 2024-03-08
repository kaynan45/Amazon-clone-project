import { cart, removeFromCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

const today = dayjs();
const deliveryDate = today.add(7, "days");
deliveryDate.format("dddd, MMMM D");

const headerItems = document.querySelector(
  ".js-checkout-header-middle-section"
);

function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  headerItems.innerHTML = `Checkout (${cartQuantity} items)`;
}

updateCartQuantity();

let cartSummaryHtml = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHtml += `
    <div class="cart-item-container js-cart-item-container-${
      matchingProduct.id
    }">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label quantity-label-css">${
                      cartItem.quantity
                    }</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link"
              data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id="${
                    matchingProduct.id
                  }">Save</span>
                  <span class="
                  delete-quantity-link link-primary js-delete-link" data-product-id="${
                    matchingProduct.id
                  }"
                  >Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
               ${deliveryOptionHtml(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
    `;
});

function deliveryOptionHtml(matchingProduct, cartItem) {

  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

      //This is a turnery operator, if the first line is TRUE (deliveryOption.priceCents === 0), the value is whatever is after the "?" mark, if is FALSE the value'll be whatever is after the colon ":". Its pretty much like the if statement, but this one we can save the value in a variable.
      const priceString = deliveryOption.priceCents
       === 0 
       ? 'Free'
       : `$${formatCurrency(deliveryOption.priceCents)} -`;

        const isChecked = deliveryOption.id = cartItem.deliveryOptionId;

    html += `
    <div class="delivery-option">
      <input type="radio"
        ${isChecked ? 'checked' : '' }
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
          ${priceString} Shipping
        </div>
      </div>
    </div>
`;
  });
  return html;
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

document.querySelector(".js-order-summary").innerHTML = cartSummaryHtml;

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.remove();
    updateCartQuantity();
  });
});

document.querySelectorAll(".js-update-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.add("is-editing-quantity");
  });
});

document.querySelectorAll(".js-save-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.remove("is-editing-quantity");
    const inputQuantity = container.querySelector(".js-quantity-input");
    const finalInputValue = (container.querySelector(
      ".js-quantity-label"
    ).innerHTML = parseInt(inputQuantity.value, 10));

    function updateQuantity(productId, newQuantity) {
      let matchingItem;

      cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });

      matchingItem.quantity = newQuantity;

      saveToStorage();
    }
    updateQuantity(productId, finalInputValue);
  });
});

console.log(cart);
