document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formProducto');
    const tabla = document.getElementById('tablaProductos');

    function cargarProductos() {
        fetch('php/productos.php')
            .then(res => res.json())
            .then(data => {
                tabla.innerHTML = '';
                data.forEach(producto => {
                    tabla.innerHTML += `
                        <tr>
                            <td>${producto.nombre}</td>
                            <td>$${parseInt(producto.precio_unitario).toLocaleString()}</td>
                            <td>${producto.cantidad}</td>
                        </tr>`;
                });
            });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const datos = new FormData(form);

        fetch('php/productos.php', {
            method: 'POST',
            body: datos
        })
        .then(res => res.json())
        .then(() => {
            form.reset();
            cargarProductos();
        });
    });

    cargarProductos();
});
