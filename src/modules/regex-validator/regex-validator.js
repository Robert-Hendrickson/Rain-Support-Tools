/**
 * Regex pattern validator module
 * @module regex-validator
 */

// Define regex patterns
const regexPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s-()]{10,}$/,
    url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    // Add more patterns as needed
};

/**
 * Validates a string against a specified regex pattern
 * @param {string} testString - The string to test against the regex pattern
 * @param {string|null} [patternName=null] - The name of the pattern to use (optional)
 * @returns {boolean} - Returns true if the string matches the pattern, false otherwise
 * @throws {Error} - Throws an error if the pattern name is invalid
 */
export function validatePattern(testString, patternName = null) {
    if (!testString || typeof testString !== 'string') {
        throw new Error('Test string must be a non-empty string');
    }

    if (patternName && !regexPatterns[patternName]) {
        throw new Error(`Invalid pattern name: ${patternName}`);
    }

    const pattern = patternName ? regexPatterns[patternName] : null;
    return pattern ? pattern.test(testString) : false;
}

/**
 * Adds a new regex pattern to the validator
 * @param {string} name - The name of the pattern
 * @param {RegExp} pattern - The regex pattern to add
 * @throws {Error} - Throws an error if the pattern name already exists
 */
export function addPattern(name, pattern) {
    if (regexPatterns[name]) {
        throw new Error(`Pattern ${name} already exists`);
    }
    if (!(pattern instanceof RegExp)) {
        throw new Error('Pattern must be a RegExp object');
    }
    regexPatterns[name] = pattern;
}

// Export the available patterns for reference
export const patterns = Object.keys(regexPatterns); 