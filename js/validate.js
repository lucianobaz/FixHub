document.addEventListener("DOMContentLoaded", () => {
    // Create the message area used by both the login and registration forms.
    function ensureFeedback() {
        let el = document.getElementById("feedback");
        if (!el) {
            el = document.createElement("div");
            el.id = "feedback";
            // Put the message at the top of the form card, or at the top of the page if no card exists.
            const container = document.querySelector('.auth-card') || document.body;
            container.insertBefore(el, container.firstChild);
        }
        return el;
    }

    // Read error or success messages sent back in the URL after a PHP redirect.
    const feedback = ensureFeedback();
    const params = new URLSearchParams(window.location.search);

    if (params.has("error")) {
        // Display server-side errors, such as invalid login details.
        const errorMsg = params.get("error");
        feedback.className = "error";
        feedback.style.color = "red";
        feedback.style.marginBottom = "10px";

        if (errorMsg === "Invalid username or password") {
            feedback.setAttribute("data-i18n-block", "errorInvalidCredentials");
            const isSpanish = (typeof currentLang !== "undefined" && currentLang === "es") || document.documentElement.lang === "es";
            feedback.textContent = isSpanish ? "Usuario o contraseña incorrectos" : errorMsg;
        } else if (errorMsg === "Registration failed. Username may exist.") {
            feedback.setAttribute("data-i18n-block", "errorRegistrationFailed");
            const isSpanish = (typeof currentLang !== "undefined" && currentLang === "es") || document.documentElement.lang === "es";
            feedback.textContent = isSpanish ? "El registro falló. El nombre de usuario podría ya existir." : errorMsg;
        } else {
            feedback.textContent = errorMsg;
        }
    } else if (params.has("success")) {
        // Display successful actions, such as a completed registration.
        const successMsg = params.get("success");
        feedback.className = "success";
        feedback.style.color = "green";
        feedback.style.marginBottom = "10px";

        if (successMsg.startsWith("Registration successful")) {
            feedback.setAttribute("data-i18n-block", "successRegistration");
            const isSpanish = (typeof currentLang !== "undefined" && currentLang === "es") || document.documentElement.lang === "es";
            feedback.textContent = isSpanish ? "¡Registro exitoso! Por favor inicia sesión." : successMsg;
        } else {
            feedback.textContent = successMsg;
        }
    }

    // Check that the username and password follow the requirements (Registration only).
    function validateCredentials(username, password) {
        const isSpanish = (typeof currentLang !== "undefined" && currentLang === "es") || document.documentElement.lang === "es";

        // Check each password requirement separately so a useful message can be returned.
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        const minMax = username.length >= 8 && password.length >= 8 && username.length <= 20 && password.length <= 20;

        if (!minMax) {
            return isSpanish
                ? "El usuario y la contraseña deben tener entre 8 y 20 caracteres."
                : "Username and password must be between 8 and 20 characters long.";
        }
        if (!hasSpecialChar) {
            return isSpanish
                ? "La contraseña debe contener al menos un carácter especial."
                : "Password must contain at least one special character.";
        }
        if (!hasLowercase || !hasUppercase || !hasDigit) {
            return isSpanish
                ? "La contraseña debe contener minúscula, mayúscula, número y un carácter especial."
                : "Password must contain a lowercase, uppercase, number, and special character.";
        }

        return null; // No error means that all requirements were met.
    }

    // Registration validation: Enforce complexity rules before submitting to PHP.
    function setupRegistrationValidation(form, successText) {
        if (!form) return;

        form.addEventListener('submit', function (event) {
            const username = document.getElementById('username') ? document.getElementById('username').value : '';
            const password = document.getElementById('password') ? document.getElementById('password').value : '';

            const error = validateCredentials(username, password);

            if (error) {
                // Stop the request and show the validation error in the browser.
                event.preventDefault();
                feedback.textContent = error;
                feedback.className = "error";
                feedback.style.color = "red";
                feedback.style.marginBottom = "10px";
            } else {
                // Let the form continue to PHP after showing a temporary success message.
                feedback.textContent = successText;
                feedback.className = "success";
                feedback.style.color = "green";
                feedback.style.marginBottom = "10px";
            }
        });
    }

    // Login validation: Only check that fields are not empty; let PHP authenticate credentials against the DB.
    function setupLoginValidation(form) {
        if (!form) return;

        form.addEventListener('submit', function (event) {
            const username = document.getElementById('username') ? document.getElementById('username').value.trim() : '';
            const password = document.getElementById('password') ? document.getElementById('password').value.trim() : '';

            if (!username || !password) {
                event.preventDefault();
                const isSpanish = (typeof currentLang !== "undefined" && currentLang === "es") || document.documentElement.lang === "es";
                feedback.textContent = isSpanish
                    ? "Por favor, introduce el usuario y la contraseña."
                    : "Please enter both username and password.";
                feedback.setAttribute("data-i18n-block", "emptyFieldsError");
                feedback.className = "error";
                feedback.style.color = "red";
                feedback.style.marginBottom = "10px";
            }
            // When fields are entered, let form submit to ../php/login.php.
            // If credentials are invalid, PHP redirects back with ?error=Invalid+username+or+password.
        });
    }

    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    // Attach registration rules only to registerForm.
    setupRegistrationValidation(registerForm, "Registration successful!");

    // Attach basic submission check only to loginForm.
    setupLoginValidation(loginForm);
});