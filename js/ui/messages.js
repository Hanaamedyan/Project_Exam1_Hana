/**
 * messages.js
 * User feedback: inline alert boxes and small toast pop-ups.
 */

import { el } from "../utils/dom.js"

const ICONS = { success: "✓", error: "⚠", info: "ℹ" };

/**
 * Shows an alert box inside a container
 * 
 * @param {HTMLElement}
 * @param {object}
 * @param {"success"|"error"|"info"}
 * @param {string}
 * @param {string}
 * @param {HTMLElement}
 */

export function showMessage(container, { type = "info", title, text, action }) {
    if (!container) return;
    const alert = el(
        "div",
        { className: `alert alert--${type}`, role: type === "error" ? "alert" : "status" },
        el("span", { className: "alert__icon", "aria-hidden": "true" }, ICONS[type]),
        el(
        "div",
        { className: "alert__body" },
        el("p", { className: "alert__title" }, title),
        text && el("p", {}, text),
        action
        )
    );
    container.replaceChildren(alert);
    container.hidden = false;
}

/**
 * Removes any message from a container.
 * @param {HTMLElement}
 */

export function clearMessage(container) {
    if (!container) return;
    container.replaceChildren();
    container.hidden = true;
}

/**
 * Shows a short message at the bottom of the screen that dissappears by itself.
 * 
 * @param {string}
 * @param {"success"|"error"|"info"}
 */

export function showToast(text, type = "success") {
    let region = document.getElementById("toast-region");
    if (!region) {
        region = el("div", { id: "toast-region", className: "toast-region", "aria-live": "polite" });
        document.body.append(region);
    }

    const toast = el(
        "div",
        { className: `toast toast--${type}` },
        el("span", {"aria-hidden": "true" }, ICONS[type]),
        el("span", {}, text)
    );
    region.append(toast);

    setTimeout(() => toast.classList.add("is-leaving"), 2600);
    setTimeout(() => toast.remove(), 3000);
}

/**
 * Creates a "try again" button reloades the page.
 * @returns {HTMLButtonElement}
 */

export function retryButton() {
    return el("button", { type: "button", className: "btn btn--secondary btn--small", onClick: () => location.reload() }, "Try again");
}