/**
 * checkout.js
 * Only for logged in users.
 */

import { initHeader } from "../ui/header.js";
import { requireLogin } from "../utils/guard.js";

/** Starts the page. */
function init() {
  if (!requireLogin()) return;
  initHeader();
}

init();
