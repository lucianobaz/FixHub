/**
 * FixHub - Form Validation Script (validate.js)
 * 
 * Purpose: This script is in charge of client-side validation for both the Login
 * and Registration forms before data is submitted to PHP and MySQL.
 * 
 * Formula: We use event.preventDefault() to stop form submission when input is invalid,
 * in order to provide instant feedback to the user without reloading the page.
 * We also use URLSearchParams in order to display server-side messages returned by PHP.
 */

document.addEventListener("DOMContentLoaded", function () {

    /**
     * Helper function: getFeedbackContainer()
     * 
     * Purpose: This function is in charge of finding or creating the feedback message container
     * inside the authentication card so that success or error messages can be displayed.
     */
    function getFeedbackContainer() {
        let feedbackElement = document.getElementById("feedback");
        if (!feedbackElement) {
            feedbackElement = document.createElement("div");
            feedbackElement.id = "feedback";
            
            // Insert feedback at the top of the auth card
            const container = document.querySelector('.auth-card') || document.body;
            container.insertBefore(feedbackElement, container.firstChild);
        }
        return feedbackElement;
    }

    const feedback = getFeedbackContainer();

    /**
     * Check for server-side responses in the URL.
     * We use URLSearchParams in order to read GET parameters (e.g., ?error=... or ?success=...)
     * sent back by PHP after an authentication attempt.
     */
    const urlParameters = new URLSearchParams(window.location.search);

    // 1. Handle error messages from PHP
    if (urlParameters.has("error")) {
        const errorMsg = urlParameters.get("error");
        feedback.className = "error";
        feedback.style.color = "#dc2626"; // Clear red color
        feedback.style.marginBottom = "14px";
        feedback.style.fontWeight = "600";

        const isSpanish = (typeof currentLang !== "undefined" && currentLang === "es") || document.documentElement.lang === "es";

        if (errorMsg === "Invalid username or password") {
            feedback.setAttribute("data-i18n-block", "errorInvalidCredentials");
            feedback.textContent = isSpanish ? "Usuario o contraseña incorrectos." : errorMsg;
        } else if (errorMsg === "Registration failed. Username may already exist") {
            feedback.setAttribute("data-i18n-block", "errorRegistrationFailed");
            feedback.textContent = isSpanish ? "El nombre de usuario ya existe o hubo un fallo en el registro." : errorMsg;
        } else {
            feedback.textContent = errorMsg;
        }
    }

    // 2. Handle success messages from PHP
    if (urlParameters.has("success")) {
        const successMsg = urlParameters.get("success");
        feedback.className = "success";
        feedback.style.color = "#16a34a"; // Clear green color
        feedback.style.marginBottom = "14px";
        feedback.style.fontWeight = "600";

        const isSpanish = (typeof currentLang !== "undefined" && currentLang === "es") || document.documentElement.lang === "es";

        if (successMsg.startsWith("Registration successful")) {
            feedback.setAttribute("data-i18n-block", "successRegistration");
            feedback.textContent = isSpanish ? "¡Registro exitoso! Por favor inicia sesión." : successMsg;
        } else {
            feedback.textContent = successMsg;
        }
    }

    /**
     * Function: validatePasswordStrength(username, password)
     * 
     * Purpose: This function is in charge of checking password complexity for new accounts.
     * 
     * Formula: We use Regular Expressions (RegEx) to test characters in order to guarantee
     * that passwords are strong and secure.
     * 
     * @returns {string|null} - Error message if invalid, or null if valid.
     */
    function validatePasswordStrength(username, password) {
        const isSpanish = (typeof currentLang !== "undefined" && currentLang === "es") || document.documentElement.lang === "es";

        // Check length: between 8 and 20 characters
        const isLengthValid = username.length >= 8 && username.length <= 20 &&
                              password.length >= 8 && password.length <= 20;
        if (!isLengthValid) {
            return isSpanish
                ? "El usuario y la contraseña deben tener entre 8 y 20 caracteres."
                : "Username and password must be between 8 and 20 characters long.";
        }

        // Test for special characters using a Regular Expression
        const hasSpecialChar = /[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        if (!hasSpecialChar) {
            return isSpanish
                ? "La contraseña debe contener al menos un carácter especial (!@#$%...)."
                : "Password must contain at least one special character (!@#$%...).";
        }

        // Test for lowercase, uppercase, and digits
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasDigit = /[0-9]/.test(password);

        if (!hasLowercase || !hasUppercase || !hasDigit) {
            return isSpanish
                ? "La contraseña debe incluir mayúsculas, minúsculas y números."
                : "Password must contain lowercase, uppercase, and numbers.";
        }

        return null; // All validation checks passed!
    }

    /**
     * Registration Form Validation
     * We attach an event listener to the "submit" event of registerForm in order to validate
     * credentials before sending them to register.php.
     */
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            const validationError = validatePasswordStrength(username, password);

            if (validationError) {
                // We use event.preventDefault() so that the form does NOT submit to PHP
                event.preventDefault();

                feedback.textContent = validationError;
                feedback.className = "error";
                feedback.style.color = "#dc2626";
                feedback.style.marginBottom = "14px";
            }
        });
    }

    /**
     * Login Form Validation
     * For login, we only check that inputs are not left empty.
     * PHP will check whether the username and password match the database.
     */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            if (username === '' || password === '') {
                // Prevent form submission if fields are blank
                event.preventDefault();

                const isSpanish = (typeof currentLang !== "undefined" && currentLang === "es") || document.documentElement.lang === "es";
                feedback.textContent = isSpanish
                    ? "Por favor, introduce el usuario y la contraseña."
                    : "Please enter both username and password.";
                feedback.setAttribute("data-i18n-block", "emptyFieldsError");
                feedback.className = "error";
                feedback.style.color = "#dc2626";
                feedback.style.marginBottom = "14px";
            }
        });
    }
});