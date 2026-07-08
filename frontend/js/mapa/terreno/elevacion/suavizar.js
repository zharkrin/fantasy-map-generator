/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : suavizar.js
Ruta     : frontend/js/mapa/terreno/elevacion/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Suaviza un mapa de elevación mediante un filtro
de promedio sobre las celdas vecinas.

No modifica la matriz original.

==========================================================
*/

/**
 * Suaviza un mapa de elevación.
 *
 * @param {number[][]} mapa
 * @param {Object} opciones
 * @returns {number[][]}
 */
export function suavizarElevacion(mapa, opciones = {}) {

    if (!Array.isArray(mapa) || mapa.length === 0) {
        throw new Error("El mapa de elevación no es válido.");
    }

    const {

        pasadas = 1

    } = opciones;

    let resultado = copiarMapa(mapa);

    for (let i = 0; i < pasadas; i++) {
        resultado = suavizar(resultado);
    }

    return resultado;

}

/**
 * Realiza una pasada de suavizado.
 *
 * @param {number[][]} mapa
 * @returns {number[][]}
 */
function suavizar(mapa) {

    const alto = mapa.length;
    const ancho = mapa[0].length;

    const nuevoMapa = [];

    for (let y = 0; y < alto; y++) {

        nuevoMapa[y] = [];

        for (let x = 0; x < ancho; x++) {

            let suma = 0;
            let vecinos = 0;

            for (let dy = -1; dy <= 1; dy++) {

                for (let dx = -1; dx <= 1; dx++) {

                    const nx = x + dx;
                    const ny = y + dy;

                    if (
                        nx >= 0 &&
                        nx < ancho &&
                        ny >= 0 &&
                        ny < alto
                    ) {

                        suma += mapa[ny][nx];
                        vecinos++;

                    }

                }

            }

            nuevoMapa[y][x] = suma / vecinos;

        }

    }

    return nuevoMapa;

}

/**
 * Copia una matriz bidimensional.
 *
 * @param {number[][]} mapa
 * @returns {number[][]}
 */
function copiarMapa(mapa) {

    return mapa.map(fila => [...fila]);

}