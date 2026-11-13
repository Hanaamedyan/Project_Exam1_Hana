/**
 * loader.js
 * Loading indicators: a spinner for sections that are fetching data, and a loading state for buttons while a form is being sent.
 */

import { el } from "../utils/dom.js"

/**
 * @param {HTMLElement} - container
 * @param {string} - text "loading"
 */

export function showLoader(container, text = "Loading...") {
    if (!container) return;
    container.setAttribute("aria-busy", "true");
    container.replaceChildren(
        el(
            "div",
            { className: "loader", role: "status" },
            el("span", { className: "loader__spinner", "aria-hidden": "true" }),
            el("span", { className: "loader__text" }, text)
        )
    );
}

/**
 * @param {HTMLElement} - container
 */

export function hideLoader(container) {
    container?.removeAttribute("aria-busy");
    container?.querySelector(".loader")?.remove();
}

/**
 * @param {HTMLButtonElement} - button
 * @param {boolean} - isLoading
 * @param {string} - text = Please wait
 */

export function setButtonLoading(button, isLoading, loadingText = "Please wait...") {
    if (!button) return;

    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        button.replaceChildren(
            el("span", { className: "btn__spinner", "aria-hidden": "true" }),
            loadingText
        );
    } else {
        button.disabled = false;
        button.removeAttribute("aria-busy");
        button.textContent = button.dataset.originalText || button.textContent;
    }
}