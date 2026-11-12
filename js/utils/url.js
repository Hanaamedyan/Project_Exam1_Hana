/**
 * url.js
 * Helpers for links and query strings.
 */

/** @returns {string} - relative path to the project root. */
export function getRoot() {
    return document.body.dataset.root || "./";
}

/**
 * Builds a link to a page
 * @param {string}
 * @returns {string}
 */

export function pageUrl(path) {
    return `${getRoot()}${path}`;
}

/** Reads a value from the current URL
 * @param {string} - name
 * @returns {string|null}
 */

export function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

/** 
 * The current page's path relative to the project root e.g. "cart/index.html"
 */
export function getCurrentPagePath() {
    const depth = (getRoot().match(/\.\.\//g) || []).length;
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (!parts.length || !parts[parts.length - 1].endsWith(".html")) parts.push("index.html");
    const path = parts.slice(-(depth + 1)).join("/");
    return path + window.location.search;
}

/**
 * Only allows redirects to pages inside this site
 * @param {string|null}
 * @returns {string|null}
 */

export function safeRedirectPath(path) {
    if (!path || /^[a-z]+:|^\/\/|\.\./i.test(path)) return null;
    return path.replace(/^\/+/,"");
}

