/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : suavizar.js
Ruta     : frontend/js/mapa/terreno/elevacion/suavizar.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Suaviza el mapa de elevación aplicando un filtro de media.

Este módulo reduce cambios bruscos de altura y genera
transiciones más naturales.

No modifica la estructura de las celdas, únicamente el
valor de elevación.

==========================================================
*/

/**
 * Suaviza un mapa de elevación.
 *
 * @param {Array<Array<Object>>} mapa
 * @param {number} iteraciones
 *
 * @returns {Array<Array<Object>>}
 */
export function suavizarElevacion(mapa, iteraciones = 1) {

    if (!Array.isArray(mapa) || mapa.length === 0) {
        return mapa;
    }

    let resultado = mapa;

    for (let i = 0; i < iteraciones; i++) {
        resultado = aplicarSuavizado(resultado);
    }

    return resultado;

}

/**
 * Aplica una iteración de suavizado.
 *
 * @param {Array<Array<Object>>} mapa
 *
 * @returns {Array<Array<Object>>}
 */
function aplicarSuavizado(mapa) {

    const alto = mapa.length;
    const ancho = mapa[0].length;

    const nuevoMapa = [];

    for (let y = 0; y < alto; y++) {

        const fila = [];

        for (let x = 0; x < ancho; x++) {

            let suma = 0;
            let vecinos = 0;

            for (let dy = -1; dy <= 1; dy++) {

                for (let dx = -1; dx <= 1; dx++) {

                    const nx = x + dx;
                    const ny = y + dy;

                    if (
                        nx < 0 ||
                        ny < 0 ||
                        nx >= ancho ||
                        ny >= alto
                    ) {
                        continue;
                    }

                    suma += mapa[ny][nx].elevacion;
                    vecinos++;

                }

            }

            fila.push({

                ...mapa[y][x],

                elevacion: suma / vecinos

            });

        }

        nuevoMapa.push(fila);

    }

    return nuevoMapa;

}