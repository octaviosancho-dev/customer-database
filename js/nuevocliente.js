(function() {
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        
        formulario.addEventListener('submit', validarCliente);

        conectarDB();
    })

    // Funciones
    function validarCliente(e) {
        e.preventDefault();

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === '') {
             
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()
        }

        crearNuevoCliente(cliente);
    }

    //td Crear y actualizar base de datos
    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['cliente'], 'readwrite');
        const objectStore = transaction.objectStore('cliente');

        objectStore.add(cliente);

        transaction.onerror = function() {
            imprimirAlerta('Error al crear cliente', 'error');
        }

        transaction.oncomplete = function() {
            
            imprimirAlerta('Agregado Correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
})();