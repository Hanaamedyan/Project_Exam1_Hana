/**
 * productCard.js
 * Builds the product thumbnail cards used in the feed, and the price block that is shared with the product page and carousel.
 */

import { el } from "../utils/dom.js"
import { pageUrl } from "../utils/url.js"
import { formatPrice, hasDiscount, getDiscountPercent } from "../utils/format.js"
import { createRating } from "./rating.js"

/**
 * @param {object} - product
 * @returns {HTMLElement}
 */

export function createPrice(product) {
    if (!hasDiscount(product)) {
        return el("p", {className: "price" }, el("span", { className: "price__now" }, formatPrice(product.price)));
    }
    return el(
        "p",
        { className: "price" },
        el("span", { className: "visually-hidden" }, "Sale price: "),
        el("span", { className: "price__now price__now-sale "}, formatPrice(product.discountedPrice)),
        el("span", { className: "visually-hidden" }, "Original price: "),
        el("s", { className: "price__was" }, formatPrice(product.price))
    );
}

/**
 * Link to a product's page, with the id in the query string.
 * @param {string} - id
 */

export function productUrl(id) {
    return pageUrl(`product/index.html?id=${encodeURIComponent(id)}`);
}

/**
 * One product card for the grid.
 * @param {object} - product
 * @returns {HTMLLIElement}
 */

export function createProductCard(product) {
    const url = productUrl(product.id);

    return el(
        "li",
        { className: "product-card" },
        el(
            "article",
            {},
            el(
                "a",
                { href: url, className: "product-card__image", tabindex: -1, "aria-hidden": "true" },
                el("img", {
                    src: product.image?.url,
                    alt: "",
                    loading: "lazy",
                    width: 400,
                    height: 400,
                }),
                hasDiscount(product) && el("span", { className: "badge" }, `-${getDiscountPercent(product)}%`)
            ),
            el(
                "div",
                { className: "product-card__body" },
                el("h3", { className: "product-card__title" }, el("a", { href: url }, product.title)),
                createRating(product.rating),
                createPrice(product)
            )
        )
    );
}