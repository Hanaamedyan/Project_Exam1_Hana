/**
 * guard.js
 * Protects pages that need a logged-in user.
 */

import { isLoggedIn } from "./storage.js";
import { pageUrl, getCurrentPagePath } from "./url.js";

/**
 * Sends logged out users to the login page and remembers where they came from,
 * so they come back here after logging in.
 * @returns {boolean}
 */
export function requireLogin() {
  if (isLoggedIn()) return true;

  const redirect = encodeURIComponent(getCurrentPagePath());

  window.location.replace(
    pageUrl(`account/login.html?redirect=${redirect}&reason=login-required`),
  );
  return false;
}
