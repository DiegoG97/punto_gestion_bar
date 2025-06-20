function cargarHistorialVentas() {
    fetch('php/ventas_historial.php')
        .then(res => res.json())
        .then(data => {
            const tabla = document.getElementById('tablaVentasHistorial');
            tabla.innerHTML = '';
            data.forEach(venta => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${venta.fecha}</td>
                    <td>${venta.vendedor}</td>
                    <td>${venta.producto}</td>
                    <td>${venta.cantidad}</td>
                    <td>$${parseFloat(venta.total).toFixed(0)}</td>
                    <td>${venta.estado}</td>
                    <td>${venta.metodo_pago}</td> <!-- ✅ Mostrar método de pago -->
                `;
                tabla.appendChild(fila);
            });
        });
}
