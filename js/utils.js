function mostrarMensajeYRecargar(texto = "Operación exitosa") {
    const mensaje = document.getElementById('mensajeExito');
    mensaje.textContent = texto;
    mensaje.style.display = 'block';

    setTimeout(() => {
        location.reload();
    }, 1500); // 1.5 segundos antes de recargar
}


function formatearSinDecimales(valor) {
    return parseInt(valor).toLocaleString();
}
