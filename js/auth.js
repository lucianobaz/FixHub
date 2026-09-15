document.addEventListener('DOMContentLoaded', async () => {
    //Find the login and logout links in the current page navigation.
    const loginButtons = document.querySelectorAll('.login-btn');
    const logoutButtons = document.querySelectorAll('.logout-btn');

    //Show only the navigation link that matches the current session state.
    const setNavigation = (loggedIn) => {
        loginButtons.forEach((button) => {
            //Hide Login when the user is already authenticated.
            button.hidden = loggedIn;
            button.style.display = loggedIn ? 'none' : 'inline';
        });
        logoutButtons.forEach((button) => {
            //Show Logout only when the user has an active session.
            button.hidden = !loggedIn;
            button.style.display = loggedIn ? 'inline' : 'none';
        });
    };

    try {
        //Ask the PHP endpoint whether the current browser session is active.
        const response = await fetch('../php/session_status.php', {
            credentials: 'same-origin',
            headers: { Accept: 'application/json' }
        });

        if (!response.ok) {
            //Treat an unsuccessful response as an unauthenticated session.
            throw new Error('Unable to read session status');
        }

        //Read the session state and update the navigation links.
        const session = await response.json();
        setNavigation(session.loggedIn);
    } catch (error) {
        //Keep Login visible if the session check cannot be completed.
        setNavigation(false);
    }
});
