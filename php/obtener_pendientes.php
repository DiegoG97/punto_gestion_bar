<?php
include "../php/db.php";
header('Content-Type: application/json');

$sql = "SELECT v.id, v.total, v.habitacion, v.fecha, v.vendedor, p.nombre, v.cantidad 
        FROM ventas v 
        JOIN productos p ON v.producto_id = p.id 
        WHERE v.estado = 'pendiente'";
$res = $conn->query($sql);

$pendientes = [];

while ($row = $res->fetch_assoc()) {
    $pendientes[] = [
        "id" => $row["id"],
        "total" => intval($row["total"]), // quitar decimales
        "habitacion" => $row["habitacion"],
        "fecha" => date("Y-m-d", strtotime($row["fecha"])), // solo día
        "articulos" => $row["nombre"] . " x" . $row["cantidad"],
        "vendedor" => $row["vendedor"]
    ];
}

echo json_encode($pendientes);
?>
