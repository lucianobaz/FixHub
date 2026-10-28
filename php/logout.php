<?php
/* LOGOUT - PHP */
/* Here we have the file that closes the user session when they click the Logout button. */

//First we open the current session so PHP knows which user wants to log out.
//This function is also used on the files login.php, register.php, session_status.php, and welcome.php.
session_start();

//Here we use session_unset() to erase all the saved information inside $_SESSION (like $_SESSION['username'], which was taken from login.php).
session_unset();

//Then we use session_destroy() to completely close and delete the session on the server.
session_destroy();

//Now that the user is logged out, we send them back to login.html with a message saying they logged out successfully.
//header() and exit() are also used on the files login.php, register.php, and welcome.php.
header("Location: ../html/login.html?success=You have been successfully logged out.");

//We use exit() to stop running this file right after sending the user to the login page.
exit();
?>