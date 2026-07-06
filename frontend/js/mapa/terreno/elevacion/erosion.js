/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : erosion.js
Ruta     : frontend/js/mapa/terreno/elevacion/erosion.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Aplica una erosión básica sobre el mapa de elevación.

Esta primera implementación reduce las diferencias
extremas de altura redistribuyendo parte de la elevación
hacia las celdas vecinas.

En fases posteriores será sustituida por un sistema de
erosión hidráulica y térmica mucho más avanzado.

==========================================================
*/

/**
 * Aplica erosión básica al mapa.
 *
 * @param {Array<Array<Object>>} mapa
 * @param {number} intensidad
 *
 * @returns {Array<Array<Object>>}
 */
export function erosionarElevacion(
    mapa,
    intensidad = 0.15
) {

    if (!Array.isArray(mapa) || mapa.length === 0) {
        return mapa;
    }

    const alto = mapa.length;
    const ancho = mapa[0].length;

    const nuevoMapa = [];

    for (let y = 0; y < alto; y++) {

        const fila = [];

        for (let x = 0; x < ancho; x++) {

            const celda = mapa[y][x];

            let suma = 0;
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

                    suma += mapa[ny][nx].elevacion;
                    vecinos++;

                }

            }

            const mediaVecinos =
                vecinos > 0
                    ? suma / vecinos
                    : celda.elevacion;

            const nuevaElevacion =
                celda.elevacion +
                (mediaVecinos - celda.elevacion) * intensidad;

            fila.push({

                ...celda,

                elevacion: limitar(nuevaElevacion)

            });

        }

        nuevoMapa.push(fila);

    }

    return nuevoMapa;

}

/**
 * Limita un valor al rango 0–1.
 *
 * @param {number} valor
 *
 * @returns {number}
 */
function limitar(valor) {

    if (valor < 0) {
        return 0;
    }

    if (valor > 1) {
        return 1;
    }

    return valor;

}