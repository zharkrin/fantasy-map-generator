/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : generarElevacion.js
Ruta     : frontend/js/mapa/terreno/elevacion/generarElevacion.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Genera el mapa base de elevación.

Este módulo únicamente crea la estructura inicial de
celdas y asigna un valor de elevación.

No genera:

- Continentes
- Costas
- Montañas
- Ríos
- Biomas

Todo eso se realizará en fases posteriores.

==========================================================
*/

import { random } from "../../../core/random/index.js";

/**
 * Genera un mapa de elevación.
 *
 * @param {number} ancho
 * @param {number} alto
 *
 * @returns {Array<Array<Object>>}
 */
export function generarElevacion(ancho, alto) {

    if (ancho <= 0 || alto <= 0) {

        throw new Error(
            "Las dimensiones del mapa deben ser mayores que cero."
        );

    }

    const mapa = [];

    for (let y = 0; y < alto; y++) {

        const fila = [];

        for (let x = 0; x < ancho; x++) {

            fila.push(crearCelda(x, y));

        }

        mapa.push(fila);

    }

    return mapa;

}

/**
 * Crea una celda del mapa.
 *
 * @param {number} x
 * @param {number} y
 *
 * @returns {Object}
 */
function crearCelda(x, y) {

    return {

        /**
         * Coordenadas.
         */
        x,
        y,

        /**
         * Elevación.
         *
         * En esta primera fase es únicamente ruido
         * aleatorio. Posteriormente será sustituido
         * por Simplex Noise.
         */
        elevacion: random.random()

    };

}