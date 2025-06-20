document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formTransferencia');
  const origenSelect = form.origen;
  const montoInput = document.getElementById('montoDisponible');

  // Al cambiar el origen, consultar el saldo disponible
  origenSelect.addEventListener('change', () => {
    const origen = origenSelect.value;
    montoInput.value = ''; // Limpiar primero

    if (origen) {
      fetch('php/consultar_saldo.php', {
        method: 'POST',
        body: new URLSearchParams({ metodo: origen })
      })
      .then(res => res.json())
      .then(data => {
        if (data.exito) {
          montoInput.value = data.monto;
        } else {
          montoInput.value = 0;
        }
      })
      .catch(err => {
        console.error("Error al consultar saldo:", err);
        montoInput.value = 0;
      });
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const origen = origenSelect.value;
    const monto = parseFloat(montoInput.value);

    if (!origen || isNaN(monto) || monto <= 0) {
      alert("❌ Debes seleccionar un origen con saldo disponible.");
      return;
    }

    const confirmacion = confirm(`Se transferirán $${monto.toLocaleString()} de ${origen.toUpperCase()} a EFECTIVO. ¿Deseas continuar?`);
    if (!confirmacion) return;

    fetch('php/transferir_a_efectivo.php', {
      method: 'POST',
      body: new URLSearchParams({ origen })
    })
    .then(res => res.json())
    .then(data => {
      if (data.exito) {
        alert("✅ Transferencia realizada correctamente.");
        location.reload();
      } else {
        alert("❌ Error al transferir: " + (data.error || 'Error desconocido.'));
      }
    })
    .catch(err => {
      console.error(err);
      alert("❌ Error de conexión al intentar transferir.");
    });
  });
});
