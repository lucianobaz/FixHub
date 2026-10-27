//TRANSLATIONS - JAVASCRIPT
//This script is in charge of changing the language of the website between English and Spanish.

/* -------------------------------------------------------------- */
/* KEYWORDS EXPLANATION: */
/* -------------------------------------------------------------- */

//What is let for? let is a keyword used to declare a variable that can be changed later.
//What is const for? const is a keyword that is used to declare a variable that is constant, meaning it cannot be changed.


//We declare variables to store the dictionary data and the current language.
let translations = {};
let currentLang = "en"; //Default language is English


//We check localStorage in order to see if the user previously selected Spanish or English.
//What is localStorage for? localStorage is a browser tool used to save data on the computer so that information stays saved even if you close or change pages.
const savedLanguage = localStorage.getItem("preferredLang");
if (savedLanguage === "es" || savedLanguage === "en") {
    currentLang = savedLanguage;
}

//We check sessionStorage to load the translations. 
//What is JSON.parse for? It is a method used to convert a JSON string into a JavaScript object.
//what is sessionStorage for? sessionStorage is similar to localStorage, but data is only saved while the current browser tab is open.
const cachedData = sessionStorage.getItem("fixhub_translations_cache");
if (cachedData) {
    try {
        translations = JSON.parse(cachedData);
    } catch (e) {
        translations = {};
    }
}

//What is fetch for? Is a method that is used to make requests to a server or load files.
//In this case, we use fetch() to request "translations.json" in order to load all the words in both languages.
const translationsFile = fetch('../js/translations.json')

    //What is .then for? .then is: do something after the previous thing is done.   
    .then(function (response) {
        //If the file cannot be loaded, we throw an error.
        if (!response.ok) {
            throw new Error("Could not load translations.json file");
        }
        //This converts the JSON response into a JavaScript object.
        return response.json();
    })
    .then(function (data) {
        translations = data;
        //What is JSON.stringify for? It is a method used to convert a JavaScript object into a JSON text string.
        //We save the dictionary in sessionStorage so that other pages load instantly without downloading it again.
        sessionStorage.setItem("fixhub_translations_cache", JSON.stringify(data));

        //We wait for HTML elements to load before applying the language.
        applyWhenReady();
        return data;
    })

    //What is .catch for? .catch is a method that is used to handle errors of a fetch request. it means "do something if something goes wrong".
    .catch(function (error) {
        //If there is an error loading translations, we show an error in the console.
        console.error("Error loading translations:", error);
    });

//------------------------------------------------------------------------------------------
//FUNCTION - This function is in charge of waiting for the HTML to be ready before applying translations.
//------------------------------------------------------------------------------------------
function applyWhenReady() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            applyLanguage(currentLang);
        });
    } else {
        applyLanguage(currentLang);
    }
}

//If translations were already saved in cache, we apply them immediately once the page is ready.
if (Object.keys(translations).length > 0) {
    applyWhenReady();
}

//------------------------------------------------------------------------------------------
//FUNCTION - This function is in charge of updating all visible text on the webpage.
//------------------------------------------------------------------------------------------
function applyLanguage(lang) {
    //If the translations data is not loaded yet, we stop here.
    if (!translations || !translations[lang]) {
        return;
    }

    currentLang = lang;

    //We save the chosen language in localStorage so that the browser remembers it.
    localStorage.setItem("preferredLang", currentLang);

    //We update the HTML lang attribute.
    document.documentElement.lang = currentLang;

    //We update the text of the language button (if English, it says "Español"; if Spanish, it says "English").
    //What is document.getElementById for? Is a method that is used to select one specific element by its unique id.
    const langButton = document.getElementById("lang-btn");
    if (langButton) {
        if (translations[currentLang]["buttonText"]) {
            langButton.textContent = translations[currentLang]["buttonText"];
        } else {
            langButton.textContent = (currentLang === "es") ? "English" : "Español";
        }
    }

    //We select all elements with data-i18n-block in order to replace their text with the selected language.
    //What is document.querySelectorAll for? Is a method that is used to select all elements that match a specific CSS selector.
    const textElements = document.querySelectorAll("[data-i18n-block]");

    //What is forEach for? Is a method used to loop through every item in a list.
    textElements.forEach(function (element) {
        const key = element.getAttribute("data-i18n-block");
        const translatedValue = translations[currentLang][key];

        if (translatedValue !== undefined) {
            //If the translated text has HTML tags (like <b> or <br>), we use innerHTML; otherwise textContent.
            if (typeof translatedValue === "string" && translatedValue.includes("<")) {
                //What is innerHTML for? Is a property used to change or insert HTML tags and text inside an element.
                element.innerHTML = translatedValue;
            } else {
                //What is textContent for? Is a property used to change or read the plain text inside an HTML element.
                element.textContent = translatedValue;
            }
        }
    });

    //We select all input fields with data-i18n-placeholder in order to update their placeholder text.
    const inputElements = document.querySelectorAll("[data-i18n-placeholder]");
    //What is forEach for? Is a method used to loop through every item in a list.
    inputElements.forEach(function (input) {
        const key = input.getAttribute("data-i18n-placeholder");
        const placeholderValue = translations[currentLang][key];
        if (placeholderValue !== undefined) {
            input.placeholder = placeholderValue;
        }
    });
}
//------------------------------------------------------------------------------------------
//FUNCTION - Switches language between English and Spanish when the user clicks the button.
//------------------------------------------------------------------------------------------
function toggleLanguage() {
    //If current language is English, we switch to Spanish. If it is Spanish, we switch to English.
    const nextLanguage = (currentLang === "en") ? "es" : "en";

    //If the dictionary is still downloading, we wait for it before switching.
    if (!translations || Object.keys(translations).length === 0) {
        if (translationsFile) {
            translationsFile.then(function () {
                applyLanguage(nextLanguage);
            });
            return;
        }
    }

    applyLanguage(nextLanguage);
}