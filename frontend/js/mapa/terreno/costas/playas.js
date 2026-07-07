/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : playas.js
Ruta     : frontend/js/mapa/terreno/costas/playas.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Marca las playas del mapa.

Una playa es una celda de costa cuya elevación se
encuentra próxima al nivel del mar.

Este módulo únicamente clasifica las playas.
No modifica la elevación ni genera arena gráfica.

==========================================================
*/

/**
 * Detecta playas.
 *
 * @param {Array<Array<Object>>} mapa
 * @param {number} nivelMar
 * @param {number} margen
 *
 * @returns {Array<Array<Object>>}
 */
export function detectarPlayas(
    mapa,
    nivelMar = 0.5,
    margen = 0.03
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

            const original = mapa[y][x];

            const celda = {

                ...original,

                esPlaya: false

            };

            if (
                celda.esCosta &&
                celda.elevacion <= nivelMar + margen
            ) {

                celda.esPlaya = true;

            }

            fila.push(celda);

        }

        resultado.push(fila);

    }

    return resultado;

}