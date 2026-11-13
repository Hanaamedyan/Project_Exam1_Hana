/**
 * feed.js - product feed page
 * Fetches all products and shows 12 of them in a responsive thumbnail grid.
 */


import { initHeader } from "../ui/header.js";
import { getProducts } from "../api/products.js";
import { initCarousel } from "../ui/carousel.js";
import { createProductCard } from "../ui/productCard.js";
import { showLoader, hideLoader } from "../ui/loader.js";
import { showMessage, retryButton } from "../ui/messages.js";
import { CAROUSEL_PRODUCT_COUNT, FEED_PRODUCT_COUNT } from "../api/constants.js";

const carouselEl = document.querySelector("[data-carousel]")
const gridEl = document.querySelector("[data-product-grid]");
const messageEl = document.querySelector("[data-feed-message]");

/** Starts the page */
async function init() {
    initHeader();
    showLoader(gridEl, "Loading products...");
    carouselEl.classList.add("is-loading");

    try {
        const products = await getProducts();

        if (!products.length) {
            hideLoader(gridEl);
            carouselEl.hidden = true;
            showMessage(messageEl, { type: "info", title: "No products yet", text: "Please check back soon."});
            return;
        }

        renderCarousel(products);
        renderGrid(products);
    } catch (error) {
        hideLoader(gridEl);
        carouselEl.hidden = true;
        showMessage(messageEl, {
            type: "error",
            title: "We could not load the products",
            text: error.message,
            action: retryButton(),
        });
    }
}

/**
 * Picks the products for the banner: products on sale first
 * then fills up with the rest until there are 3.
 * @param {Array<object>} - products
 */

function renderCarousel(products) {
    const onSale = products.filter((p) => p.discountedPrice < p.price);
    const others = products.filter((p) => !(p.discountedPrice < p.price));
    const featured = [...onSale, ...others].slice(0, CAROUSEL_PRODUCT_COUNT);

    carouselEl.classList.remove("is-loading");
    initCarousel(carouselEl, featured);
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