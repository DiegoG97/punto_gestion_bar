<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "tienda_hotel";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
