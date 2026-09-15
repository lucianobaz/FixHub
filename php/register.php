<?php
//Start the session because registration redirects back to the authentication pages.
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Reuse the shared database connection.
require_once 'db_connect.php';

//Process registration only when the form was submitted with POST.
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    //Read the submitted username and password. The password is kept unchanged before hashing.
    $user = htmlspecialchars($_POST['username']);
    $pass = $_POST['password'];

    $hashed_password = password_hash($pass, PASSWORD_BCRYPT);

    //Use a prepared statement so user input cannot change the SQL query.
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?,?)");
    $stmt->bind_param("ss", $user, $hashed_password);

    if ($stmt->execute()) {
        //Registration succeeded, so send the user to log in.
        header("Location: ../html/login.html?success=Registration successful! Please log in.");
        exit();
    } else {
        //Return to registration if the insert fails, for example because the username exists.
        header("Location: ../html/register.html?error=Registration failed. Username may exist.");
        exit();
    }

    $stmt->close();
    $conn->close();
}
?>