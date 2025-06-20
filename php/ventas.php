<?php
include "db.php";
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $producto_id = $_POST['producto_id'];
    $cantidad = $_POST['cantidad'];
    $estado = $_POST['estado'];
    $habitacion = $_POST['habitacion'] ?? null;
    $metodo = $_POST['metodo_pago'];
    $vendedor = $_POST['vendedor'];

    // Verificar que haya stock suficiente y obtener precio unitario
    $stmt = $conn->prepare("SELECT cantidad, precio_unitario FROM productos WHERE id = ?");
    $stmt->bind_param("i", $producto_id);
    $stmt->execute();
    $stmt->bind_result($stock_disponible, $precio_unitario);
    $stmt->fetch();
    $stmt->close();

    if ($stock_disponible < $cantidad) {
        echo json_encode(["status" => "error", "mensaje" => "No hay suficiente inventario disponible."]);
        exit;
    }

    $total = $precio_unitario * $cantidad;

    // Insertar venta
    $stmt = $conn->prepare("INSERT INTO ventas (producto_id, cantidad, total, estado, habitacion, metodo_pago, vendedor) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("idissss", $producto_id, $cantidad, $total, $estado, $habitacion, $metodo, $vendedor);
    $stmt->execute();

    // Registrar entrada en caja si está pagado
    if ($estado === "pagado") {
        $desc = "Venta producto ID $producto_id ($cantidad und)";
        $stmtCaja = $conn->prepare("INSERT INTO cajas (metodo, tipo, descripcion, monto) VALUES (?, 'entrada', ?, ?)");
        $stmtCaja->bind_param("ssd", $metodo, $desc, $total);
        $stmtCaja->execute();
    } elseif ($estado === "pendiente") {
        $desc = "Venta pendiente producto ID $producto_id ($cantidad und)";
        $pendiente = "pendiente";
        $stmtCaja = $conn->prepare("INSERT INTO cajas (metodo, tipo, descripcion, monto) VALUES (?, 'entrada', ?, ?)");
        $stmtCaja->bind_param("ssd", $pendiente, $desc, $total);
        $stmtCaja->execute();
    }

    // Descontar inventario
    $stmt = $conn->prepare("UPDATE productos SET cantidad = cantidad - ? WHERE id = ?");
    $stmt->bind_param("ii", $cantidad, $producto_id);
    $stmt->execute();

    echo json_encode(["status" => "ok"]);
}
?>
