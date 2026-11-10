/**
 * constants.js - this file contains constants used throughout the application
 * All API URLs and localStorage keys live here.
 */

/** Base URL for the API */
export const API_BASE = "https://v2.api.noroff.dev";

/** GET all products */
export const API_SHOP = `${API_BASE}/online-shop`;

/** POST {name, email, password } to create account */
export const API_REGISTER = `${API_BASE}/online-shop`;

/** POST {email, password} to log in and receive access token. */
export const API_LOGIN = `${API_BASE}/auth/login`;

/** Keys used to save data in the browser's localStorage. */
export const STORAGE_KEYS = {
    token: "hylle_token",
    user: "hylle_user",
    cart: "hylle_cart",
    lastOrder: "hylle_last_order",
};

/** How many products the feed and carousel show. */
export const FEED_PRODUCT_COUNT = 12;
export const CAROUSEL_PRODUCT_COUNT = 3;