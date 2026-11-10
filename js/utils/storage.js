/** 
 * storage.js
 * Safe helpers for reading and writing localStorage
 * localStorage can throw, so every call is wrapped in try/catch. */

 import { STORAGE_KEYS } from "../api/constants.js";

 /** 
 * Saves any value as JSON 
 * @param {string} key 
 * @param {*} value 
 */

 export function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Could not save "${key}" to localStorage`, error);
    }
 }

 /** 
 * Loades and parses a JSON value.
 * @param {string}  key 
 * @param {*} [fallback=null] - Returned when nothing is saved.
 */

 export function load(key, fallback = null) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch {
        return fallback;
    }
 }

 /** 
* Removes a value 
 @param {string} Key 
 */

 export function remove(key) {
    try {
        localStorage.removeItem(key);
    } catch {
        /* ignore - nothing to remove */
    }
 }

 /* Auth helpers */

 /** Saves the access token and the user's profile after login. */
 export function saveAuth(token, user) {
    save(STORAGE_KEYS.token, token);
    save(STORAGE_KEYS.user, user);
 }

 /** @returns {string|null} The saved acess token */
 export function getToken() {
    return load(STORAGE_KEYS.token);
 }

 /** @returns {{name: string, email: string}|null} The saved user profile */
 export function getUser() {
    return load(STORAGE_KEYS.user);
 }

 /** @returns {boolean} True when token is saved. */
 export function isLoggedIn() {
    return Boolean(getToken());
 }

 /** Logs the user out by removing the token and profile. */
 export function clearAuth() {
    remove(STORAGE_KEYS.token);
    remove(STORAGE_KEYS.user);
 }