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

    //------------------------------------------------------------------------------------------
    //FUNCTION - This function is in charge of finding or creating the feedback message box inside the form card.
    //------------------------------------------------------------------------------------------
    function getFeedbackContainer() {
        //what is document.getElementById for? Is a method that is used to select one specific element by its unique id.
        let feedbackElement = document.getElementById("feedback");
        if (!feedbackElement) {
            //what is document.createElement for? Is a method that is used to create a new HTML element dynamically with JavaScript.
            //If the feedback box does not exist, we create a new div element.
            feedbackElement = document.createElement("div");
            feedbackElement.id = "feedback";
            
            //what is document.querySelector for? Is a method that is used to find the first element that matches a specific CSS selector.
            //We insert the feedback message at the top of the form card so that the user sees it easily.
            const container = document.querySelector('.auth-card') || document.body;
            container.insertBefore(feedbackElement, container.firstChild);
        }
        return feedbackElement;
    }

    const feedback = getFeedbackContainer();

    //------------------------------------------------------------------------------------------
    //FUNCTION - This function is in charge of displaying an error message in red color.
    //------------------------------------------------------------------------------------------
    function showError(message) {
        feedback.textContent = message;
        feedback.className = "error";
        feedback.style.color = "#dc2626"; //Red color for error
        feedback.style.marginBottom = "14px";
        feedback.style.fontWeight = "600";
    }

    //------------------------------------------------------------------------------------------
    //FUNCTION - This function is in charge of displaying a success message in green color.
    //------------------------------------------------------------------------------------------
    function showSuccess(message) {
        feedback.textContent = message;
        feedback.className = "success";
        feedback.style.color = "#16a34a"; //Green color for success
        feedback.style.marginBottom = "14px";
        feedback.style.fontWeight = "600";
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
    //FUNCTION - This function is in charge of checking if the username and password meet all the security rules for new accounts.
    //------------------------------------------------------------------------------------------
    function validatePasswordStrength(username, password) {
        //We check if username and password have between 8 and 20 characters.
        const isLengthValid = username.length >= 8 && username.length <= 20 &&
                              password.length >= 8 && password.length <= 20;
        if (!isLengthValid) {
            return isSpanish()
                ? "El usuario y la contraseña deben tener entre 8 y 20 caracteres."
                : "Username and password must be between 8 and 20 characters long.";
        }

        //what is a Regular Expression (RegEx)? A pattern of characters used to test or validate if text meets specific rules.
        //what is .test() for? Is a RegEx method that returns true if text matches the pattern, or false if it does not.
        //We use a Regular Expression in order to test if the password has at least one special character.
        const hasSpecialChar = /[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        if (!hasSpecialChar) {
            return isSpanish()
                ? "La contraseña debe contener al menos un carácter especial (!@#$%...)."
                : "Password must contain at least one special character (!@#$%...).";
        }

        //We use Regular Expressions in order to test if the password has lowercase, uppercase, and numbers.
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasDigit = /[0-9]/.test(password);

        if (!hasLowercase || !hasUppercase || !hasDigit) {
            return isSpanish()
                ? "La contraseña debe incluir mayúsculas, minúsculas y números."
                : "Password must contain lowercase, uppercase, and numbers.";
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