
/**
 * Password validation function.
 * 
 * @param {string} pw - The password to validate
 * @returns {boolean} - True if the password is valid, false otherwise
 */
function validatePassword(pw) {
    const allowedSpecialChars = "!@#$%^&*"; // Define allowed special characters

    return /[A-Z]/.test(pw) && // At least one uppercase
           /[a-z]/.test(pw) && // At least one lowercase
           /[0-9]/.test(pw) && // At least one number
           new RegExp(`[${allowedSpecialChars}]`).test(pw) && // At least one special character
           pw.length >= 8 && pw.length <= 64 && // Length between 8 and 64
           /^[a-zA-Z0-9!@#$%^&*]+$/.test(pw); // Only alphanumeric and allowed special characters
}

module.exports = {
    validatePassword
}   