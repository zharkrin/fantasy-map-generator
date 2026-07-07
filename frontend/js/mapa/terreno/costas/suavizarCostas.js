/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : suavizarCostas.js
Ruta     : frontend/js/mapa/terreno/costas/suavizarCostas.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Suaviza las transiciones entre tierra y agua.

Este módulo reduce irregularidades producidas por la
clasificación inicial de costas, generando perfiles más
naturales.

No modifica el nivel del mar.

==========================================================
*/

/**
 * Suaviza las costas.
 *
 * @param {Array<Array<Object>>} mapa
 * @param {number} iteraciones
 *
 * @returns {Array<Array<Object>>}
 */
export function suavizarCostas(
    mapa,
    iteraciones = 1
) {

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

            const celda = { ...mapa[y][x] };

            let vecinosCosta = 0;
            let vecinos = 0;

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

                    vecinos++;

                    if (mapa[ny][nx].esCosta) {
                        vecinosCosta++;
                    }

                }

            }

            /*
             * Elimina pequeñas irregularidades.
             */

            if (
                celda.esCosta &&
                vecinosCosta <= 1
            ) {
                celda.esCosta = false;
            }

            if (
                !celda.esCosta &&
                vecinosCosta >= 5
            ) {
                celda.esCosta = true;
            }

            fila.push(celda);

        }

        nuevoMapa.push(fila);

    }

    return nuevoMapa;

}