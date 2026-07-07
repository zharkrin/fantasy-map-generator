/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : simplex.js
Ruta     : frontend/js/mapa/terreno/ruido/motores/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Adaptador del motor Simplex Noise.

Este archivo encapsula completamente la librería
simplex-noise para que el resto del proyecto nunca
dependa directamente de ella.

Si en el futuro se sustituye la implementación
(Simplex, FastNoiseLite, OpenSimplex2, etc.)
únicamente habrá que modificar este archivo.

==========================================================
*/

import { createNoise2D } from "../../../../vendor/simplex-noise/simplex-noise.js";

/**
 * Generador pseudoaleatorio determinista (Mulberry32)
 *
 * @param {number} semilla
 * @returns {Function}
 */
function crearPRNG(semilla) {

    let estado = semilla >>> 0;

    return function () {

        estado += 0x6D2B79F5;

        let t = estado;

        t = Math.imul(t ^ (t >>> 15), t | 1);

        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;

    };

}

/**
 * Crea un motor Simplex.
 *
 * @param {Object} opciones
 *
 * @returns {Object}
 */
export function crearSimplex(opciones = {}) {

    const {

        semilla = 12345,

        frecuencia = 0.005

    } = opciones;

    const random = crearPRNG(semilla);

    const ruido2D = createNoise2D(random);

    return {

        /**
         * Obtiene el valor del ruido.
         *
         * Devuelve un valor comprendido
         * entre -1 y 1.
         *
         * @param {number} x
         * @param {number} y
         *
         * @returns {number}
         */
        obtener(x, y) {

            return ruido2D(

                x * frecuencia,

                y * frecuencia

            );

        }

    };

}