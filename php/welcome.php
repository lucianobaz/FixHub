<?php
/* WELCOME - PHP */
/* Here we have a welcome page that only logged-in users are allowed to see. */

//We open the current session so we can check if the user is logged in.
//This function is also used on the files login.php, register.php, logout.php, and session_status.php.
session_start();

//Here we check if $_SESSION['username'] (which is taken from login.php) does NOT exist (the ! symbol means NOT).
//isset() is also used on the file session_status.php.
//If there is no username saved in the session, it means the visitor has not logged in yet.
if (!isset($_SESSION['username'])) {


    //So we send them back to login.html with a message asking them to log in first.
    //header() and exit() are also used on the files login.php, register.php, and logout.php.
    
    header("Location: ../html/login.html?error=Please log in first");
    //And we use exit() to stop the rest of this page from loading.
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
        <!--Here we show $_SESSION['username'] (taken from login.php) on the screen using echo, and htmlspecialchars() (also used on the file register.php) makes sure the text is safe to display in HTML.-->
        <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
        <p><a href="../html/index.html">Go to Home</a></p>
        <p><a href="logout.php" style="color: red; font-weight: bold;">Logout</a></p>
    </div>
</body>
</html>