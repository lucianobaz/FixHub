<?php
/* SESSION_STATUS - PHP */
/* Here we have a file that tells our JavaScript code (on the file auth.js) if there is a user logged in right now or not. */

//First we open the current session so we can check if there is a username saved inside it.
//This function is also used on the files login.php, register.php, logout.php, and welcome.php.
session_start();

//Here we tell the browser that this file is going to answer using JSON format (which is a text format that JavaScript understands easily) instead of a normal HTML page.
//header() is also used on the files login.php, register.php, logout.php, and welcome.php.
header('Content-Type: application/json; charset=utf-8');

//Here we use json_encode() to send a message to JavaScript (used on the file auth.js) with 2 pieces of information:
//'loggedIn': uses isset() to check if $_SESSION['username'] (taken from login.php) exists (gives true if logged in, or false if not). isset() is also used on the file welcome.php.
//'username': sends the name of the logged-in user (taken from login.php), or null (empty) if nobody is logged in.
echo json_encode([
    'loggedIn' => isset($_SESSION['username']),
    'username' => $_SESSION['username'] ?? null
]);
?>
