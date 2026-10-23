//This script is in charge of checking if the user is logged in.
//We use fetch() to ask PHP if a user is logged in in order to show Login or Logout.

document.addEventListener('DOMContentLoaded', function () {
    //We select all Login and Logout buttons from the navigation bar.
    const loginButtons = document.querySelectorAll('.login-btn');
    const logoutButtons = document.querySelectorAll('.logout-btn');

    //This function is in charge of showing or hiding the navigation buttons.
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

    //We use fetch() to call "session_status.php" so that PHP tells us if someone is logged in.
    fetch('../php/session_status.php')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Connection failed');
            }
            //This allows us to convert the PHP answer into JSON format.
            return response.json();
        })
        .then(function (data) {
            //We send the answer (true or false) to updateNavigation.
            updateNavigation(data.loggedIn);
        })
        .catch(function (error) {
            //If there is an error, we show the Login button by default.
            console.log('Session check status:', error.message);
            updateNavigation(false);
        });
});
