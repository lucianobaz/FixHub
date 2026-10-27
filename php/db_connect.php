<?php
/* DB_CONNECT - PHP */
/* This script is in charge of connecting PHP to our MySQL database. */

//We define the server connection credentials to connect to our local MySQL database.
$servername = "localhost";
$username = "root";
$password = ""; //Default XAMPP database password (empty by default)
$dbname = "registration"; //Database that stores the users table

//What is mysqli for? mysqli is an extension in PHP used to communicate with and run queries on a MySQL database.
//What is new for? new is a keyword used to create a new instance (object) of a class.
//We use new mysqli() in order to open a database connection so that our other PHP scripts can reuse it to query data.
$conn = new mysqli($servername, $username, $password, $dbname);

//This condition allows us to check if the connection failed so that we can handle the error safely.
//If there is a connection error: we stop the script and display the error message.
if ($conn->connect_error) {
    //What is die() for? die() is a function used to print an error message and immediately stop the execution of the script.
    //We use die() in order to stop the request if the application cannot reach MySQL.
    die("Connection failed: " . $conn->connect_error);
}
?>
