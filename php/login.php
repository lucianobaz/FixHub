<?php
/* LOGIN - PHP */
/* This script is in charge of checking user credentials and logging users into their session. */

//What is session_start() for? session_start() is a function used to start or resume a session so that the server remembers user information across different pages.
//We use session_start() in order to start or resume a browser session so that the server remembers the logged-in user.
session_start();

//What is require_once for? require_once is a statement used to include and run another PHP file once; if the file is missing, the script stops.
//We use require_once in order to load "db_connect.php" so that this script can reuse our shared MySQL connection.
require_once 'db_connect.php';

//What is $_SERVER["REQUEST_METHOD"] for? $_SERVER is a superglobal array that stores server information, and REQUEST_METHOD tells us if the form was sent via GET or POST.
//If the form was submitted using the POST method: we process the user credentials.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //What is $_POST for? $_POST is a superglobal array used to collect form data sent securely with the HTTP POST method without showing it in the URL.
    //We store the submitted username and password in variables.
    $input_user = $_POST['username'];
    $input_pass = $_POST['password'];

    //We write a query with a placeholder (?) in order to find the account that matches the submitted username.
    $sql = "SELECT * FROM users WHERE username = ?";

    //What is prepare() for? prepare() is a method used to write SQL queries with placeholders (?) so that malicious user input cannot inject SQL commands (SQL Injection).
    //This prepared statement allows us to separate SQL code from user data so that SQL Injection attacks are prevented.
    $stmt = $conn->prepare($sql);

    //What is bind_param() for? bind_param() is a method used to attach real variables to the query placeholders ("s" indicates string format).
    //We use bind_param() in order to link $input_user to the placeholder ("s" stands for string).
    $stmt->bind_param("s", $input_user);

    //We execute the query and retrieve the results from the database.
    $stmt->execute();
    $result = $stmt->get_result();

    //If exactly one matching user is found in the database: we check their password.
    if ($result->num_rows === 1) {
        //What is fetch_assoc() for? fetch_assoc() is a method used to fetch a result row as an associative array where keys match column names.
        $user = $result->fetch_assoc();

        //What is password_verify() for? password_verify() is a function used to check if a plain password matches an encrypted password hash.
        //This function allows us to compare the submitted password with the secure hash stored in the database so that passwords are never exposed.
        //If the password matches the hash: we authenticate the user and start their session.
        if (password_verify($input_pass, $user['password'])) {
            //What is $_SESSION for? $_SESSION is a superglobal array used to store user variables on the server during their visit.
            //We save the username in $_SESSION so that other pages know the user is logged in.
            $_SESSION['username'] = $user['username'];

            //What is header() for? header() is a function used to send raw HTTP headers to redirect the browser to another URL.
            //We use header() in order to redirect the user to the home page with a welcome parameter so that the website confirms successful login.
            header("Location: ../html/index.html?welcome=" . rawurlencode($user['username']));
            //What is exit() for? exit() is a function used to immediately terminate the script so that no further code runs after a redirect.
            //We use exit() in order to stop executing the script immediately after redirecting.
            exit();
        }
    }
    
    //If the username does not exist or the password was incorrect: we redirect to login.html with an error message so that the user receives feedback.
    header("Location: ../html/login.html?error=Invalid username or password");
    exit();
}
?>