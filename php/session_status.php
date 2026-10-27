<?php
/* SESSION_STATUS - PHP */
/* This script is in charge of telling JavaScript whether a user is logged in or not. */

//What is session_start() for? session_start() is a function used to start or resume a session so that PHP can read session data.
//We use session_start() in order to resume the current session so that we can check if a user is logged in.
session_start();

//What is header() for? header() is a function used to send raw HTTP headers to tell the browser what format of content to expect.
//We use header() in order to tell the browser to expect a JSON response instead of standard HTML.
header('Content-Type: application/json; charset=utf-8');

//What is json_encode() for? json_encode() is a function used to convert a PHP array into a JSON text string so that JavaScript can read it.
//What is isset() for? isset() is a function used to check if a variable or array key exists and is not null.
//What does null mean? null is a special data type that represents an empty or nonexistent value.
//This code allows us to package the login information into JSON format so that auth.js can show or hide the navigation buttons.
//isset($_SESSION['username']) returns true if the user is logged in, and false if they are not.
echo json_encode([
    'loggedIn' => isset($_SESSION['username']),
    'username' => $_SESSION['username'] ?? null
]);
?>
