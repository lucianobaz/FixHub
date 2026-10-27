<?php
/* REGISTER - PHP */
/* This script is in charge of registering new users into the database with encrypted passwords. */

//What is session_start() for? session_start() is a function used to start or resume a session so that PHP can manage user state across pages.
//We use session_start() in order to start or resume a session so that registration can redirect back to the authentication pages with messages.
session_start();

//We configure PHP in order to display all errors so that we can easily debug issues during development.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//What is require_once for? require_once is a statement used to include and run another PHP file once; if the file is missing, the script stops.
//We use require_once in order to load "db_connect.php" so that this script can reuse our shared MySQL database connection.
require_once 'db_connect.php';

//If the form was submitted using the POST method: we process the registration data.
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    //What is htmlspecialchars() for? htmlspecialchars() is a function used to convert special HTML characters (like < and >) into harmless HTML entities to prevent Cross-Site Scripting (XSS) attacks.
    //What is $_POST for? $_POST is a superglobal array used to collect form data sent securely with the HTTP POST method.
    //We use htmlspecialchars() in order to sanitize the submitted username so that attackers cannot inject malicious HTML or JavaScript code.
    $user = htmlspecialchars($_POST['username']);
    //We read the raw password from the form before hashing it.
    $pass = $_POST['password'];

    //What is password_hash() for? password_hash() is a function used to create a secure, one-way encrypted password hash using algorithms like BCRYPT.
    //This hash function allows us to encrypt the user passwords so that their data is secure.
    $hashed_password = password_hash($pass, PASSWORD_BCRYPT);

    //What is prepare() for? prepare() is a method used to write an SQL statement with placeholders (?) so that user input cannot alter the database query structure (SQL Injection).
    //This prepared statement allows us to insert new users safely so that user input cannot alter our SQL query.
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?,?)");

    //What is bind_param() for? bind_param() is a method used to bind variables to the placeholders in a prepared statement ("ss" means two strings).
    //We use bind_param() in order to link $user and $hashed_password to the placeholders ("ss" means both parameters are strings).
    $stmt->bind_param("ss", $user, $hashed_password);

    //What is execute() for? execute() is a method used to run the prepared statement in MySQL.
    //If the user was saved successfully in the database: we redirect to login.html with a success message so that the user can now log in.
    if ($stmt->execute()) {
        //What is header() for? header() is a function used to send raw HTTP headers to redirect the browser to another page.
        header("Location: ../html/login.html?success=Registration successful! Please log in.");
        //What is exit() for? exit() is a function used to terminate script execution immediately after a redirect.
        exit();
    } else {
        //If the query failed (for example, if the username already exists): we redirect back to register.html with an error message.
        header("Location: ../html/register.html?error=Registration failed. Username may exist.");
        exit();
    }

    //We close the statement and the database connection in order to free server resources.
    $stmt->close();
    $conn->close();
}
?>