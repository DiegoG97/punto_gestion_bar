document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formEntregaTurno');
    const entregoSelect = form.querySelector('select[name="entrego"]');
    const entregoOtro = form.querySelector('input[name="entrego_otro"]');
    const recibioSelect = form.querySelector('select[name="recibio"]');
    const recibioOtro = form.querySelector('input[name="recibio_otro"]');
    const totalEfectivo = document.getElementById('totalEfectivoTurno');

    // Mostrar input de "Otro"
    entregoSelect.addEventListener('change', () => {
        entregoOtro.style.display = entregoSelect.value === 'Otro' ? 'block' : 'none';
        actualizarOpcionesRecibe();
    });

    recibioSelect.addEventListener('change', () => {
        recibioOtro.style.display = recibioSelect.value === 'Otro' ? 'block' : 'none';
    });

    // Cargar total efectivo desde PHP
    fetch('php/caja_estado.php')
        .then(res => res.json())
        .then(data => {
            totalEfectivo.value = data.efectivo || 0;
        });

    // Evitar que Entrego y Recibio sean iguales
    function actualizarOpcionesRecibe() {
        const entrego = entregoSelect.value;
        const opciones = recibioSelect.querySelectorAll('option');

        opciones.forEach(op => {
            if (op.value === entrego && entrego !== 'Otro') {
                op.disabled = true;
                if (recibioSelect.value === entrego) {
                    recibioSelect.value = "";
                }
            } else {
                op.disabled = false;
            }
        });
    }

    // Enviar formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const datos = new FormData(form);

        if (entregoSelect.value === 'Otro') {
            if (!entregoOtro.value.trim()) return alert("Debes especificar quién entregó.");
            datos.set('entrego', entregoOtro.value.trim());
        }

        if (recibioSelect.value === 'Otro') {
            if (!recibioOtro.value.trim()) return alert("Debes especificar quién recibió.");
            datos.set('recibio', recibioOtro.value.trim());
        }

        const entregoVal = datos.get('entrego');
        const recibioVal = datos.get('recibio');

        if (entregoVal === recibioVal) {
            alert("❌ Entregó y Recibió no pueden ser la misma persona.");
            return;
        }

        fetch('php/entregar_turno.php', {
            method: 'POST',
            body: datos
        })
        .then(res => res.json())
        .then(res => {
            if (res.exito) {
                mostrarMensajeYRecargar("✅ Turno registrado correctamente");
            } else {
                alert("❌ Error al registrar turno");
            }
        });
    });

    function cargarHistorialTurnos() {
        fetch('php/historial_turnos.php')
            .then(res => res.json())
            .then(data => {
                const tabla = document.getElementById('tablaTurnos');
                tabla.innerHTML = '';
    
                if (data.length === 0) {
                    const fila = document.createElement('tr');
                    fila.innerHTML = '<td colspan="4">No hay registros de turnos aún.</td>';
                    tabla.appendChild(fila);
                    return;
                }
    
                data.forEach(turno => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${turno.fecha}</td>
                        <td>${turno.entrego}</td>
                        <td>${turno.recibio}</td>
                        <td>$${parseInt(turno.efectivo).toLocaleString()}</td>
                    `;
                    tabla.appendChild(fila);
                });
            })
            .catch(err => {
                console.error("❌ Error al cargar historial de turnos:", err);
            });
    }
    cargarHistorialTurnos();
});

