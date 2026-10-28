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

//What is fetch for? Is a method that is used to make requests to a server or load files.
//In this case, we use fetch() to request "translations.json" in order to load all the words in both languages.
fetch('../js/translations.json')
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
        //Once the translations are loaded, we apply the selected language to the page.
        applyLanguage(currentLang);
    })
    //What is .catch for? .catch is a method that is used to handle errors of a fetch request. it means "do something if something goes wrong".
    .catch(function (error) {
        //If there is an error loading translations, we show an error in the console.
        console.error("Error loading translations:", error);
    });

//------------------------------------------------------------------------------------------
//FUNCTION - This function is in charge of updating all visible text on the webpage.
//------------------------------------------------------------------------------------------
function applyLanguage(lang) {
    //If the translations data is not loaded yet, we stop here.
    if (!translations[lang]) {
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
        langButton.textContent = translations[currentLang]["buttonText"];
    }

    //We select all elements with data-i18n-block in order to replace their text with the selected language.
    //What is document.querySelectorAll for? Is a method that is used to select all elements that match a specific CSS selector.
    const textElements = document.querySelectorAll("[data-i18n-block]");

    //What is forEach for? Is a method used to loop through every item in a list.
    textElements.forEach(function (element) {
        const key = element.getAttribute("data-i18n-block");
        const translatedValue = translations[currentLang][key];

        if (translatedValue !== undefined) {
            //What is innerHTML for? Is a property used to change or insert text and HTML tags inside an element.
            element.innerHTML = translatedValue;
        }
    });
}

//------------------------------------------------------------------------------------------
//FUNCTION - Switches language between English and Spanish when the user clicks the button.
//------------------------------------------------------------------------------------------
function toggleLanguage() {
    //If current language is English, we switch to Spanish. If it is Spanish, we switch to English.
    const nextLanguage = (currentLang === "en") ? "es" : "en";
    applyLanguage(nextLanguage);
}