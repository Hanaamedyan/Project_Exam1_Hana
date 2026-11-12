/** 
 * dom.js 
 * Tiny helper for creating HTML elements safely.
 * Text from the API is alway set with textContent
 */

/**
 * Creates an element with attributes and children.
 * 
 * @example
 * 
 * @param {string} - tag - element name
 * @param {object} - properties and attributes
 * @param {...(Node|string|null|false)} - children
 * @returns {HTMLElement}
 */

export function el(tag, attrs = {}, ...children) {
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(attrs)) {
        if (value === null || value === undefined || value === false) continue;

        if (key === "className") element.className = value;
        else if (key === "dataset") Object.assign(element.dataset, value);
        else if (key.startsWith("on") && typeof value === "function") {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key in element && !key.includes("-")) element[key] = value;
        else element.setAttribute(key, value === true ? "" : value);
    }

    for (const child of children.flat()) {
        if (child === null || child === undefined || child === false) continue;
        element.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }

    return element;
}