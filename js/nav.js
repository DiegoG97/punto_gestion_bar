document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-bar a');
    const sections = document.querySelectorAll('main > section, main > div'); // ✅ Incluir divs como #movimientos-container
    const inicioContainer = document.getElementById('inicio-container');

    function mostrarInicio() {
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        inicioContainer.style.display = 'flex';
        inicioContainer.querySelectorAll('.card').forEach(card => {
            card.style.display = 'block';
            card.classList.add('active');
        });
    }

    mostrarInicio();

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            if (targetId === 'inicio-container') {
                mostrarInicio();
                return;
            }

            // Ocultar todo antes de mostrar la nueva sección
            inicioContainer.style.display = 'none';
            inicioContainer.querySelectorAll('.card').forEach(card => {
                card.style.display = 'none';
                card.classList.remove('active');
            });

            sections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.classList.add('active');

                if (targetId === 'ventas_historial' && typeof cargarHistorialVentas === 'function') {
                    cargarHistorialVentas();
                }
            }
        });
    });
});
