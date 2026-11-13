/**
 * carousel.js
 * Banner carousel for the product feed page.
 */

import { el } from "../utils/dom.js";
import { createPrice, productUrl } from "./productCard.js";

/**
 * @param {HTMLElement} - container
 * @param {Array<object>} - The products to show
 */

export function initCarousel(container, products) {
    if (!container || !products.length) return;

    let current = 0;
    const total = products.length;


/* Build the markup */

const slides = products.map((product, index) => 
el(
    "div",
    {
        className: "carousel__slide",
        role: "group",
        "aria-roledescription": "slide",
        "aria-label": `${index + 1} of ${total}`,
    },
    el(
        "div",
        { className: "carousel__content" },
        el("p", { className: "eyebrow carousel__eyebrow" }, "Featured"),
        el("h2", { className: "carousel__title" }, product.title),
        el("p", { className: "carousel__text" }, product.description),
        createPrice(product),
        el("a", { href: productUrl(product.id), className: "btn btn--light" }, "View product")
    ),
    el(
        "div",
        { className: "carousel__media" },
        el("img", {
            src: product.image?.url,
            alt: product.image?.alt || product.title,
            width: 640,
            height: 480,
            loading: index === 0 ? "eager" : "lazy",
        })
    )
)
);

const track = el("div", { className: "carousel__track" }, slides);

const prevButton = el(
    "button",
    { type: "button", className: "carousel__btn", "aria-label" : "Previous product", onClick: () => goTo(current - 1) },
    el("span", { "aria-hidden": "true" }, "‹")
);
const nextButton = el(
    "button",
    { type: "button", className: "carousel__btn", "aria-label" : "Next product", onClick: () => goTo(current + 1) },
    el("span", { "aria-hidden": "true" }, "›")
);

const dots = products.map((product, index) =>
el("button", {
    type: "button",
    className: "carousel__dot",
    "aria-label": `Show product ${index + 1}: ${product.title}`,
    onClick: () => goTo(index),
})
);

const liveRegion = el("p", { className: "visually-hidden", "aria-live": "polite", "aria-atomic": "true" });

container.replaceChildren(
    el("div", { className: "carousel__viewport" }, track),
    el("div", { className: "carousel__controls" }, prevButton, el("div", { className: "carousel__dots" }, dots), nextButton),
    liveRegion
);
container.setAttribute("aria-roledescription", "carousel");

/* Behavior */

/**
 * @param {number} - index
 * @param {boolean} - update the live region 
 */

function goTo(index, announce = true) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    slides.forEach((slide, i) => {
        const isActive = i === current;
        slide.inert = !isActive;
        slide.classList.toggle("is-active", isActive);
    });
    dots.forEach((dot, i) => dot.setAttribute("aria-current", i === current ? "true" : "false"));

    if (announce) liveRegion.textContent = `Product ${current + 1} of ${total}: ${products[current].title}`;
}

container.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goTo(current - 1);
    if (event.key === "ArrowRight") goTo(current + 1);
});

goTo(0, false);

}
