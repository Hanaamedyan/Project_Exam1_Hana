/**
 * login.js
 * validates the form, sends POST, saves the token and sends the user no.
 */

import { initHeader } from "../ui/header.js";
import { loginUser } from "../api/auth.js";
import {
  validateForm,
  addLiveValidation,
  validateNoroffEmail,
  validatePassword,
} from "../utils/validation.js";
import { setButtonLoading } from "../ui/loader.js";
import { showMessage, clearMessage } from "../ui/messages.js";
import { getParam, pageUrl, safeRedirectPath } from "../utils/url.js";
import { isLoggedIn, getUser } from "../utils/storage.js";

const form = document.querySelector("[data-login-form]");
const messageEl = document.querySelector("[data-form-message]");
const submitButton = form.querySelector('[type="submit"]');

/** Validation rules for each input */
const rules = {
  email: validateNoroffEmail,
  password: validatePassword,
};

/** Starts the page. */
function init() {
  initHeader();
  showIncomingMessage();
  addLiveValidation(form, rules);
  form.addEventListener("submit", handleSubmit);
}

/**
 * Shows a message depending on how the user got here:
 * just registered, sent here from a protected page, or already logged in.
 */
function showIncomingMessage() {
  const email = getParam("email");
  if (email) form.elements.email.value = email;

  if (getParam("registered")) {
    showMessage(messageEl, {
      type: "success",
      title: "Your account is ready",
      text: "Log in to start shopping.",
    });
    form.elements.password.focus();
  } else if (getParam("reason") === "login-required") {
    showMessage(messageEl, {
      type: "info",
      title: "Please log in",
      text: "You need to be logged in to use the cart and checkout.",
    });
  } else if (isLoggedIn()) {
    showMessage(messageEl, {
      type: "info",
      title: `You are already logged in as ${getUser()?.name}`,
      text: "Log in again to switch account.",
    });
  }
}

/**
 * Handles the form submit: validate -> send -> save token -> redirect.
 * @param {SubmitEvent} - event
 */
async function handleSubmit(event) {
  event.preventDefault();
  clearMessage(messageEl);

  if (!validateForm(form, rules)) return;

  setButtonLoading(submitButton, true, "Loggin in...");

  try {
    await loginUser({
      email: form.elements.email.value.trim(),
      password: form.elements.password.value,
    });

    showMessage(messageEl, {
      type: "success",
      title: "Logged in",
      text: "Taking you to the shop...",
    });

    const redirect = safeRedirectPath(getParam("redirect")) || "index.html";
    setTimeout(() => window.location.assign(pageUrl(redirect)), 700);
  } catch (error) {
    setButtonLoading(submitButton, false);

    if (error.status === 401) {
      // Format was valid, but the details are wrong: remove the green borders
      form
        .querySelectorAll(".field")
        .forEach((field) => field.classList.remove("is-valid"));
      // Clear the password and focus it, ready for a new try
      form.elements.password.value = "";
      form.elements.password.focus();
    }

    const text =
      error.status === 401
        ? "The email or password is wrong. Please try again."
        : error.message;
    showMessage(messageEl, { type: "error", title: "Could not log in", text });
  }
}

init();
