/**
 * validation.js
 * Form validation rules and helpers for showing/clearing error messages.
 * Rules match the Noroff API so users see problems before the form is sent.
 */

/** Required field. */
export const required = (label) => (value) =>
  value.trim() ? "" : `${label} is required.`;

/** Name for registration: letters, numbers and underscore only. */
export function validateName(value) {
  if (!value.trim()) return "Name is required.";
  if (!/^[\w]+$/.test(value))
    return "Use only letters, numbers and underscore (_). No spaces.";
  return "";
}

/** Email must be a valid stud.noroff.no address. */
export function validateNoroffEmail(value) {
  if (!value.trim()) return "Email is required.";
  if (!/^[\w.+-]+@stud\.noroff\.no$/i.test(value.trim())) {
    return "Email must be a valid @stud.noroff.no address.";
  }
  return "";
}

/** Password must be at least 8 characters. */
export function validatePassword(value) {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  return "";
}

/** General email format (used on the checkout form). */
export function validateEmail(value) {
  if (!value.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()))
    return "Enter a valid email address, e.g. name@example.com.";
  return "";
}

/** Norwegian postcode: 4 digits. */
export function validatePostcode(value) {
  if (!value.trim()) return "Postcode is required.";
  if (!/^\d{4}$/.test(value.trim()))
    return "Postcode must be 4 digits, e.g. 7082.";
  return "";
}

/** Phone: 8 digits, optional +47 and spaces. */
export function validatePhone(value) {
  if (!value.trim()) return "Phone number is required.";
  if (!/^(\+47)?\d{8}$/.test(value.replace(/\s/g, "")))
    return "Enter an 8-digit phone number, e.g. 917 45 654.";
  return "";
}

/** Showing errors. */

/**
 * Shows an error under an input and marks it invalid for screen readers.
 * @param {HTMLInputElement} - input
 * @param {string} - message - empty string clears the error.
 */

export function setFieldError(input, message) {
  const errorEl = document.getElementById(`${input.id}-error`);
  const field = input.closest(".field");

  if (message) {
    input.setAttribute("aria-invalid", "true");
    field?.classList.add("is-invalid");
    field?.classList.remove("is-valid");
  } else {
    input.removeAttribute("aria-invalid");
    field?.classList.remove("is-invalid");
    if (input.value) field?.classList.add("is-valid");
  }
  if (errorEl) errorEl.textContent = message;
}

/**
 * Validates every field that has a rule and shows the messages.
 * Moves focus to the first invalid field so keyboard users find it.
 * @param {HTMLFormElement} - form
 * @param {Record<string, (value: string) => string>} - rules
 * @returns {boolean} - true when form is valid.
 */

export function validateForm(form, rules) {
  let firstInvalid = null;

  for (const [name, rule] of Object.entries(rules)) {
    const input = form.elements[name];
    if (!input) continue;
    const message = rule(input.value);
    setFieldError(input, message);
    if (message && !firstInvalid) firstInvalid = input;
  }

  firstInvalid?.focus();
  return !firstInvalid;
}

/**
 * Adds "live" validation: a field is checked when the users leaves it,
 * and re-checked while typing once it has shown an error.
 * @param {HTMLFormElement} - form
 * @param {Record<string, (value: string) => string>} - rules
 */

export function addLiveValidation(form, rules) {
  for (const [name, rule] of Object.entries(rules)) {
    const input = form.elements[name];
    if (!input) continue;

    input.addEventListener("blur", () => {
      if (input.value) setFieldError(input, rule(input.value));
    });
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true")
        setFieldError(input, rule(input.value));
    });
  }
}
