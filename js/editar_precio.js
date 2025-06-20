document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('productoSelect');
    const precioActual = document.getElementById('precioActual');
    const form = document.getElementById('formEditarPrecio');

    function cargarProductos() {
        fetch('php/productos.php')
            .then(res => res.json())
            .then(data => {
                select.innerHTML = '<option value="">Seleccione producto</option>';
                data.forEach(p => {
                    const option = document.createElement('option');
                    option.value = p.id;
                    option.textContent = p.nombre;
                    option.dataset.precio = p.precio_unitario;
                    select.appendChild(option);
                });
            });
    }

    select.addEventListener('change', () => {
        const selected = select.options[select.selectedIndex];
        precioActual.value = `$${parseFloat(selected.dataset.precio).toLocaleString()}`;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const productoId = select.value;
        const nuevoPrecio = form.nuevo_precio.value;

        if (!productoId || !nuevoPrecio) return;

        const nombre = select.options[select.selectedIndex].textContent;
        const actual = precioActual.value;

        if (!confirm(`¿Deseas cambiar el precio de "${nombre}" de ${actual} a $${parseFloat(nuevoPrecio).toLocaleString()}?`)) return;

        fetch('php/editar_precio.php', {
            method: 'POST',
            body: new URLSearchParams({
                producto_id: productoId,
                nuevo_precio: nuevoPrecio
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.exito) {
                alert("✅ Precio actualizado con éxito.");
                document.getElementById('modalEditarPrecio').close();
                location.reload(); // o llamar cargarProductos()
            } else {
                alert("❌ Error al actualizar: " + (data.error || 'Desconocido'));
            }
        });
    });

    // Cargar productos al abrir el modal
    document.getElementById('modalEditarPrecio').addEventListener('show', cargarProductos);
    cargarProductos();
});
