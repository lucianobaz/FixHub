<?php
/* DB_CONNECT - PHP */
/* Here we have the file that connects our website to the MySQL database. */

//With the $ symbol we create variables in PHP.
//Here we are creating 4 variables to save the information needed to enter our local database:

$servername = "localhost"; //The name of the server (localhost because it runs on our computer)
$username = "root";        //The default user in XAMPP
$password = "";            //The password is empty by default in XAMPP
$dbname = "registration";  //The name of our database where the users table is saved

//We are creating a new variable called $conn that opens a connection to MySQL using the values of the 4 variables above (servername, username, password, and dbname).
//This variable $conn is later taken and used on the files login.php and register.php to talk to the database.
$conn = new mysqli($servername, $username, $password, $dbname);

//We check if there was any problem when trying to connect to the database.
if ($conn->connect_error) {
    //If the connection fails, we use die() to stop the code right here and show a message on the screen with the error.
    die("Connection failed: " . $conn->connect_error);
}
?>
