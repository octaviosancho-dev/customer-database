(function() {
    let DB;

    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {

        crearDB();

        if(window.indexedDB.open('cliente', 1)) {

            obtenerClientes();

        }

        listadoClientes.addEventListener('click', eliminarCliente);

    }); 

    //* Funciones

    //td Crear la base de datos
    function crearDB() {

        const crearDB = window.indexedDB.open('cliente', 1);
    
        crearDB.onerror = function() {
            console.log('Ocurrió un error al cargar la base de datos');
        }
    
        crearDB.onsuccess = function() {
            DB = crearDB.result
        }

        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('cliente', {keyPath: 'id', autoIncrement: true});

            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('Base de datos creada.')
        }
        
    }

    //td Obtener clientes de base de datos para mostrarlos en pantalla
    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open('cliente', 1);

        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;

            const objectStore = DB.transaction('cliente').objectStore('cliente');

            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result;

                if(cursor) {
                    const {nombre, email, telefono, empresa, id} = cursor.value;

                    listadoClientes.innerHTML += `
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>
                    `;
                    
                    cursor.continue();
                }
            }
        }
    }

    //td Funcion para eliminar clientes de la lista y base de datos
    function eliminarCliente(e) {
        if(e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente)
            const confirmar = confirm('Desea realmente eliminar el registro?');

            if(confirmar) {
                const transaction = DB.transaction(['cliente'], 'readwrite');
                const objectStore = transaction.objectStore('cliente');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function() {
                    
                    e.target.parentElement.parentElement.remove();

                }

                transaction.onerror = function() {
                    console.log('Hubo un error eliminando el registro')
                }
            }
        }
    }

})();