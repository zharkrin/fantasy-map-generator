/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : crearRuido.js
Ruta     : frontend/js/mapa/terreno/ruido/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Punto de entrada para crear generadores de ruido.

Actualmente soporta:

- Simplex
- fBm

En futuras fases se podrán añadir nuevos motores
y modificadores sin cambiar la API pública.

==========================================================
*/

import { crearSimplex } from "./motores/simplex.js";
import { crearFBM } from "./fbm.js";

/**
 * Crea un generador de ruido.
 *
 * @param {Object} opciones
 * @returns {Object}
 */
export function crearRuido(opciones = {}) {

    const {

        // Motor
        motor = "simplex",

        // Configuración general
        semilla = 12345,
        frecuencia = 0.003,

        // fBm
        usarFBM = true,
        octavas = 6,
        persistencia = 0.5,
        lacunaridad = 2.0

    } = opciones;

    let ruido;

    switch (motor) {

        case "simplex":

            ruido = crearSimplex({

                semilla,

                frecuencia

            });

            break;

        default:

            throw new Error(
                `Motor de ruido no soportado: ${motor}`
            );

    }

    if (usarFBM) {

        ruido = crearFBM(ruido, {

            octavas,

            persistencia,

            lacunaridad

        });

    }

    return ruido;

}