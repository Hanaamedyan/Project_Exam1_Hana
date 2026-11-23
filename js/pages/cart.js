/**
 * cart.js
 * Only for logged in users.
 */

import { initHeader } from "../ui/header.js";
import { requireLogin } from "../utils/guard.js";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
  getCartCount,
  MAX_QUANTITY,
} from "../utils/cart.js";
import { formatPrice, getUnitPrice, hasDiscount } from "../utils/format.js";
import { productUrl } from "../ui/productCard.js";
import { showToast } from "../ui/messages.js";
import { pageUrl } from "../utils/url.js";
import { el } from "../utils/dom.js";

const listEl = document.querySelector("[data-cart-list]");
const emptyEl = document.querySelector("[data-cart-empty]");
const contentEl = document.querySelector("[data-cart-content]");
const totalEl = document.querySelector("[data-cart-total]");
const countEl = document.querySelector("[data-cart-items]");
const clearButton = document.querySelector("[data-clear-cart]");
const checkoutLink = document.querySelector("[data-checkout]");

/** Starts the page. */
function init() {
  if (!requireLogin()) return;
  initHeader();

  render();

  listEl.addEventListener("click", handleListClick);
  listEl.addEventListener("change", handleQuantityInput);
  clearButton.addEventListener("click", handleClear);
  checkoutLink.href = pageUrl("checkout/index.html");
}

function render() {
  const cart = getCart();
  const isEmpty = cart.length === 0;

  emptyEl.hidden = !isEmpty;
  contentEl.hidden = isEmpty;
  if (isEmpty) return;

  listEl.replaceChildren(...cart.map(createCartLine));
  renderSummary();
}

function renderSummary() {
  const count = getCartCount();
  countEl.textContent = `${count} ${count === 1 ? "item" : "items"}`;
  totalEl.textContent = formatPrice(getCartTotal());
}

/**
 * One row in the cart: image, title, unit price, quantity stepper, line total, remove.
 * @param {object} - item
 * @returns {HTMLLIElement}
 */

function createCartLine(item) {
  const unitPrice = getUnitPrice(item);
  const inputId = `qty-${item.id}`;

  return el(
    "li",
    { className: "cart-line", dataset: { id: item.id } },
    el("img", {
      className: "cart-line__image",
      src: item.image?.url,
      alt: "",
      width: 96,
      height: 96,
      loading: "lazy",
    }),
    el(
      "div",
      { className: "cart-line__info" },
      el(
        "h2",
        { className: "cart-line__title" },
        el("a", { href: productUrl(item.id) }, item.title),
      ),
      el(
        "p",
        { className: "cart-line__unit" },
        `${formatPrice(unitPrice)} each`,
        hasDiscount(item) &&
          el("span", { className: "cart-line__sale" }, " · on sale"),
      ),
    ),

    el(
      "div",
      { className: "stepper" },
      el(
        "label",
        { htmlFor: inputId, className: "visually-hidden" },
        `Quantity of ${item.title}`,
      ),
      el(
        "button",
        {
          type: "button",
          className: "stepper__btn",
          dataset: { action: "decrease" },
          "aria-label": `Decrease quantity of ${item.title}`,
        },
        "−",
      ),
      el("input", {
        id: inputId,
        className: "stepper__input",
        type: "number",
        inputMode: "numeric",
        min: 1,
        max: MAX_QUANTITY,
        value: item.quantity,
        dataset: { action: "quantity" },
      }),
      el(
        "button",
        {
          type: "button",
          className: "stepper__btn",
          dataset: { action: "increase" },
          "aria-label": `Increase quantity of ${item.title}`,
        },
        "+",
      ),
    ),
    el(
      "div",
      { className: "cart-line__end" },
      el(
        "p",
        { className: "cart-line__total" },
        formatPrice(unitPrice * item.quantity),
      ),
      el(
        "button",
        {
          type: "button",
          className: "link-button link-button--danger",
          dataset: { action: "remove" },
        },
        "Remove",
        el("span", { className: "visually-hidden" }, ` ${item.title}`),
      ),
    ),
  );
}

/**
 * Handles + / - / Remove clicks in the list.
 * @param {MouseEvent} - event
 */
function handleListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const line = button.closest(".cart-line");
  const id = line.dataset.id;
  const item = getCart().find((i) => i.id === id);
  if (!item) return;

  const action = button.dataset.action;
  if (action === "increase") updateQuantity(id, item.quantity + 1);
  if (action === "decrease") updateQuantity(id, item.quantity - 1);
  if (action === "remove") {
    removeFromCart(id);
    showToast(`${item.title} was removed.`, "info");
  }

  render();
  listEl
    .querySelector(`[data-id="${CSS.escape(id)}"] [data-action="${action}"]`)
    ?.focus();
}

/**
 * Handles typing a quantity directly in the number input.
 * @param {Event} - event
 */
function handleQuantityInput(event) {
  const input = event.target.closest('input[data-action="quantity"]');
  if (!input) return;

  const id = input.closest(".cart-line").dataset.id;
  const value = Math.floor(Number(input.value));
  updateQuantity(id, Number.isFinite(value) ? value : 1);
  render();
}

/** Empties the cart after the user confirms. */
function handleClear() {
  if (!window.confirm("Remove all items from your cart?")) return;
  clearCart();
  render();
  showToast("Your cart is now empty.", "info");
}

init();
