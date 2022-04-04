(function() {
    let idCliente;

    const formulario = document.querySelector('#formulario');

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    document.addEventListener('DOMContentLoaded', () => {
        
        conectarDB();

        formulario.addEventListener('submit', actualizarCliente);

        const parametroURL = new URLSearchParams(window.location.search); // Buscar el parametro de la URL especifico del cliente a editar
        idCliente = parametroURL.get('id');

        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 250);
        }

    });

    function obtenerCliente(id) {
        const transaction = DB.transaction(['cliente'], 'readonly');
        const objectStore = transaction.objectStore('cliente');

        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                if(cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                    
                }
                
                cursor.continue();
            }   
        }
    }

    function llenarFormulario(datosCliente) {
        const {nombre, email, telefono, empresa} = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;   
    }

    function actualizarCliente(e) {
        e.preventDefault();

        if(nombre === '' || email === '' || telefono === '' || empresa === '') {
             
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['cliente'], 'readwrite');
        const objectStore = transaction.objectStore('cliente');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function() {
            imprimirAlerta('Cliente Actualizado');
        }

        transaction.onerror = function() {
            imprimirAlerta('Hubo un error', 'error');
        }

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
       
    }
})();