<?php
/* LOGIN - PHP */
/* Here we have the file that checks the username and password to let the user log into the website. */

//Here we start the session so the website can remember who is logged in while browsing different pages.
//This function is also used on the files logout.php, session_status.php, and welcome.php.
session_start();

//Here we bring in the code from "db_connect.php" so we can use the $conn variable (taken from db_connect.php) to talk to our database.
//This require_once statement is also used on the file register.php.
require_once 'db_connect.php';

//We check if the user arrived here by clicking the submit button on the login form in login.html (which sends data using POST).
//This same condition is also used on the file register.php.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //Here we create 2 variables to save the username and password that the user typed into the login form (taken from login.html).
    //$_POST is also used on the file register.php to get the registration form data.
    $input_user = $_POST['username'];
    $input_pass = $_POST['password'];


    //We create a variable with the SQL message asking MySQL to look for a user with that exact username.
    //We put a question mark (?) so the code knows something exists and doesn't give the value directly.
    $sql = "SELECT * FROM users WHERE username = ?";


    //Here we prepare the SQL search using our database connection ($conn, taken from db_connect.php) and save it in the variable $stmt.
    //prepare(), bind_param(), and execute() are also used on the file register.php.
    $stmt = $conn->prepare($sql);


    //Now we replace the question mark (?) with the actual username stored in $input_user ("s" means it is a text/string).
    $stmt->bind_param("s", $input_user);


    //Here we run the search in the database and save the answer we get back inside the variable $result.
    $stmt->execute();
    $result = $stmt->get_result();

    
    //We check if the database found 1 user with that username.
    if ($result->num_rows === 1) {
        //Here we save all the information of that user (like their username and secret password) into the variable $user.
        $user = $result->fetch_assoc();

        //Here we use password_verify() to check if the password the user typed ($input_pass) matches the encrypted password saved in the database (which was encrypted in register.php).
        if (password_verify($input_pass, $user['password'])) {
            //If the password is correct, we save their username inside $_SESSION so the rest of the website knows they are logged in.
            //This $_SESSION['username'] variable is later taken and used on the files session_status.php, welcome.php, and logout.php.
            $_SESSION['username'] = $user['username'];

            //Then we send the user to the home page (index.html) and add their username to the link so we can show a welcome message.
            //header() and exit() are also used on the files register.php, logout.php, and welcome.php.
            header("Location: ../html/index.html?welcome=" . rawurlencode($user['username']));
            //We use exit() to stop the code here because the user is already leaving this page.
            exit();
        }
    }
    
    //If the username was not found or the password was wrong, we send the user back to login.html with an error message in the link.
    header("Location: ../html/login.html?error=Invalid username or password");
    exit();
}
?>