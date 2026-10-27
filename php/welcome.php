<?php
/* WELCOME - PHP */
/* This script is in charge of protecting the welcome page and greeting the authenticated user. */

//What is session_start() for? session_start() is a function used to start or resume a session so that PHP can read the logged-in user's data.
//We use session_start() in order to resume the current session so that we can check if the user is authenticated.
session_start();

//What is isset() for? isset() is a function used to check if a variable or session key exists and is not null.
//This condition allows us to protect this page from unauthorized visitors.
//If the user is not logged in: we redirect them to login.html with an error message.
if (!isset($_SESSION['username'])) {
    //What is header() for? header() is a function used to send raw HTTP headers to redirect the browser to another URL.
    header("Location: ../html/login.html?error=Please log in first");
    //What is exit() for? exit() is a function used to immediately terminate the script so that no further code runs after a redirect.
    //We use exit() in order to stop the rest of the page from loading for unauthenticated visitors.
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Welcome</title>
    <link rel="stylesheet" href="../css/myStyles.css">
</head>
<body>
    <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
        <!-- What is htmlspecialchars() for? htmlspecialchars() is a function used to convert special characters into HTML entities to prevent XSS attacks. -->
        <!-- We use htmlspecialchars() in order to sanitize the username before displaying it so that malicious scripts cannot be injected (XSS prevention). -->
        <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
        <p><a href="../html/index.html">Go to Home</a></p>
        <p><a href="logout.php" style="color: red; font-weight: bold;">Logout</a></p>
    </div>
</body>
</html>