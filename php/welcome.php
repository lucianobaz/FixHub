<?php
//Resume the session so this page can verify the logged-in user.
session_start();

//Block access and send the visitor to login if no user is stored in the session.
if (!isset($_SESSION['username'])) {
    header("Location: ../html/login.html?error=Please log in first");
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
        <!-- Escape the username before displaying it in the page. -->
        <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
        <p><a href="../html/index.html">Go to Home</a></p>
        <p><a href="logout.php" style="color: red; font-weight: bold;">Logout</a></p>
    </div>
</body>
</html>