<?php
/* LOGOUT - PHP */
/* This script is in charge of ending the user session and logging them out securely. */

//What is session_start() for? session_start() is a function used to start or resume a session so that PHP can access and modify session variables.
//We use session_start() in order to resume the current session so that its login data can be accessed and removed.
session_start();

//What is session_unset() for? session_unset() is a function used to free all session variables currently registered in $_SESSION.
//We use session_unset() in order to clear all stored session values.
session_unset();

//What is session_destroy() for? session_destroy() is a function used to completely destroy all session data registered on the server.
//This function allows us to destroy the active session on the server so that the user is completely logged out.
session_destroy();

//What is header() for? header() is a function used to send raw HTTP headers to redirect the browser to another URL.
//We use header() in order to redirect the user back to the login page with a confirmation message so that they know logout was successful.
header("Location: ../html/login.html?success=You have been successfully logged out.");

//What is exit() for? exit() is a function used to immediately terminate the script so that no further code runs after a redirect.
//We use exit() in order to stop executing the script immediately after redirecting.
exit();
?>