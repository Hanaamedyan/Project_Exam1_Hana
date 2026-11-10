/**
 * products.js
 * Functions for fetching products from the Noroff online-shop endpoint.
 */

import { API_SHOP } from "./constants.js";
import { apiRequest } from "./client.js";

/** Fetches all products
 * @returns {Promise<Array<object>>} - List of product objects
 */

export async function getProducts() {
    const json = await apiRequest(API_SHOP);
    return json.data;
}

/**
 * Fetches a single product by its id.
 * @param {string} - id - the product id from the URL
 * @returns {Promise<object>} - One product object, including reviews
 */

export async function getProduct(id) {
    const json = await apiRequest(`${API_SHOP}/${encodeURIComponent(id)}`);
    return json.data;
}