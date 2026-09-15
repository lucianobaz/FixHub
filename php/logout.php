<?php
//Resume the current session so its login data can be removed.
session_start();

//Clear all session values and invalidate the session.
session_unset();
session_destroy();

//Send the user back to the login page with a confirmation message.
header("Location: ../html/login.html?success=You have been successfully logged out.");
exit();
?>