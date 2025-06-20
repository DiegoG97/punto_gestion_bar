<?php
include "db.php";
header('Content-Type: application/json');

// SUMA entradas y RESTA salidas por método
$sql = "SELECT metodo, 
               SUM(CASE WHEN tipo = 'entrada' THEN monto ELSE -monto END) AS total 
        FROM cajas 
        GROUP BY metodo";

$result = $conn->query($sql);

$cajas = [
    'efectivo' => 0,
    'nequi' => 0,
    'daviplata' => 0,
    'pendiente' => 0
];

while ($row = $result->fetch_assoc()) {
    $metodo = $row['metodo'];
    $total = floatval($row['total']);
    if (isset($cajas[$metodo])) {
        $cajas[$metodo] = $total;
    }
}

echo json_encode($cajas);
?>
