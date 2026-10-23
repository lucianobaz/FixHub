// Global translation state
let translations = {};
let currentLang = "en";

// Retrieve saved language from localStorage, defaulting to "en"
try {
    const savedLang = localStorage.getItem("preferredLang");
    if (savedLang === "es" || savedLang === "en") {
        currentLang = savedLang;
    }
} catch (e) {
    console.warn("Unable to access localStorage:", e);
}

// Set html lang attribute as early as possible
if (document.documentElement) {
    document.documentElement.lang = currentLang;
}

// Attempt to load cached translations from sessionStorage for instant section switching
try {
    const cachedTranslations = sessionStorage.getItem("fixhub_translations_cache");
    if (cachedTranslations) {
        translations = JSON.parse(cachedTranslations);
    }
} catch (e) {
    // Ignore cache retrieval errors
}

// Resolve the path to translations.json relative to translations.js or fallback to '../js/translations.json'
const jsonUrl = (document.currentScript && document.currentScript.src)
    ? new URL('translations.json', document.currentScript.src).href
    : '../js/translations.json';

// Fetch the external JSON file when the script loads
const translationsPromise = fetch(jsonUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        translations = data;
        try {
            sessionStorage.setItem("fixhub_translations_cache", JSON.stringify(data));
        } catch (e) {
            // Ignore quota errors
        }
        console.log("Translations loaded successfully.");

        // Apply translations on load once JSON is ready
        applyWhenDomReady(currentLang);
        return data;
    })
    .catch(error => {
        console.error("Failed to load translation file:", error);
    });

// Helper to ensure DOM is ready before applying translations
function applyWhenDomReady(lang) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            applyLanguage(lang);
        }, { once: true });
    } else {
        applyLanguage(lang);
    }
}

// If we already have translations in memory from sessionStorage, apply immediately once DOM is ready
if (Object.keys(translations).length > 0) {
    applyWhenDomReady(currentLang);
}

// Apply selected language to the DOM and persist preference
function applyLanguage(lang) {
    if (!translations || Object.keys(translations).length === 0) {
        return;
    }

    if (!translations[lang]) {
        console.warn(`Translation dictionary for "${lang}" not found.`);
        return;
    }

    currentLang = lang;

    // Persist choice across page navigations
    try {
        localStorage.setItem("preferredLang", currentLang);
    } catch (e) {
        console.warn("Unable to save preferredLang to localStorage:", e);
    }

    // Update html lang attribute
    document.documentElement.lang = currentLang;

    // Update toggle button text
    const buttons = document.querySelectorAll("#lang-btn, #langButton, .lang-btn");
    buttons.forEach(btn => {
        if (translations[currentLang] && translations[currentLang]["buttonText"]) {
            btn.textContent = translations[currentLang]["buttonText"];
        } else {
            btn.textContent = (currentLang === "es") ? "English" : "Español";
        }
    });

    // Update all text blocks with data-i18n-block
    const blocks = document.querySelectorAll("[data-i18n-block]");
    blocks.forEach(block => {
        const key = block.getAttribute("data-i18n-block");
        if (translations[currentLang] && translations[currentLang][key] !== undefined) {
            const val = translations[currentLang][key];
            if (typeof val === "string" && val.includes("<")) {
                block.innerHTML = val;
            } else {
                block.textContent = val;
            }
        }
    });

    // Update all input placeholders with data-i18n-placeholder
    const placeholders = document.querySelectorAll("[data-i18n-placeholder]");
    placeholders.forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[currentLang] && translations[currentLang][key] !== undefined) {
            el.placeholder = translations[currentLang][key];
        }
    });

    // Dispatch event in case other scripts need to react
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang: currentLang } }));
}

// Triggered when user clicks the toggle button
function toggleLanguage() {
    const nextLang = (currentLang === "en") ? "es" : "en";

    // If translations haven't finished loading yet, wait for promise
    if (!translations || Object.keys(translations).length === 0) {
        if (translationsPromise) {
            translationsPromise.then(() => {
                applyLanguage(nextLang);
            }).catch(() => {
                alert("Translation data is still loading. Please try again in a moment.");
            });
            return;
        }
    }

    applyLanguage(nextLang);
}

// Expose functions globally
window.currentLang = currentLang;
window.applyLanguage = applyLanguage;
window.toggleLanguage = toggleLanguage;