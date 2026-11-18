/** 
 * register.js
 * Validates the form, sends POST, then sends the user to the login page.
 */


import { initHeader } from "../ui/header.js";
import { registerUser } from "../api/auth.js";
import {
    validateForm,
    addLiveValidation,
    validateName,
    validateNoroffEmail,
    validatePassword,
} from "../utils/validation.js";
import { setButtonLoading } from "../ui/loader.js";
import { showMessage, clearMessage } from "../ui/messages.js";
import { pageUrl } from "../utils/url.js";

const form = document.querySelector("[data-register-form]");
const messageEl = document.querySelector("[data-form-message]");
const submitButton = form.querySelector('[type="submit"]');

/** Validation rules for each input (by name attribute). */
const rules = {
    name: validateName,
    email: validateNoroffEmail,
    password: validatePassword,
    confirmPassword: (value) => {
        if (!value) return "Please repeat your password.";
        return value === form.elements.password.value ? "" : "The passwords do not match.";
    },
};

/** Starts the page. */
function init() {
    initHeader();
    addLiveValidation(form, rules);
    initPasswordToggle();
    form.addEventListener("submit", handleSubmit);
}

/** "Show password" checkbox */
function initPasswordToggle() {
    const toggle = form.querySelector("[data-show-password]");
    toggle?.addEventListener("change", () => {
        const type = toggle.checked ? "text" : "password";
        form.elements.password.type = type;
        form.elements.confirmPassword.type = type;
    });
}

/**
 * Handles the form submit: validate -> send -> redirect to login with the email filled in.
 * @param {SubmitEvent} - event
 */
async function handleSubmit(event) {
    event.preventDefault();
    clearMessage(messageEl);

    if (!validateForm(form, rules)) return;

    setButtonLoading(submitButton, true, "Creating account...");

    const email = form.elements.email.value.trim();

    try {
        await registerUser({
            name: form.elements.name.value.trim(),
            email,
            password: form.elements.password.value,
        });

        showMessage(messageEl, { type: "success", title: "Account created", text: "Taking you to the login page..." });

        setTimeout(
            () => window.location.assign(pageUrl(`account/login.html?registered=1&email=${encodeURIComponent(email)}`)),
            900
        );
    }   catch (error) {
        setButtonLoading(submitButton, false);
        showMessage(messageEl, { type: "error", title: "Could not create your account", text: error.message });
    }
}

init();
