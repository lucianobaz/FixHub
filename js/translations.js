/**
 * FixHub - Bilingual Translation System (translations.js)
 * 
 * Purpose: This script is in charge of providing full bilingual support (English / Spanish)
 * across all pages of FixHub without needing separate HTML files for each language.
 * 
 * Formula: We use an external JSON file ("translations.json") to store all dictionary texts,
 * and we use localStorage in order to save the user's language choice so that it persists
 * when navigating between different sections of the website.
 */

// Global variables to store the loaded dictionary and the current active language
let translations = {};
let currentLang = "en"; // Default language is English

/**
 * Step 1: Read the user's saved language preference from localStorage.
 * We use localStorage.getItem() in order to check if the user previously selected Spanish.
 */
const savedLanguage = localStorage.getItem("preferredLang");
if (savedLanguage === "es" || savedLanguage === "en") {
    currentLang = savedLanguage;
}

// Update the <html> lang attribute as early as possible for accessibility and SEO
if (document.documentElement) {
    document.documentElement.lang = currentLang;
}

/**
 * Step 2: Try to load cached translations from sessionStorage for instant page transitions.
 * This prevents any visual delay or flickering when clicking between pages.
 */
const cachedData = sessionStorage.getItem("fixhub_translations_cache");
if (cachedData) {
    try {
        translations = JSON.parse(cachedData);
    } catch (e) {
        translations = {};
    }
}

/**
 * Step 3: Fetch the translations dictionary from the JSON file.
 * We use fetch() to request "../js/translations.json" asynchronously.
 */
const translationsPromise = fetch('../js/translations.json')
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Could not load translations.json file");
        }
        return response.json(); // Convert JSON file into a JavaScript object
    })
    .then(function (data) {
        translations = data;
        // Save to sessionStorage so subsequent pages load instantly
        sessionStorage.setItem("fixhub_translations_cache", JSON.stringify(data));

        // Apply translations once the DOM elements are ready
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", function () {
                applyLanguage(currentLang);
            });
        } else {
            applyLanguage(currentLang);
        }
        return data;
    })
    .catch(function (error) {
        console.error("Error loading translations:", error);
    });

// If cached data was already found in memory, apply it right away
if (Object.keys(translations).length > 0) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            applyLanguage(currentLang);
        });
    } else {
        applyLanguage(currentLang);
    }
}

/**
 * Function: applyLanguage(lang)
 * 
 * Purpose: This function is in charge of updating all visible text on the webpage.
 * 
 * Formula: We search for elements with the custom attribute [data-i18n-block]
 * in order to replace their text with the translation found in the JSON dictionary.
 * 
 * @param {string} lang - The language code to apply ("en" or "es")
 */
function applyLanguage(lang) {
    // If translations data is not yet loaded, wait
    if (!translations || !translations[lang]) {
        return;
    }

    currentLang = lang;

    // We save the selected language in localStorage so the browser remembers it
    localStorage.setItem("preferredLang", currentLang);

    // Update the HTML lang attribute
    document.documentElement.lang = currentLang;

    // 1. Update the language button text (if currently in English, button offers "Español")
    const langButton = document.getElementById("lang-btn");
    if (langButton) {
        if (translations[currentLang] && translations[currentLang]["buttonText"]) {
            langButton.textContent = translations[currentLang]["buttonText"];
        } else {
            langButton.textContent = (currentLang === "es") ? "English" : "Español";
        }
    }

    // 2. Update all text blocks that have the "data-i18n-block" attribute
    const textElements = document.querySelectorAll("[data-i18n-block]");
    textElements.forEach(function (element) {
        const key = element.getAttribute("data-i18n-block");
        const translatedValue = translations[currentLang][key];

        if (translatedValue !== undefined) {
            // If the translation contains HTML tags (like <b> or <br>), use innerHTML; otherwise textContent
            if (typeof translatedValue === "string" && translatedValue.includes("<")) {
                element.innerHTML = translatedValue;
            } else {
                element.textContent = translatedValue;
            }
        }
    });

    // 3. Update all input fields that have a "data-i18n-placeholder" attribute
    const inputElements = document.querySelectorAll("[data-i18n-placeholder]");
    inputElements.forEach(function (input) {
        const key = input.getAttribute("data-i18n-placeholder");
        const placeholderValue = translations[currentLang][key];
        if (placeholderValue !== undefined) {
            input.placeholder = placeholderValue;
        }
    });
}

/**
 * Function: toggleLanguage()
 * 
 * Purpose: This function is in charge of switching the language when the user clicks the button.
 * 
 * Formula: We check the current language so that if it is "en" we change to "es",
 * and if it is "es" we change to "en", then call applyLanguage().
 */
function toggleLanguage() {
    const nextLanguage = (currentLang === "en") ? "es" : "en";

    // If the JSON dictionary is still downloading, wait for it before toggling
    if (!translations || Object.keys(translations).length === 0) {
        if (translationsPromise) {
            translationsPromise.then(function () {
                applyLanguage(nextLanguage);
            });
            return;
        }
    }

    applyLanguage(nextLanguage);
}

// Make functions available globally so HTML onclick="toggleLanguage()" can trigger them
window.currentLang = currentLang;
window.applyLanguage = applyLanguage;
window.toggleLanguage = toggleLanguage;