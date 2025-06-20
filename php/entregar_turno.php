<?php
include "db.php";
header('Content-Type: application/json');

$entrego = $_POST['entrego'] ?? '';
$recibio = $_POST['recibio'] ?? '';
$efectivo = floatval($_POST['total_efectivo'] ?? 0);

$stmt = $conn->prepare("INSERT INTO entregas_turno (entrego, recibio, efectivo) VALUES (?, ?, ?)");
$stmt->bind_param("ssd", $entrego, $recibio, $efectivo);

if ($stmt->execute()) {
    echo json_encode(["exito" => true]);
} else {
    echo json_encode(["exito" => false]);
}
?>
