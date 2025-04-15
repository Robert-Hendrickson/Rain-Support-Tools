/**
 * Regex pattern validator module
 * @module regex-validator
 */
export const regexController = {
    /**
     * @type {Object}
     * @description This object contains all the regex patterns that are used in the application.
     */
    regexPatterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\+?[\d\s-()]{10,}$/,
        url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        googleDrive: /^(?:https?:\/\/)drive\.google\.com\/file\/d\/.*\/view(?:\?.+)?$/,
        oneDrive: /^(?:https?:\/\/)?quiltsoftware-my\.sharepoint\.com\/:(i|v)\:\/p\//,
    },
    /**
     * @param {string} name
     * @param {RegExp} pattern
     * @description This function adds a new regex pattern to the regexPatterns object.
     * @throws {Error} - Throws an error if the pattern name already exists.
     */
    addPattern: (name, pattern) => {
        if (regexController.regexPatterns[name]) {
            throw new Error(`Pattern ${name} already exists`);
        }
        regexController.regexPatterns[name] = pattern;
    }
}