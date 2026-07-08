/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : generarElevacion.js
Ruta     : frontend/js/mapa/terreno/elevacion/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Generador procedural de elevación.

Genera un mapa de alturas utilizando el sistema
de ruido configurado en crearRuido().

El resultado es una matriz bidimensional cuyos
valores están normalizados entre 0 y 1.

==========================================================
*/

import { crearRuido } from "../ruido/crearRuido.js";

/**
 * Genera un mapa de elevación.
 *
 * @param {Object} opciones
 * @returns {number[][]}
 */
export function generarElevacion(opciones = {}) {

    const {

        ancho = 512,
        alto = 512,

        semilla = 12345,

        frecuencia = 0.003,

        usarFBM = true,

        octavas = 6,
        persistencia = 0.5,
        lacunaridad = 2.0

    } = opciones;

    const ruido = crearRuido({

        motor: "simplex",

        semilla,

        frecuencia,

        usarFBM,

        octavas,

        persistencia,

        lacunaridad

    });

    const mapa = [];

    let minimo = Infinity;
    let maximo = -Infinity;

    // Primera pasada: generar valores

    for (let y = 0; y < alto; y++) {

        mapa[y] = [];

        for (let x = 0; x < ancho; x++) {

            const valor = ruido.obtener(x, y);

            mapa[y][x] = valor;

            if (valor < minimo) minimo = valor;
            if (valor > maximo) maximo = valor;

        }

    }

    // Evitar división entre cero

    const rango = maximo - minimo || 1;

    // Segunda pasada: normalizar entre 0 y 1

    for (let y = 0; y < alto; y++) {

        for (let x = 0; x < ancho; x++) {

            mapa[y][x] = (mapa[y][x] - minimo) / rango;

        }

    }

    return mapa;

}