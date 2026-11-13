/**
 * product.js - specific product page 
 * Shows title, image, description, price/discount, rating, reviews and tags
 */

import { initHeader } from "../ui/header.js";
import { getProduct } from "../api/products.js";
import { createPrice } from "../ui/productCard.js";
import { createRating } from "../ui/rating.js";
import { showLoader, hideLoader } from "../ui/loader.js";
import { showMessage, showToast } from "../ui/messages.js";
import { getParam, pageUrl } from "../utils/url.js";
import { hasDiscount, getDiscountPercent } from "../utils/format.js";
import { el } from "../utils/dom.js";



const productEl = document.querySelector("[data-product]");
const breadcrumbCurrent = document.querySelector("[data-breadcrumb-current]");

/** Starts the page. */
async function init() {
    initHeader();

    const id = getParam("id");
    if (!id) {
        showNotFound("No product was selected.");
        return;
    }

    showLoader(productEl, "Loading product...");

    try {
        const product = await getProduct(id);
        renderProduct(product);
        updatePageMeta(product);
    } catch (error) {
        if (error.status === 404 || error.status === 400) {
            showNotFound("This product does not exist or has been removed.");
        } else {
            hideLoader(productEl);
            showMessage(productEl, { type: "error", title: "We could not load this product", text: error.message });
        }
    }
}

/** Builds the whole product layout
 * @param {object} - product
 */

function renderProduct(product) {
    hideLoader(productEl);

    const media = el(
        "div",
        { className: "product__media" },
        el("img", {
            src: product.image?.url,
            alt: product.image?.alt || product.title,
            width: 640,
            height: 640,
        }),
        hasDiscount(product) && el("span", { className: "badge badge--large"}, `-${getDiscountPercent(product)}%`)
    );

    const info = el(
        "div",
        { className: "product__info" },
        el("h1", { className: "product__title" }, product.title),
        createRating(product.rating, { reviewCount: product.reviews?.length ?? 0 }),
        createPrice(product),
        el("p", { className: "product__description", }, product.description),
        createTags(product.tags),

        el("div", { className: "product__actions", "data-product-section": "" }, createShareButton(product))
    );

    productEl.replaceChildren(
        el("div", { className: "product__layout" }, media, info),
        createReviews(product.reviews)
    );
}

/**
 * Tag chips, e.g. "headphones", "beauty".
 * @param {string[]} - tags
 */

function createTags(tags = []) {
    if (!tags.length) return null;
    return el(
        "ul",
        { className: "tags", "aria-label": "Tags" },
        tags.map((tag) => el("li", { className: "tag" }, tag))
    );
}

/**
 * Share button. Uses the device's share menu when available.
 * Otherwise copies the link to the clipboard.
 * @param {object} - product
 * @returns {HTMLElement}
 */

function createShareButton(product) {
    const shareUrl = window.location.href

    return el(
        "button",
        {
            type: "button",
            className: "btn btn--icon",
            "aria-label": "Share this product",
            title: "Share",
            onClick: async () => {
                try {
                    if (navigator.share) {
                        await navigator.share({ title: product.title, url: shareUrl });
                        showToast("Thanks for sharing!");
                    } else {
                        await navigator.clipboard.writeText(shareUrl);
                        showToast("Link copied to clipboard.");
                    }
                } catch (error) {
                    if (error.name !== "AbortError") {
                        showToast("Could not share. Copy the link from the address bar instead.")
                    }
                }
            },
        },
        shareIcon()
    );
}

/** Share icon as inline SVG.
 * @returns {SVGElement}
 */
function shareIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML =
    '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke_linejoin="round">' +
    '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>' +
    '<path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></g>';
    return svg;
}

/**
 * Reviews section (with empty state when there are none).
 * @param {Array<{ id: string, username: string, rating: number, description: string }>} - reviews
 */

function createReviews(reviews = []) {
    return el(
        "section",
        { className: "reviews", "aria-labelledby": "reviews-heading" },
        el("h2", { id: "reviews-heading" }, `Reviews (${reviews.length})`),
        reviews.length
        ? el(
            "ul",
            { className: "reviews__list" },
            reviews.map((review) => 
            el(
                "li",
                { className: "review" },
                el("p", { className: "review__author" }, review.username),
                createRating(review.rating),
                el("p", { className: "review__text" }, review.description)
            )
          )
        )
        :el("p", {className: "muted" }, "No reviews yet.")
    );
}

/** Updates the browser tab title, meta description and breadcrumb for this product.
 * @param {object} - product
 */

function updatePageMeta(product) {
    document.title = `${product.title} | Hylle`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", product.description);
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.title;
}

/**
 * Friendly "Not found" state with a way back to the shop.
 * @param {string} - text
 */
function showNotFound(text) {
    hideLoader(productEl);
    document.title = "Product not found | Hylle";
    showMessage(productEl, {
        type: "info",
        title: "Product not found",
        text,
        action: el("a", { href: pageUrl("index.html"), className: "btn btn--secondary btn--small" }, "Back to the shop"),
    });
}

init();