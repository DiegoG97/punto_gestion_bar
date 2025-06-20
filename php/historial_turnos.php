<?php
include "db.php";
header('Content-Type: application/json');

$res = $conn->query("SELECT entrego, recibio, efectivo, DATE_FORMAT(fecha, '%d/%m/%Y') as fecha FROM entregas_turno ORDER BY id DESC");
$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
