/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : main.js
Ruta     : frontend/js/main.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Punto de entrada principal de la aplicación.

IMPORTANTE:

Este archivo NO contiene lógica del proyecto.

Su única responsabilidad es:

1. Esperar a que el DOM esté disponible.
2. Crear la instancia del Core.
3. Iniciar la aplicación.
4. Gestionar errores críticos de arranque.

Toda la lógica del proyecto estará encapsulada
dentro del Core y de sus módulos.

==========================================================
*/

import { Core } from "./core/index.js";

/**
 * Referencia al núcleo de la aplicación.
 * Se mantiene privada dentro de este módulo.
 */
let core = null;

/**
 * Arranca la aplicación.
 */
async function iniciarAplicacion() {

    console.info("==========================================");
    console.info(" Fantasy Map Generator");
    console.info(" Iniciando aplicación...");
    console.info("==========================================");

    try {

        core = new Core();

        await core.inicializar();

        console.info("Aplicación iniciada correctamente.");

    } catch (error) {

        console.error("Error durante el inicio de la aplicación.");
        console.error(error);

        mostrarErrorFatal(error);

    }

}

/**
 * Muestra un mensaje de error fatal tanto en consola
 * como en la interfaz.
 *
 * @param {Error} error
 */
function mostrarErrorFatal(error) {

    const estado = document.getElementById("estado-aplicacion");

    if (estado) {

        estado.textContent = "Error durante el inicio del motor.";

    }

    const contenedor = document.getElementById("contenedor-mapa");

    if (!contenedor) {
        return;
    }

    const mensaje = document.createElement("div");

    mensaje.style.position = "absolute";
    mensaje.style.top = "50%";
    mensaje.style.left = "50%";
    mensaje.style.transform = "translate(-50%, -50%)";

    mensaje.style.padding = "20px";

    mensaje.style.background = "#8b1e1e";

    mensaje.style.border = "2px solid #ff6666";

    mensaje.style.borderRadius = "8px";

    mensaje.style.color = "#ffffff";

    mensaje.style.fontFamily = "monospace";

    mensaje.style.zIndex = "999999";

    mensaje.innerHTML = `
        <strong>Error fatal</strong>
        <br><br>
        No se ha podido iniciar el motor.
        <br><br>
        Revise la consola del navegador (F12).
    `;

    contenedor.appendChild(mensaje);

    console.error(error);

}

/**
 * Espera a que el documento esté completamente cargado.
 */
document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarAplicacion();

    }
);

/**
 * Captura errores JavaScript no controlados.
 */
window.addEventListener(
    "error",
    (evento) => {

        console.error("Error global detectado.");

        console.error(evento.error);

    }
);

/**
 * Captura errores de Promesas.
 */
window.addEventListener(
    "unhandledrejection",
    (evento) => {

        console.error("Promesa rechazada.");

        console.error(evento.reason);

    }
);