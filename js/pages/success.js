/**
 * success.js
 * Confirms the purchase and shows the order summary saved by the checkout page.
 */

import { initHeader } from "../ui/header.js";
import { load } from "../utils/storage.js";
import { STORAGE_KEYS } from "../api/constants.js";
import { formatPrice } from "../utils/format.js";
import { el } from "../utils/dom.js";

const detailsEl = document.querySelector("[data-order-details]");

/** Starts the page. */
function init() {
  initHeader();
  renderOrder(load(STORAGE_KEYS.lastOrder));
}

/**
 * Shows the order number, items, total, and delivery address.
 * If there is no saved order (e.g. the page was opened directly,),
 * only the thank you message and the button show.
 * @param {object|null} - order
 */

function renderOrder(order) {
  if (!order || !detailsEl) return;

  detailsEl.replaceChildren(
    el(
      "p",
      { className: "order__number" },
      "Order number: ",
      el("strong", {}, order.number),
    ),
    el(
      "ul",
      { className: "order__items" },
      order.items.map((item) =>
        el("li", {}, `${item.title} × ${item.quantity}`),
      ),
    ),
    el(
      "p",
      { className: "order__total" },
      "Total: ",
      el("strong", {}, formatPrice(order.total)),
    ),
    el(
      "p",
      { className: "muted" },
      `Delivering to ${order.name}, ${order.address}. A confirmation is on its way to ${order.email}.`,
    ),
  );
  detailsEl.hidden = false;
}

init();
