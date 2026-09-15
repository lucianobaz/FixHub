<?php
//Start or resume the browser session used to remember the logged-in user.
session_start();

//Load the shared MySQL connection.
require_once 'db_connect.php';

//Process credentials only when the form was submitted with POST.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_user = $_POST['username'];
    $input_pass = $_POST['password'];

    //Find the account that matches the submitted username.
    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $input_user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        //Compare the submitted password with the secure hash stored in the database.
        //Verifies password against the hash using the same algorithm and salt that was used to create the hash.
        if (password_verify($input_pass, $user['password'])) {
            //Store the username in the session so other pages know the user is logged in.
            $_SESSION['username'] = $user['username'];
            //Return to the home page after a successful login.
            header("Location: ../html/index.html?welcome=" . rawurlencode($user['username']));
            exit();
        }
    }
    
    //Return the same generic error for an unknown username or incorrect password.
    header("Location: ../html/login.html?error=Invalid username or password");
    exit();
}
?>