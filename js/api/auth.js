/**
 * auth.js
 * Register and login requests against the Noroff endpoints.
 */

import { API_LOGIN, API_REGISTER } from "./constants.js";
import { apiRequest } from "./client.js";
import { saveAuth } from "../utils/storage.js";

/**
 * Creates a new user account.
 * @param {{ name: string, email: string, password: string }} - user
 * @returns {Promise<object>} - The created profile 
 */

export async function registerUser({ name, email, password }) {
    const json = await apiRequest(API_REGISTER, {
        method: "POST",
        body: { name, email, password },
    });
    return json.data
}

/** 
 * Logs the user in and saves the access token and profile in localStorage.
 * @param {{ email: string, password: string }} - credentials
 * @returns {Promise<object>} - the logged in profile
 */

export async function loginUser({ email, password }) {
    const json = await apiRequest(API_LOGIN, {
        method: "POST",
        body: { email, password},
    });

    const { accessToken, name, email: userEmail } = json.data;
    saveAuth(accessToken, { name, email: userEmail });
    return json.data;
}