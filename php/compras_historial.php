<?php
include "db.php";
header('Content-Type: application/json');

$sql = "SELECT fecha, comprador, descripcion, total FROM compras ORDER BY fecha DESC";
$res = $conn->query($sql);

$compras = [];

while ($row = $res->fetch_assoc()) {
    $compras[] = [
        "fecha" => date("Y-m-d", strtotime($row["fecha"])),
        "comprador" => $row["comprador"],
        "descripcion" => $row["descripcion"],
        "total" => intval($row["total"])
    ];
}

echo json_encode($compras);
?>
