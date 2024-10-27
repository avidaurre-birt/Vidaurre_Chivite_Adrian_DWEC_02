'use strict'
import GastoCombustible from "./gastosCombustible.js";

// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = '/Vidaurre_Chivite_Adrian_DWEC_02/DWEC02_TE/json/tarifasCombustible.json';
let gastosJSONpath = '/Vidaurre_Chivite_Adrian_DWEC_02/DWEC02_TE/json/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);
    console.log(typeof (tarifasJSON));


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

    //Recorremos cada gasto, guardando el año y sumando el precioViaje en cada caso 
    gastosJSON.forEach(gasto => {
        // Convertimos la fecha en un objeto Date y obtenemos el año
        const anio = new Date(gasto.date).getFullYear();

        // Sumamos el precio al año correspondiente en aniosArray
        if (aniosArray[anio] !== undefined) {
            aniosArray[anio] += gasto.precioViaje;
        }

        //Pintamos el gasto en cada año
        document.getElementById(`gasto${anio}`).innerText = aniosArray[anio].toFixed(2)
    });

    console.log(aniosArray)

}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value).getFullYear();
    const kilometros = parseFloat(document.getElementById('kilometers').value);
    let precio = 0

    // Recorremos el objeto tarifasJSON en buscca de la tarifa correspondiente
    tarifasJSON.tarifas.forEach(tarifa => {
        //Condicion: Si el año es igual y si encuentra la tarifa para ese tipo de vehiculo, calcula el precio del viaje
        if (tarifa.anio === fecha && tarifa.vehiculos[tipoVehiculo] !== undefined)
            precio = tarifa.vehiculos[tipoVehiculo] * kilometros;
        console.log(precio)
    })

    // Guardamos el gasto en un objeto del tipo GastoCombustible
    const datosNuevos = new GastoCombustible(tipoVehiculo, fecha, kilometros, precio)

    //Serializamos los datos a JSON
    const datos = datosNuevos.convertToJSON()

    //Pintamos el gasto en cada año
    document.getElementById('expense-list').innerText = `Último gasto: ${datos}`;
    /*document.getElementById('expense-list').innerText = 
    `Nuevo gasto en ${datosNuevos.fecha} de ${datosNuevos.precio}€ por ${datosNuevos.km} km en ${datosNuevos.vehiculo}`;*/

    actualizarGastoTotal(datosNuevos.fecha, datosNuevos.precio)

    limpiarForm()

}

function actualizarGastoTotal(anio, precio) {
    const gastoTotalElemento = document.getElementById(`gasto${anio}`);

    // Obtener el valor actual, sumarle el nuevo precio, y actualizar el valor en HTML
    const gastoActual = parseFloat(gastoTotalElemento.innerText);
    const nuevoTotal = gastoActual + precio;
    gastoTotalElemento.innerText = nuevoTotal.toFixed(2); // Actualizamos el valor en HTML

}


function limpiarForm() {

    //Limpiamos formulario
    document.getElementById('vehicle-type').value = '';
    document.getElementById('date').value = '';
    document.getElementById('kilometers').value = '';

}
