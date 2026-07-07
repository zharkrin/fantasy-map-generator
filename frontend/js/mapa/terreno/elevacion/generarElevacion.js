/*
==========================================================
Proyecto : Fantasy Map Generator

Archivo:
generarElevacion.js

Ruta:
frontend/js/mapa/terreno/elevacion/

Licencia:
MIT
==========================================================
*/

/**
 * Genera el mapa base de elevación.
 *
 * Este módulo NO decide cómo se genera el ruido.
 * Recibe una función generadora externa.
 *
 * Esto permite utilizar:
 *
 * - Simplex
 * - Perlin
 * - Worley
 * - FBM
 * - Ridged
 * - Domain Warp
 *
 * sin modificar este archivo.
 */

/**
 * Genera el mapa de elevación.
 *
 * @param {Object} opciones
 * @returns {Array<Array<Object>>}
 */
export function generarElevacion(opciones = {}) {

    const {

        ancho = 512,

        alto = 512,

        escala = 1,

        generadorRuido

    } = opciones;

    if (typeof generadorRuido !== "function") {

        throw new Error(
            "Debe proporcionarse un generador de ruido."
        );

    }

    const mapa = [];

    for (let y = 0; y < alto; y++) {

        const fila = [];

        for (let x = 0; x < ancho; x++) {

            fila.push({

                x,

                y,

                elevacion: generadorRuido(
                    x * escala,
                    y * escala
                )

            });

        }

        mapa.push(fila);

    }

    return mapa;

}