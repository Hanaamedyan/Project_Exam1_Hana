/** clien.js
 * One reusable fetch wrapper for every API call in the app.
 * It adds JSON headers, adds the access token when needed, and turns API errors into readable messages.
 */

import { getToken } from "../utils/storage.js";

/**
 * Custom error class so pages can tell API errors apart from other errors and read the HTTP status code.
 */
export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

/** 
 * Sends a request to the API and returns the parsed JSON.
 * 
 * @param {string} - url
 * @param {object} [options]
 * @param {string} [option.method="GET"]
 * @param {object} [options.body] - Data to send
 * @param {boolean} [options.auth=false]
 * @returns {Promise<object>} - The JSON response
 * @throws {ApiError} - When the network fails or the API returns an error status.
 */

export async function apiRequest(url, { method = "GET", body, auth = false} = {}) {
    const headers = { "Content_Type": "application/json" };


if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
}

let response;
try {
    response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });
} catch {
    throw new ApiError("Could not connect to the server. Check your internet connection and try again.", 0);
}

const json = await response.json().catch(() => ({}));

if (!response.ok) {
    const message = 
    json.errors?.map((error) => error.message).join("") ||
    `Something went wrong (error ${response.status}). Please try again.`;
    throw new ApiError(message, response.status);
}

return json;

}