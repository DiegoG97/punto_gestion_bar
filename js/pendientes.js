// Evento de envío del formulario de pago
document.getElementById('formPagoPendiente').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('idPendiente').value;
    const metodo = document.getElementById('metodoPagoPendiente').value;

    fetch('php/pagar_pendiente.php', {
        method: 'POST',
        body: new URLSearchParams({ id, metodo })
    })
        .then(res => res.json())
        .then(res => {
            if (res.exito) {
                document.getElementById('modal-pago-pendiente').close(); // ✅ Cierra el modal
                mostrarMensajeYRecargar("✅ Pendiente pagado correctamente");
            } else {
                alert("❌ Error: " + (res.error || "No se pudo pagar el pendiente."));
            }
        })
        .catch(err => {
            console.error("❌ Error al conectar con el servidor:", err);
        });
});

// Función para mostrar el mensaje y recargar la página
function mostrarMensajeYRecargar(texto = "✅ Operación exitosa") {
    const mensaje = document.getElementById('mensajeExito');
    mensaje.textContent = texto;
    mensaje.style.display = 'block';

    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Cargar pendientes en tabla
function cargarPendientes() {
    fetch('php/obtener_pendientes.php')
        .then(res => res.json())
        .then(data => {
            const tabla = document.getElementById('tabla-pendientes');
            tabla.innerHTML = '';

            if (data.length === 0) {
                const fila = document.createElement('tr');
                fila.innerHTML = '<td colspan="5">No hay ventas pendientes.</td>';
                tabla.appendChild(fila);
                return;
            }

            data.forEach(pendiente => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${pendiente.fecha}</td>
                    <td>${pendiente.vendedor}</td> <!-- ✅ Recepcionista -->
                    <td>${pendiente.articulos}</td>
                    <td>$${parseInt(pendiente.total).toLocaleString()}</td>
                    <td>${pendiente.habitacion}</td>
                    <td><button onclick="abrirPagoPendiente('${pendiente.id}')">Pagar</button></td>
                `;

                tabla.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("❌ Error al cargar pendientes:", error);
        });
}

// Abrir el modal de pago
function abrirPagoPendiente(id) {
    document.getElementById('idPendiente').value = id;
    document.getElementById('modal-pago-pendiente').showModal();
}

// Cargar automáticamente pendientes al abrir la vista
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tabla-pendientes')) {
        cargarPendientes();
    }
});
