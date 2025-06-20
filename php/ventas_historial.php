<?php
include "db.php";
header('Content-Type: application/json');

$sql = "SELECT v.fecha, v.vendedor, p.nombre AS producto, v.cantidad, v.total, v.estado, v.metodo_pago
        FROM ventas v
        JOIN productos p ON v.producto_id = p.id
        ORDER BY v.fecha DESC";

$res = $conn->query($sql);
$ventas = [];

while ($row = $res->fetch_assoc()) {
    $ventas[] = [
        "fecha" => date("Y-m-d", strtotime($row["fecha"])),
        "vendedor" => $row["vendedor"],
        "producto" => $row["producto"],
        "cantidad" => $row["cantidad"],
        "total" => $row["total"],
        "estado" => $row["estado"],
        "metodo_pago" => $row["metodo_pago"]
    ];
}

echo json_encode($ventas);
?>
