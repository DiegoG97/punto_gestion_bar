<?php
include "../php/db.php";
header('Content-Type: application/json');

$id = $_POST['id'];
$metodo = $_POST['metodo'];

// Buscar venta
$sql = "SELECT * FROM ventas WHERE id = ? AND estado = 'pendiente'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();
$venta = $resultado->fetch_assoc();

if ($venta) {
    $monto = $venta['total'];
    $desc = "Pago pendiente ID $id desde habitación {$venta['habitacion']}";

    // 1. Registrar en la nueva caja
    $stmtCaja = $conn->prepare("INSERT INTO cajas (metodo, tipo, descripcion, monto) VALUES (?, 'entrada', ?, ?)");
    $stmtCaja->bind_param("ssd", $metodo, $desc, $monto);
    $stmtCaja->execute();

    // 2. Quitar monto de caja "pendiente"
    $descPend = "Salida por pago pendiente ID $id";
    $pend = "pendiente";
    $stmtCaja = $conn->prepare("INSERT INTO cajas (metodo, tipo, descripcion, monto) VALUES (?, 'salida', ?, ?)");
    $stmtCaja->bind_param("ssd", $pend, $descPend, $monto);
    $stmtCaja->execute();

    // 3. Marcar la venta como pagada
    $stmt = $conn->prepare("UPDATE ventas SET estado = 'pagado', metodo_pago = ? WHERE id = ?");
    $stmt->bind_param("si", $metodo, $id);
    $stmt->execute();

    echo json_encode(["exito" => true]);
} else {
    echo json_encode(["exito" => false, "error" => "Venta no encontrada"]);
}
?>
