<?php
include "db.php";
header('Content-Type: application/json');

$comprador = $_POST['comprador'] ?? '';
$total = $_POST['total_gastado'] ?? 0;
$productos = $_POST['productos'] ?? [];

if (!$comprador || !$total || empty($productos)) {
    echo json_encode([
        "exito" => false,
        "error" => "Faltan datos para registrar la compra"
    ]);
    exit;
}

// Armar descripción y actualizar inventario
$descripcion = [];
foreach ($productos as $prod) {
    $producto_id = $prod['id'];
    $nombre = $prod['nombre'];
    $cantidad = $prod['cantidad'];

    $descripcion[] = "$nombre x$cantidad";

    // Sumar al inventario
    $stmt = $conn->prepare("UPDATE productos SET cantidad = cantidad + ? WHERE id = ?");
    $stmt->bind_param("ii", $cantidad, $producto_id);
    $stmt->execute();
}

// Insertar en tabla compras
$descText = implode(", ", $descripcion);
$stmt = $conn->prepare("INSERT INTO compras (comprador, descripcion, total) VALUES (?, ?, ?)");
$stmt->bind_param("ssd", $comprador, $descText, $total);
$stmt->execute();

// Registrar salida de efectivo
$descCaja = "Surtido inventario por $comprador";
$stmt = $conn->prepare("INSERT INTO cajas (metodo, tipo, descripcion, monto) VALUES ('efectivo', 'salida', ?, ?)");
$stmt->bind_param("sd", $descCaja, $total);
$stmt->execute();

echo json_encode(["exito" => true]);
?>
