/* AUTH - JAVASCRIPT */
/* This script is in charge of checking if the user is logged in. */

/* -------------------------------------------------------------- */
/* KEYWORDS EXPLANATION: */
/* -------------------------------------------------------------- */

//what is const for? const is a keyword that is used to declare a variable that is constant, meaning it cannot be changed.


//what is addEventListener for? Is a method that is used to wait for an event to happen, then do something.
document.addEventListener('DOMContentLoaded', function () {
    //We select all Login and Logout buttons from the navigation bar.
    //what is document.querySelectorAll for? Is a method that is used to select all elements that match a specific CSS selector.
    const loginButtons = document.querySelectorAll('.login-btn');
    const logoutButtons = document.querySelectorAll('.logout-btn');

    //------------------------------------------------------------------------------------------
    //FUNCTION - This function is in charge of showing or hiding the navigation buttons.
    //------------------------------------------------------------------------------------------
    //If isLoggedIn is true: we hide Login and show Logout.
    //If isLoggedIn is false: we show Login and hide Logout.
    function updateNavigation(isLoggedIn) {
        //Configure the Login button
        loginButtons.forEach(function (button) {
            button.hidden = isLoggedIn;
            button.style.display = isLoggedIn ? 'none' : 'inline';
        });

        //Configure the Logout button
        logoutButtons.forEach(function (button) {
            button.hidden = !isLoggedIn;
            button.style.display = isLoggedIn ? 'inline' : 'none';
        });
    }

    //what is fetch for? Is a method that is used to make requests to a server. 
    //We use fetch() to call "session_status.php" so that PHP tells us if someone is logged in.
    fetch('../php/session_status.php')
        //what is .then for? .then is: do something after the previous thing is done.
        .then(function (response) {
            //If the response failed, we throw an error.
            if (!response.ok) {
                throw new Error('Connection failed');
            }
            //what does JSON stand for? JavaScript Object Notation, which is just a way to format data.
            //This converts the PHP answer into JSON format.
            return response.json();
        })
        .then(function (data) {
            //We send the answer (true or false) to updateNavigation, the function that is in charge of showing or hiding the navigation buttons.
            updateNavigation(data.loggedIn);
        })
        //what is .catch for? .catch is a method that is used to handle errors of a fetch request. it means "do something if something goes wrong".
        .catch(function (error) {
            //If there is an error, we show the Login button by default and show an error message in the console.
            console.log('Session check status:', error.message);
            updateNavigation(false);
        });
});
