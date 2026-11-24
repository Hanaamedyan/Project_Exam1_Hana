/**
 * checkout.js
 * Only for logged in users.
 */

import { initHeader } from "../ui/header.js";
import { requireLogin } from "../utils/guard.js";
import { getCart, getCartTotal, clearCart } from "../utils/cart.js";
import { formatPrice, getUnitPrice } from "../utils/format.js";
import { getUser, save } from "../utils/storage.js";
import { STORAGE_KEYS } from "../api/constants.js";
import {
  validateForm,
  addLiveValidation,
  required,
  validateEmail,
  validatePostcode,
  validatePhone,
} from "../utils/validation.js";
import { setButtonLoading } from "../ui/loader.js";
import { showMessage, clearMessage } from "../ui/messages.js";
import { pageUrl } from "../utils/url.js";
import { el } from "../utils/dom.js";

const form = document.querySelector("[data-checkout-form]");
const messageEl = document.querySelector("[data-form-message]");
const summaryList = document.querySelector("[data-summary-list]");
const summaryTotal = document.querySelector("[data-summary-total]");
const submitButton = form.querySelector('[type="submit"]');

/** Validation rules for each input. */
const rules = {
  fullName: required("Full name"),
  email: validateEmail,
  phone: validatePhone,
  address: required("Street address"),
  postcode: validatePostcode,
  city: required("City"),
  country: required("Country"),
};

function init() {
  if (!requireLogin()) return;

  if (getCart().length === 0) {
    window.location.replace(pageUrl("cart/index.html"));
    return;
  }

  initHeader();
  prefillUser();
  renderSummary();
  addLiveValidation(form, rules);

  form
    .querySelector("[data-payment]")
    .addEventListener("change", () => validatePayment(false));

  form.addEventListener("submit", handleSubmit);
}

/** Fills in the email we already know from the login. */
function prefillUser() {
  const user = getUser();
  if (user?.email && !form.elements.email.value)
    form.elements.email.value = user.email;
}

/** Order summary in the sidebar. */
function renderSummary() {
  const lines = getCart().map((item) =>
    el(
      "li",
      { className: "summary__line" },
      el("span", {}, `${item.title} × ${item.quantity}`),
      el("span", {}, formatPrice(getUnitPrice(item) * item.quantity)),
    ),
  );
  summaryList.replaceChildren(...lines);
  summaryTotal.textContent = formatPrice(getCartTotal());
}

/**
 * Checks that payment is selected
 * because validateForm works on single inputs.
 * @param {boolean} - focus first option when nothing is selected.
 * @param {boolean}
 */
function validatePayment(moveFocus = true) {
  const fieldset = form.querySelector("[data-payment]");
  const errorEl = document.getElementById("payment-error");
  const selected = form.elements.payment.value;

  fieldset.classList.toggle("is-invalid", !selected);
  errorEl.textContent = selected ? "" : "Choose a payment method.";
  if (!selected && moveFocus)
    form.querySelector('input[name="payment"]').focus();
  return Boolean(selected);
}

/**
 * Handles "Complete purchase": validates the form.
 * @param {SubmitEvent} - event
 */

async function handleSubmit(event) {
  event.preventDefault();
  clearMessage(messageEl);

  const formValid = validateForm(form, rules);
  const paymentValid = validatePayment(formValid);

  if (!formValid || !paymentValid) {
    showMessage(messageEl, {
      type: "error",
      title: "Please check the form",
      text: "Some fields need your attention.",
    });
    return;
  }

  setButtonLoading(submitButton, true, "Placing order...");

  await new Promise((resolve) => setTimeout(resolve, 800));

  saveOrder();
  clearCart();
  window.location.assign(pageUrl("success/index.html"));
}

/**
 * Saves a summary of the order in localStorage so the success page can show it.
 */
function saveOrder() {
  const data = new FormData(form);

  save(STORAGE_KEYS.lastOrder, {
    number: `HY-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString(),
    name: data.get("fullName"),
    email: data.get("email"),
    address: `${data.get("address")}, ${data.get("postcode")} ${data.get("city")}`,
    payment: data.get("payment"),
    items: getCart().map(({ title, quantity }) => ({ title, quantity })),
    total: getCartTotal(),
  });
}

init();
