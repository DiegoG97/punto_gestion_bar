<?php
include "db.php";
header('Content-Type: application/json');

$metodo = $_POST['metodo'] ?? '';

if (!in_array($metodo, ['nequi', 'daviplata'])) {
    echo json_encode(['exito' => false, 'error' => 'Método no válido']);
    exit;
}

$stmt = $conn->prepare("SELECT monto FROM cajas WHERE metodo = ?");
$stmt->bind_param("s", $metodo);
$stmt->execute();
$stmt->bind_result($monto);
$stmt->fetch();
$stmt->close();

echo json_encode(['exito' => true, 'monto' => $monto]);
