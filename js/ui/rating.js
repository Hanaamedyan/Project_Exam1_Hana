/**
 * rating.js
 * Shows a 0-5 rating as stars plus the number.
 * The stars are hidden from screen readers, which hear a text version instead.
 */

import { el } from "../utils/dom.js";

/**
 * @param {number} - rating
 * @param {object} - options
 * @param {number} - shows reviews
 * @returns {HTMLElement}
 */

export function createRating(rating = 0, { reviewCount } = {}) {
    const value = Math.max(0, Math.min(5, Number(rating) || 0));

    if (value === 0) {
        return el("p", { className: "rating rating--empty" }, "No ratings yet");
    }

    const fullStars = Math.floor(value);
    const stars = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
    const label = Number.isInteger(value) ? String(value) : value.toFixed(1);

    return el(
        "p",
        { className: "rating" },
        el("span", { className: "rating__stars", "aria-hidden": "true" }, stars),
        el("span", { className: "rating__value", "aria-hidden": "true" }, label),
        el("span", { className: "visually-hidden" }, `Rated ${label} out of 5`),
        reviewCount !== undefined &&
        el("span", { className: "rating__count" }, `(${reviewCount} ${reviewCount === 1 ? "review" : "reviews"})`)
    );
}
