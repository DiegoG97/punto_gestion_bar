document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formTransferencia');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const datos = new FormData(form);

    fetch('php/transferir_efectivo.php', {
      method: 'POST',
      body: datos
    })
      .then(res => res.json())
      .then(res => {
        if (res.exito) {
          mostrarMensajeYRecargar("✅ Transferencia realizada con éxito");
        } else {
          alert("❌ Error: " + (res.error || "No se pudo realizar la transferencia"));
        }
      });
  });
});

function mostrarMensajeYRecargar(texto = "Operación exitosa") {
  const mensaje = document.getElementById('mensajeExito');
  mensaje.textContent = texto;
  mensaje.style.display = 'block';

  setTimeout(() => {
    location.reload();
  }, 1500);
}
