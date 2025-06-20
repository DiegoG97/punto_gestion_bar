document.addEventListener('DOMContentLoaded', () => {
    const formVenta = document.getElementById('formVenta');
    const estadoCaja = document.getElementById('estadoCaja');
    const productoSelect = formVenta.querySelector('select[name="producto_id"]');
    const estadoSelect = formVenta.querySelector('select[name="estado"]');
    const metodoPagoSelect = formVenta.querySelector('select[name="metodo_pago"]');
    const vendedorSelect = document.getElementById('vendedorSelect');
    const vendedorOtro = document.getElementById('vendedorOtro');

    // Cargar productos
    fetch('php/productos.php')
        .then(res => res.json())
        .then(data => {
            data.forEach(prod => {
                const option = document.createElement('option');
                option.value = prod.id;
            
                if (prod.cantidad <= 0) {
                    option.textContent = `${prod.nombre} - Sin existencias`;
                    option.disabled = true;
                    option.classList.add('agotado');
                } else {
                    option.textContent = `${prod.nombre} - $${parseInt(prod.precio_unitario).toLocaleString()}`;
                }
            
                productoSelect.appendChild(option);
            });
            
        });

    // Cargar estado de cajas
    function cargarCajas() {
        fetch('php/caja_estado.php')
            .then(res => res.json())
            .then(data => {
                estadoCaja.innerHTML = '';
                for (let metodo in data) {
                    let li = document.createElement('li');
                    li.textContent = `${metodo.toUpperCase()}: $${parseInt(data[metodo]).toLocaleString()}`;
                    li.classList.add(metodo);  // 👈 esto aplica la clase personalizada
                    estadoCaja.appendChild(li);
                  }
                  
            });
    }

    cargarCajas();

    // Actualizar disponibilidad del método de pago según el estado
    function actualizarMetodoPago() {
        const estado = estadoSelect.value;
        const habitacionInput = document.getElementById('habitacionInput');

        if (estado === 'pendiente') {
            metodoPagoSelect.disabled = true;
            metodoPagoSelect.value = "";
            habitacionInput.style.display = 'block';
            habitacionInput.required = true;
        } else {
            metodoPagoSelect.disabled = false;
            habitacionInput.style.display = 'none';
            habitacionInput.required = false;
        }
    }

    function mostrarMensajeYRecargar(texto = "Operación exitosa") {
        const mensaje = document.getElementById('mensajeExito');
        mensaje.textContent = texto;
        mensaje.style.display = 'block';

        setTimeout(() => {
            location.reload();
        }, 1500); // 1.5 segundos antes de recargar
    }



    estadoSelect.addEventListener('change', actualizarMetodoPago);
    actualizarMetodoPago();

    // Mostrar input si se selecciona "Otro" como vendedor
    vendedorSelect.addEventListener('change', () => {
        if (vendedorSelect.value === 'Otro') {
            vendedorOtro.style.display = 'block';
            vendedorOtro.required = true;
        } else {
            vendedorOtro.style.display = 'none';
            vendedorOtro.required = false;
        }
    });

    // ✅ Registro de venta único y validado
    formVenta.addEventListener('submit', (e) => {
        e.preventDefault();
        const datos = new FormData(formVenta);

        // Validar cantidad mayor a 0
        const cantidad = parseInt(formVenta.querySelector('input[name="cantidad"]').value);
        if (cantidad <= 0) {
            alert("La cantidad debe ser mayor a 0.");
            return;
        }

        // Validar vendedor si es "Otro"
        if (vendedorSelect.value === 'Otro') {
            const otro = vendedorOtro.value.trim();
            if (otro) {
                datos.set('vendedor', otro);
            } else {
                alert("Debes ingresar el nombre del recepcionista.");
                return;
            }
        }

        fetch('php/ventas.php', {
            method: 'POST',
            body: datos
        })
            .then(() => {
                mostrarMensajeYRecargar("✅ Registrada correctamente");
            });

    });
});
