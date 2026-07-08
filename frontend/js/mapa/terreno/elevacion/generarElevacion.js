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
valores quedan normalizados entre 0 y 1.

Opcionalmente puede recibir una función modificadora
para alterar la elevación durante la generación
sin modificar este archivo.

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
        lacunaridad = 2.0,

        /**
         * Función opcional para modificar la elevación.
         *
         * Firma:
         *
         * (valor, x, y) => nuevoValor
         */
        modificador = null

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

    // --------------------------------------------------
    // Primera pasada: generar elevación
    // --------------------------------------------------

    for (let y = 0; y < alto; y++) {

        mapa[y] = [];

        for (let x = 0; x < ancho; x++) {

            let valor = ruido.obtener(x, y);

            if (typeof modificador === "function") {
                valor = modificador(valor, x, y);
            }

            mapa[y][x] = valor;

            if (valor < minimo) {
                minimo = valor;
            }

            if (valor > maximo) {
                maximo = valor;
            }

        }

    }

    // --------------------------------------------------
    // Evitar división entre cero
    // --------------------------------------------------

    const rango = (maximo - minimo) || 1;

    // --------------------------------------------------
    // Segunda pasada: normalizar entre 0 y 1
    // --------------------------------------------------

    for (let y = 0; y < alto; y++) {

        for (let x = 0; x < ancho; x++) {

            mapa[y][x] = (mapa[y][x] - minimo) / rango;

        }

    }

    return mapa;

}