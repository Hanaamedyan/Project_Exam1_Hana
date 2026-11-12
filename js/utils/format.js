/**
 * format.js
 * helpers for prices and discounts.
 */

const priceFormatter = new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
});

/**
 * Formats a number as a price.
 * @param {number} - amount
 * @returns {string}
 */

export function formatPrice(amount) {
    return priceFormatter.format(amount);
}

/**
 * True when the product is on sale
 * @param {{ price: number, discountedPrice: number }} - product
 */

export function hasDiscount(product) {
    return typeof product.discountedPrice === "number" && product.discountedPrice < product.price;
}

/** 
 * The price the customer actuallu pays for one item.
 * @param {{ price: number, discountedPrice: number }}
 */

export function getUnitPrice(product) {
    return hasDiscount(product) ? product.discountedPrice : product.price;
}

/**
 * Discount as a whole percentage
 * @param {{ price: number, discountedPrice: number}}
 */

export function getDiscountPercent(product) {
    if (!hasDiscount(product)) return 0;
    return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
}