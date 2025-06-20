window.agregarProductoCompra = function () {
  const index = document.querySelectorAll('#productosComprados .producto-surtido').length;

  const div = document.createElement('div');
  div.classList.add('producto-surtido');
  div.innerHTML = `
    <select name="productos[${index}][id]" required onchange="this.nextElementSibling.value=this.options[this.selectedIndex].text">
      <option value="">Seleccione producto</option>
    </select>
    <input type="hidden" name="productos[${index}][nombre]">
    <input type="number" name="productos[${index}][cantidad]" placeholder="Cantidad" required>
  `;

  document.getElementById('productosComprados').appendChild(div);

  fetch('php/productos.php')
    .then(res => res.json())
    .then(data => {
      const select = div.querySelector('select');
      data.forEach(prod => {
        const option = document.createElement('option');
        option.value = prod.id;
        option.textContent = prod.nombre;
        select.appendChild(option);
      });
    });
};


document.addEventListener('DOMContentLoaded', () => {
   const compradorSelect = document.getElementById('compradorSelect');
  const compradorOtro = document.getElementById('compradorOtro');

  compradorSelect.addEventListener('change', () => {
    compradorOtro.style.display = compradorSelect.value === "Otro" ? 'block' : 'none';
  });

  agregarProductoCompra(); // ✅ Primera carga

  // Enviar el formulario
  document.getElementById('formSurtir').addEventListener('submit', (e) => {
    e.preventDefault();

    const form = e.target;
    const datos = new FormData(form);

    if (compradorSelect.value === 'Otro') {
      const otro = compradorOtro.value.trim();
      if (otro) datos.set('comprador', otro);
      else return alert("Debes ingresar el nombre del recepcionista.");
    }

    fetch('php/surtir.php', {
      method: 'POST',
      body: datos
    })
      .then(res => res.json())
      .then(res => {
        if (res.exito) {
          mostrarMensajeYRecargar("✅ Surtido con éxito");
        } else {
          alert("❌ Error: " + (res.error || "Error al surtir."));
        }
      });
  });

  cargarUltimasCompras();
});

// Cargar últimas compras
function cargarUltimasCompras() {
  fetch('php/compras_historial.php')
    .then(res => res.json())
    .then(data => {
      const tabla = document.getElementById('tablaCompras');
      tabla.innerHTML = '';
      data.forEach(c => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${c.fecha}</td>
          <td>${c.comprador}</td>
          <td>${c.descripcion}</td>
          <td>$${parseInt(c.total).toLocaleString()}</td>
        `;
        tabla.appendChild(fila);
      });
    });
}

// Mostrar mensaje y recargar
function mostrarMensajeYRecargar(texto = "Operación exitosa") {
  const mensaje = document.getElementById('mensajeExito');
  mensaje.textContent = texto;
  mensaje.style.display = 'block';

  setTimeout(() => {
    location.reload();
  }, 1500);
}
