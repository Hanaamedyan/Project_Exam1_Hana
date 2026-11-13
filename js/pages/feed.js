/**
 * feed.js - product feed page
 * Fetches all products and shows 12 of them in a responsive thumbnail grid.
 */


import { initHeader } from "../ui/header.js";
import { getProducts } from "../api/products.js";
import { createProductCard } from "../ui/productCard.js";
import { showLoader, hideLoader } from "../ui/loader.js";
import { showMessage, retryButton } from "../ui/messages.js";
import { FEED_PRODUCT_COUNT } from "../api/constants.js";

const gridEl = document.querySelector("[data-product-grid]");
const messageEl = document.querySelector("[data-feed-message]");

/** Starts the page */
async function init() {
    initHeader();
    showLoader(gridEl, "Loading products...");

    try {
        const products = await getProducts();

        if (!products.length) {
            hideLoader(gridEl);
            showMessage(messageEl, { type: "info", title: "No products yet", text: "Please check back soon."});
            return;
        }

        renderGrid(products);
    } catch (error) {
        hideLoader(gridEl);
        showMessage(messageEl, {
            type: "error",
            title: "We could not load the products",
            text: error.message,
            action: retryButton(),
        });
    }
}

/**
 * Renders the first 12 products as cards in the grid.
 * @param {Array<object>} - products
 */

function renderGrid(products) {
    const cards = products.slice(0, FEED_PRODUCT_COUNT).map(createProductCard);
    hideLoader(gridEl);
    gridEl.replaceChildren(...cards);
}

init();