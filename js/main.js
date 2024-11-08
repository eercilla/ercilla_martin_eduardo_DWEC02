import gastoCombustible from "./GastoCombustible.js";
// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = 'js\\tarifasCombustible.json';
let gastosJSONpath = 'js\\gastosCombustible.json';



// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }
    
    // Recorremos aniosArray por cada índice
    for (let indice in aniosArray) {

        // Recorremos el archivo JSON cargado en gastosJSON dándole el valor de cada elemento a "gasto"
        for (var gasto of gastosJSON) 
            {
                // Convertimos a tipo Date la fecha de gasto y nos quedamos el año
                var fechaAux = new Date(gasto.date);
                var anio = fechaAux.getFullYear();

                // Añadimos el gasto encontrado al elemento de índice igual año
                if(anio == indice){
                    aniosArray[indice]+=gasto.kilometers*gasto.precioViaje;
                }
            }

            // Limitamos a dos decimales
            aniosArray[indice]=aniosArray[indice].toFixed(2);

            // Mostramos el gasto del año indice
            document.getElementById('gasto'+indice).innerText=aniosArray[indice];
    }
}

// Guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtenemos los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);



    // Inicializamos un objeto de la clase creada con los datos obtenidos
    var gastoGuardar = new gastoCombustible(tipoVehiculo, fecha, kilometros);


    var anio = fecha.getFullYear();

    // Creamos una variable donde se almacenen la lista de tarifas
    const tarifas = tarifasJSON.tarifas;

    // Obtenemos la parte del JSON referida al año escogido
    var nuevoGasto = tarifas.find(obj => obj.anio === anio);
    
    // Calculamos el precio por litro del vehículo escogido
    var litro = 0; 
    litro = calcularPrecio(nuevoGasto, tipoVehiculo);

    // Calculamos el precio total teniendo en cuenta los kilómetros realizados y la tarifa
    var precioTotal = litro * kilometros;


    // Le asignamos al objeto creado el precio total calculado anteriormente
    gastoGuardar.precioViaje = precioTotal;


    // Mostramos en el html el objeto creado, actualizamos el gasto total y dejamos el formulario en blanco
    escribirGastos(gastoGuardar);
    actualizarGastos(anio, precioTotal);
    borrarFormulario();
}

// Función para calcular el precio en función del tipo de vehículo
function calcularPrecio(nuevoGasto, tipoVehiculo) {
    
    // Variable que almacenará el precio del litro
    let litro;

    // Tendrá un precio diferente por cada tipo de vehículo
    switch(tipoVehiculo){
        case "furgoneta":
            litro = nuevoGasto.vehiculos.furgoneta;
            break;
        case "moto":
            litro = nuevoGasto.vehiculos.moto;
            break;
        case "camion":
            litro = nuevoGasto.vehiculos.camion;
            break;
    }

    return litro;

}

// Mostrará los valores del objeto en el html
function escribirGastos(objGasto){

    // Convertimos el gasto en un string con formato JSON
    let gastoEscrito = objGasto.convertToJSON();

    // Mostramos el string con forma JSON en el html
    document.getElementById('expense-list').innerText = gastoEscrito;
}

// Actualiza el valor del gasto del año pasado por parámetro
function actualizarGastos(anio, precioTotal){

    // Obtenemos el gasto del año que hemos pasado por parámetro
    let elemento = Number(document.getElementById('gasto'+anio).innerText);

    // Añadimos el nuevo gasto al gasto del año.
    elemento += precioTotal;

    // Hacemos que se muestre este nuevo valor en el html
    document.getElementById('gasto'+anio).innerText = elemento.toFixed(2);
}

// Pone en blanco todos los elementos del formulario
function borrarFormulario(){

    document.getElementById("vehicle-type").value="";
    document.getElementById("date").value="";
    document.getElementById('kilometers').value="";
}