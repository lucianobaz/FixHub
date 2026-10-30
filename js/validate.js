/* VALIDATE - JAVASCRIPT */
/* This script is in charge of checking user inputs in the Login and Register forms before sending data to PHP. */

/* -------------------------------------------------------------- */
/* KEYWORDS EXPLANATION: */
/* -------------------------------------------------------------- */

//what is const for? const is a keyword that is used to declare a variable that is constant, meaning it cannot be changed.
//what is let for? let is a keyword used to declare a variable that can be changed later.


//what is addEventListener for? Is a method that is used to wait for an event to happen, then do something.
document.addEventListener("DOMContentLoaded", function () {

    //------------------------------------------------------------------------------------------
    //FUNCTION - This function is in charge of checking if the website is currently in Spanish.
    //------------------------------------------------------------------------------------------
    function isSpanish() {
        return document.documentElement.lang === "es";
    }

    //what is document.createElement for? Is a method that is used to create a new HTML element dynamically with JavaScript.
    //We create a new div element to display error or success messages at the top of the form card.
    const feedback = document.createElement("div");
    feedback.id = "feedback";
    feedback.style.marginBottom = "14px";
    feedback.style.fontWeight = "600";

    //what is document.querySelector for? Is a method that is used to find the first element that matches a specific CSS selector.
    //We insert the feedback message at the top of the form card so that the user sees it easily.
    const container = document.querySelector('.auth-card');
    if (container) {
        container.insertBefore(feedback, container.firstChild);
    }

    //------------------------------------------------------------------------------------------
    //FUNCTION - This function is in charge of displaying an error message in red color.
    //------------------------------------------------------------------------------------------
    function showError(message) {
        feedback.textContent = message;
        feedback.style.color = "#dc2626"; //Red color for error
    }

    //------------------------------------------------------------------------------------------
    //FUNCTION - This function is in charge of displaying a success message in green color.
    //------------------------------------------------------------------------------------------
    function showSuccess(message) {
        feedback.textContent = message;
        feedback.style.color = "#16a34a"; //Green color for success
    }

    //what is URLSearchParams for? Is an object used to read parameters from the website URL, such as "?error=" or "?success=".
    //We use URLSearchParams in order to read parameters sent by PHP in the URL query string (such as ?error= or ?success=).
    const urlParameters = new URLSearchParams(window.location.search);

    //1. If PHP sent an error parameter, we display the error in red color.
    if (urlParameters.has("error")) {
        const errorMsg = urlParameters.get("error");

        if (errorMsg === "Invalid username or password") {
            feedback.setAttribute("data-i18n-block", "errorInvalidCredentials");
            showError(isSpanish() ? "Usuario o contraseña incorrectos." : errorMsg);
        } else if (errorMsg.includes("Registration failed")) {
            feedback.setAttribute("data-i18n-block", "errorRegistrationFailed");
            showError(isSpanish() ? "El nombre de usuario ya existe o hubo un fallo en el registro." : errorMsg);
        } else {
            showError(errorMsg);
        }
    }

    //2. If PHP sent a success parameter, we display the success message in green color.
    if (urlParameters.has("success")) {
        const successMsg = urlParameters.get("success");

        if (successMsg.startsWith("Registration successful")) {
            feedback.setAttribute("data-i18n-block", "successRegistration");
            showSuccess(isSpanish() ? "¡Registro exitoso! Por favor inicia sesión." : successMsg);
        } else {
            showSuccess(successMsg);
        }
    }

    //------------------------------------------------------------------------------------------
    //SHOW / HIDE PASSWORD BUTTON - This section is in charge of showing or hiding the password when clicking the button.
    //------------------------------------------------------------------------------------------
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("togglePassword");

    if (passwordInput && togglePasswordBtn) {
        togglePasswordBtn.addEventListener("click", function () {
            //If the input type is "password" (hidden with dots), we change it to "text" so the user can see the letters.
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePasswordBtn.setAttribute("data-i18n-block", "hidePasswordBtn");
                togglePasswordBtn.textContent = isSpanish() ? "Ocultar" : "Hide";
            } else {
                //If it is already "text", we change it back to "password" to hide it again.
                passwordInput.type = "password";
                togglePasswordBtn.setAttribute("data-i18n-block", "showPasswordBtn");
                togglePasswordBtn.textContent = isSpanish() ? "Mostrar" : "Show";
            }
        });
    }

    //------------------------------------------------------------------------------------------
    //FUNCTION - This function is in charge of checking if the username and password meet all the security rules for new accounts.
    //------------------------------------------------------------------------------------------
    function validatePasswordStrength(username, password) {
        //1. We check if username and password have between 6 and 12 characters.
        const isLengthValid = username.length >= 6 && username.length <= 12 &&
                              password.length >= 6 && password.length <= 12;
        if (!isLengthValid) {
            return isSpanish()
                ? "El usuario y la contraseña deben tener entre 6 y 12 caracteres."
                : "Username and password must be between 6 and 12 characters long.";
        }

        //what is a Regular Expression (RegEx)? A pattern of characters used to test or validate if text meets specific rules.
        //what is .test() for? Is a RegEx method that returns true if text matches the pattern, or false if it does not.
        //What does /[^a-zA-Z0-9_]/ mean? The ^ symbol inside [] means NOT, so it allows letters, numbers, and "_", and blocks symbols like (!"#$%&¿?).

        //2. We check that the username does NOT contain invalid symbols (!"#$%&¿?), while allowing "_".
        if (/[^a-zA-Z0-9_]/.test(username)) {
            return isSpanish()
                ? "El nombre de usuario no puede contener símbolos (!\"#$%&¿?)."
                : "Username cannot contain symbols (!\"#$%&¿?).";
        }

        //3. We check that the username contains at least one number ([0-9]).
        if (!/[0-9]/.test(username)) {
            return isSpanish()
                ? "El nombre de usuario debe contener al menos un número."
                : "Username must contain at least one number.";
        }

        //4. We check that the password contains at least one letter ([a-zA-Z]), one number ([0-9]), and one symbol ([^a-zA-Z0-9]).
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);

        if (!hasLetter || !hasNumber || !hasSymbol) {
            return isSpanish()
                ? "La contraseña debe contener al menos una letra, un número y un símbolo."
                : "Password must contain at least one letter, one number, and one symbol.";
        }

        //If all requirements are met, we return null meaning there are no errors.
        return null;
    }

    //We select the registration form from the HTML.
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        //We listen for when the user submits the registration form in order to check credentials before sending them to PHP.
        registerForm.addEventListener('submit', function (event) {
            //what is .trim() for? Is a method used to remove extra empty spaces from the start and end of a text.
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            //We validate the credentials with our function.
            const validationError = validatePasswordStrength(username, password);

            if (validationError) {
                //what is event.preventDefault() for? Is a method used to stop the default browser action, like stopping a form from submitting if there is an error.
                //We use event.preventDefault() in order to stop the form from sending invalid data to PHP.
                event.preventDefault();
                showError(validationError);
            }
        });
    }

    //We select the login form from the HTML.
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        //We listen for when the user submits the login form in order to check that fields are not empty.
        loginForm.addEventListener('submit', function (event) {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            //If either the username or password is blank, we stop the form and show an error.
            if (username === '' || password === '') {
                //We use event.preventDefault() so that the form does not submit empty fields.
                event.preventDefault();

                const message = isSpanish()
                    ? "Por favor, introduce el usuario y la contraseña."
                    : "Please enter both username and password.";
                feedback.setAttribute("data-i18n-block", "emptyFieldsError");
                showError(message);
            }
        });
    }
});