<?php
//Resume the session so the frontend can read the current login state.
session_start();

//Tell the browser to expect a JSON response instead of an HTML page.
header('Content-Type: application/json; charset=utf-8');

//Return only the information needed to update the Login and Logout links.
echo json_encode([
    'loggedIn' => isset($_SESSION['username']),
    'username' => $_SESSION['username'] ?? null
]);
