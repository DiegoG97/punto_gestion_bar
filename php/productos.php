<?php
include "db.php";
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $cantidad = $_POST['cantidad'];

    $stmt = $conn->prepare("INSERT INTO productos (nombre, precio_unitario, cantidad) VALUES (?, ?, ?)");
    $stmt->bind_param("sdi", $nombre, $precio, $cantidad);
    $stmt->execute();

    echo json_encode(["status" => "ok"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM productos ORDER BY id DESC");
    $productos = [];

    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }

    echo json_encode($productos);
}
?>
