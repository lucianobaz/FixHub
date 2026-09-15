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
        feedback.textContent = params.get("error");
        feedback.className = "error";
        feedback.style.color = "red";
        feedback.style.marginBottom = "10px";
    } else if (params.has("success")) {
        // Display successful actions, such as a completed registration.
        feedback.textContent = params.get("success");
        feedback.className = "success";
        feedback.style.color = "green";
        feedback.style.marginBottom = "10px";
    }

    // Check that the username and password follow the form requirements.
    function validateCredentials(username, password) {

        // Check each password requirement separately so a useful message can be returned.
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
        const MinMax = username.length >= 8 && password.length >= 8 && username.length <= 20 && password.length <= 20;
    

        
        if (!MinMax) {
            return "Username and password must be between 8 and 20 characters long.";
        }
        if (!hasSpecialChar) {
            return "Password must contain at least one special character.";
        }
        if (!hasLowercase || !hasUppercase || !hasDigit) {
            return "Password must contain a lowercase, uppercase, number, and special character.";
        }

        return null; // No error means that all requirements were met.
    }

    // Add the same validation behavior to whichever form exists on the current page.
    function setupValidation(form, successText) {
        if (!form) return;

        form.addEventListener('submit', function(event) {
            // Read the values before allowing the form to be submitted to PHP.
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

    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    // Configure registration and login independently because only one exists per page.
    setupValidation(registerForm, "Registration successful!");
    setupValidation(loginForm, "Login successful!");
});