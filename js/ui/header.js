/**
 * header.js
 * Runs on every page. Updates the header for logged in and logged out users, and keeps the cart count up to date,
 * handles logout and the mobile menu,
 * and sets the year in the footer
 */

import { getUser, isLoggedIn, clearAuth } from "../utils/storage.js";
import { getCartCount } from "../utils/cart.js";
import { pageUrl } from "../utils/url.js";
import { el } from "../utils/dom.js";
import { showToast } from "./messages.js";

/** Sets up the whole header. */
export function initHeader() {
    renderAuthLinks();
    updateCartCount();
    initMobileMenu();
    setFooterYear();

    document.addEventListener("cart:updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
}

/** 
 * Shows log in / register for visitors or
 * fills the placeholder in the header.
 */
function renderAuthLinks() {
    const container = document.querySelector("[data-auth-nav]");
    if (!container) return;
    container.replaceChildren();

    if(isLoggedIn()) {
        const user = getUser();
        container.append(
            el("span", { className: "nav__user" }, `Hi, ${user?.name ?? "there"}`),
            el("button", { type: "button", className: "nav__link nav__button", onClick: logout }, "Log out")
        );
    } else {
        container.append(
            el("a", { href: pageUrl("account/login.html"), className: "nav__link" }, "Log in"),
            el("a", { href: pageUrl("account/register.html"), className: "nav__link" }, "Register")
        );
    }

    const current = window.location.pathname;
    document.querySelectorAll(".nav__link[href]").forEach((link) => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === current || (current.endsWith("/") && linkPath === `${current}index.html`)) {
            link.setAttribute("aria-current", "page");
        }
    });
}

/** Logs out, then reloads the page so everything shows the logged out state. */
function logout() {
    clearAuth();
    showToast("You have been logged out.");
    setTimeout(() => window.location.assign(pageUrl("index.html")), 600);
}

/** Updates the number on the cart icon and its accessible label. */
function updateCartCount() {
    const count = getCartCount();
    const badge = document.querySelector("[data-cart-count]");
    const link = document.querySelector("[data-cart-link]");

    if (badge) {
        badge.textContent = count;
        badge.hidden = count === 0;
    }
    link?.setAttribute("aria-label", `Cart, ${count} ${count === 1 ? "item" : "items"}`);
}

/** opens and closes the nav on small screens. */
function initMobileMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.getElementById(toggle?.getAttribute("aria-controls"));
    if (!toggle || !menu) return;

    const setOpen = (open) => {
        toggle.setAttribute("aria-expanded", String(open));
        menu.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menu.classList.contains("is-open")) {
            setOpen(false);
            toggle.focus();
        }
    });
}

/** Writes the current year into the footer copyright. */
function setFooterYear() {
    const year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
}

