/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : detectarCostas.js
Ruta     : frontend/js/mapa/terreno/costas/detectarCostas.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Detecta las celdas costeras del mapa.

Una celda es considerada costa cuando:

- Está sobre el nivel del mar.
- Tiene al menos un vecino bajo el nivel del mar.

Este módulo únicamente marca las costas.
No genera playas ni modifica la elevación.

==========================================================
*/

/**
 * Detecta las costas del mapa.
 *
 * @param {Array<Array<Object>>} mapa
 * @param {number} nivelMar
 *
 * @returns {Array<Array<Object>>}
 */
export function detectarCostas(
    mapa,
    nivelMar = 0.5
) {

    if (!Array.isArray(mapa) || mapa.length === 0) {
        return mapa;
    }

    const alto = mapa.length;
    const ancho = mapa[0].length;

    const resultado = [];

    for (let y = 0; y < alto; y++) {

        const fila = [];

        for (let x = 0; x < ancho; x++) {

            const celda = {

                ...mapa[y][x]
            };

            celda.esMar =
                celda.elevacion < nivelMar;

            celda.esCosta = false;

            if (!celda.esMar) {

                celda.esCosta = tieneVecinoMar(
                    mapa,
                    x,
                    y,
                    nivelMar
                );

            }

            fila.push(celda);

        }

        resultado.push(fila);

    }

    return resultado;

}

/**
 * Comprueba si una celda tiene
 * al menos un vecino marino.
 *
 * @param {Array<Array<Object>>} mapa
 * @param {number} x
 * @param {number} y
 * @param {number} nivelMar
 *
 * @returns {boolean}
 */
function tieneVecinoMar(
    mapa,
    x,
    y,
    nivelMar
) {

    const alto = mapa.length;
    const ancho = mapa[0].length;

    for (let dy = -1; dy <= 1; dy++) {

        for (let dx = -1; dx <= 1; dx++) {

            if (dx === 0 && dy === 0) {
                continue;
            }

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

            if (
                mapa[ny][nx].elevacion < nivelMar
            ) {
                return true;
            }

        }

    }

    return false;

}