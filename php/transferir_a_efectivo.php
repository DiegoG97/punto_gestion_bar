<?php
include "db.php";
header('Content-Type: application/json');

$origen = $_POST['origen'] ?? '';

try {
    $stmt = $conn->prepare("CALL transferir_a_efectivo(?)");
    $stmt->bind_param("s", $origen);
    $stmt->execute();

    echo json_encode(["exito" => true]);
} catch (mysqli_sql_exception $e) {
    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage()
    ]);
}
?>
