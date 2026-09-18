//we create an EMPTY variable to hold our date once it arrives
let translations = {};
let currentLang = "en";  //Startup language

// 1. Fetch the external JSON file when the script loads
fetch('../js/translations.json')
    .then(response => {
        // Confirm the file was retrieved successfully
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse raw text into a JavaScript Object
    })
    .then(data => {
        //Save parsed JSON data into our global variable
        translations = data;
        console.log("Translations loaded successfully.");
    })
    .catch(error => {
        console.error("Failed to load translation file:", error);
    });

// 2. Triggered when the user clicks the toggle button //
function toggleLanguage() {
    // Prevent execution if JSON hasn't finished loading over the network
    if (Object.keys(translations).length === 0) {
        alert("Translation data is still loading. Please try again in a moment.");
        return;
    }

    // Toggle current language state between English and Spanish
    currentLang = (currentLang === "en") ? "es" : "en";

    // Update button text using the newly selected language dictionary
    const btn = document.getElementById("lang-btn") || document.getElementById("langButton") || document.querySelector(".lang-btn");
    if (btn && translations[currentLang] && translations[currentLang]["buttonText"]) {
        btn.textContent = translations[currentLang]["buttonText"];
    }

    // Update the html lang attribute
    document.documentElement.lang = currentLang;

    // Find all container elements with the 'data-i18n-block' attribute
    const blocks = document.querySelectorAll("[data-i18n-block]");

    // Loop through each element and replace its text content safely
    blocks.forEach(block => {
        const key = block.getAttribute("data-i18n-block");
        if (translations[currentLang] && translations[currentLang][key] !== undefined) {
            block.textContent = translations[currentLang][key];
        }
    });
}