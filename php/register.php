<?php
/* REGISTER - PHP */
/* Here we have the file that creates a new account and saves the user in the MySQL database. */

//We start the session at the beginning of the file.
//This function is also used on the files login.php, logout.php, session_status.php, and welcome.php.
session_start();

//These 3 lines tell PHP to show any errors on the screen in case something goes wrong while we are testing the code.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Here we bring in "db_connect.php" so we can use the $conn variable (taken from db_connect.php) to connect to our database.
//This require_once statement is also used on the file login.php.
require_once 'db_connect.php';

//We check if the user sent the registration form in register.html using the POST method.
//This same condition is also used on the file login.php.
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    //Here we create the variable $user with the username from the form, using htmlspecialchars() to clean it so nobody can type malicious HTML code.
    //htmlspecialchars() is also used on the file welcome.php, and $_POST is also used on the file login.php.
    $user = htmlspecialchars($_POST['username']);
    //We create the variable $pass to save the password that the user typed in the form.
    $pass = $_POST['password'];

    //Here we create a new variable called $hashed_password that scrambles (encrypts) the password using PASSWORD_BCRYPT so nobody can read the real password in the database.
    //Later, on the file login.php, we check this encrypted password using password_verify().
    $hashed_password = password_hash($pass, PASSWORD_BCRYPT);

    //We prepare the SQL command using $conn (taken from db_connect.php) to add a new row into the "users" table with 2 question marks (?,?) where the username and password will go.
    //prepare(), bind_param(), and execute() are also used on the file login.php.
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?,?)");

    //Here we replace the 2 question marks (?,?) with the values of our variables $user and $hashed_password ("ss" means both values are text/strings).
    $stmt->bind_param("ss", $user, $hashed_password);

    //We run the command in MySQL, and check if the new user was saved without problems.
    if ($stmt->execute()) {
        //If everything went well, we send the user to login.html with a message telling them they can now log in.
        //header() and exit() are also used on the files login.php, logout.php, and welcome.php.
        header("Location: ../html/login.html?success=Registration successful! Please log in.");
        //We stop the code right here after sending the user to the login page.
        exit();
    } else {
        //If there was an error (for example, if that username is already taken), we send them back to register.html with an error message.
        header("Location: ../html/register.html?error=Registration failed. Username may exist.");
        exit();
    }

    //Finally, we close the search and the database connection because we don't need them anymore.
    $stmt->close();
    $conn->close();
}
?>