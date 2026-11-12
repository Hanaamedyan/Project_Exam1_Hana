/**
 * cart.js
 * The Noroff API no cart endpoint, so the cart is stored in localStorage.
 * Every change fires a cart updated event so the header badge can update itself.
 */

import { STORAGE_KEYS } from "../api/constants.js";
import { load, save, remove } from "./storage.js";
import { getUnitPrice } from "./format.js";

/** Highest quality allowed for one product */
export const MAX_QUANTITY = 99;

/** @returns {Array<object>} - all items in the cart */
export function getCart() {
    const cart = load(STORAGE_KEYS.cart, []);
    return Array.isArray(cart) ? cart : [];
}

/**
 * Saves the cart and tells the rest of the page it changed.
 * @param {Array<object>} - cart
 */
function saveCart(cart) {
    save(STORAGE_KEYS.cart, cart);
    document.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart } }));
}

/** 
 * Adds a product to the cart, or increases the quantity.
 * @param {object} - product
 * @param {number} - quantity
 */

export function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            discountedPrice: product.discountedPrice,
            image: product.image,
            quantity,
        });
    }
    saveCart(cart);
}

/**
 * Sets the quantity of one product. A quantity below 1 removes it.
 * @param {string} - id
 * @param {number} - quantity
 */

export function updateQuantity(id, quantity) {
    if (quantity < 1) {
        removeFromCart(id);
        return;
    }
    const cart = getCart().map((item) => 
    item.id === id ? {...item, quantity: Math.min(quantity, MAX_QUANTITY) } : item 
);
saveCart(cart);
}

/**
 * Removes oen product from the cart.
 * @param {string} - id
 */
export function removeFromCart(id) {
    saveCart(getCart().filter((item) => item.id !== id));
}

/** Empties the whole cart. */
export function clearCart() {
    remove(STORAGE_KEYS.cart);
    document.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart: [] } }));
}

/** @returns {number} - total number of items */
export function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/** @returns {number} - total price, usinh the discounted price when there is one. */
export function getCartTotal() {
    return getCart().reduce((sum, item) => sum + getUnitPrice(item) * item.quantity, 0);
}