<?php
include "db.php";
header('Content-Type: application/json');

$id = $_POST['producto_id'] ?? null;
$nuevo = $_POST['nuevo_precio'] ?? null;

if (!$id || !$nuevo || $nuevo <= 0) {
    echo json_encode(['exito' => false, 'error' => 'Datos inválidos']);
    exit;
}

$stmt = $conn->prepare("UPDATE productos SET precio_unitario = ? WHERE id = ?");
$stmt->bind_param("di", $nuevo, $id);

if ($stmt->execute()) {
    echo json_encode(['exito' => true]);
} else {
    echo json_encode(['exito' => false, 'error' => $conn->error]);
}
