<?php
include "db.php";
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'];

    // Iniciar turno
    if ($accion === 'abrir') {
        $turno_nombre = $_POST['turno_nombre'];
        $stmt = $conn->prepare("INSERT INTO turnos (turno_nombre) VALUES (?)");
        $stmt->bind_param("s", $turno_nombre);
        $stmt->execute();
        echo json_encode(["status" => "ok", "turno_id" => $stmt->insert_id]);
    }

    // Cerrar turno
    if ($accion === 'cerrar') {
        $turno_id = $_POST['turno_id'];
        $nota = $_POST['nota'];

        // Sumar entradas y salidas desde la tabla `cajas`
        $stmt = $conn->prepare("
            SELECT metodo, tipo, monto 
            FROM cajas 
            WHERE fecha >= (SELECT inicio FROM turnos WHERE id = ?)
        ");
        $stmt->bind_param("i", $turno_id);
        $stmt->execute();
        $res = $stmt->get_result();

        $totales = ["efectivo" => 0, "nequi" => 0, "daviplata" => 0];
        while ($row = $res->fetch_assoc()) {
            $metodo = $row['metodo'];
            $monto = floatval($row['monto']);
            $tipo = $row['tipo'];

            if ($tipo === 'entrada') $totales[$metodo] += $monto;
            else $totales[$metodo] -= $monto;
        }

        // Guardar totales y cerrar turno
        $stmt = $conn->prepare("
            UPDATE turnos 
            SET cierre = NOW(), nota = ?, 
                total_efectivo = ?, total_nequi = ?, total_daviplata = ?
            WHERE id = ?
        ");
        $stmt->bind_param("sdddi", $nota, $totales['efectivo'], $totales['nequi'], $totales['daviplata'], $turno_id);
        $stmt->execute();

        echo json_encode(["status" => "cerrado", "resumen" => $totales]);
    }
}
?>
