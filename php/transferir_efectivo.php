<?php
include "db.php";
header('Content-Type: application/json');

$origen = $_POST['origen'];
$monto = floatval($_POST['monto']);
$descripcion = $_POST['descripcion'] ?? "Transferencia de $origen a efectivo";

if (!in_array($origen, ['nequi', 'daviplata']) || $monto <= 0) {
    echo json_encode(['exito' => false, 'error' => 'Datos inválidos']);
    exit;
}

// 1. Salida del origen
$stmt1 = $conn->prepare("INSERT INTO cajas (metodo, tipo, descripcion, monto) VALUES (?, 'salida', ?, ?)");
$stmt1->bind_param("ssd", $origen, $descripcion, $monto);
$stmt1->execute();

// 2. Entrada a efectivo
$metodoDestino = 'efectivo';
$stmt2 = $conn->prepare("INSERT INTO cajas (metodo, tipo, descripcion, monto) VALUES (?, 'entrada', ?, ?)");
$stmt2->bind_param("ssd", $metodoDestino, $descripcion, $monto);
$stmt2->execute();

echo json_encode(['exito' => true]);
?>
