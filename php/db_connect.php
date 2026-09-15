<?php

$servername = "localhost";
$username = "root";
$password = ""; //Default XAMPP database password.
$dbname = "registration"; //Database that stores the users table.

//Open one database connection that the other PHP files can reuse.
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    //Stop the request if the application cannot reach MySQL.
    die("Connection failed: " . $conn->connect_error);
}
?>