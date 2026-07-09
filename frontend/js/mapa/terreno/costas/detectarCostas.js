/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : detectarCostas.js
Ruta     : frontend/js/mapa/terreno/costas/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Detecta las costas del mapa.

Una costa es una celda de tierra que tiene al menos
un vecino de agua.

Este módulo no modifica la elevación y únicamente
clasifica las celdas.

==========================================================
*/

/**
 * Detecta las costas del mapa.
 *
 * @param {number[][]} mapaElevacion
 * @param {Object} opciones
 * @returns {boolean[][]}
 */
export function detectarCostas(mapaElevacion, opciones = {}) {

    if (!Array.isArray(mapaElevacion) || mapaElevacion.length === 0) {
        throw new Error("El mapa de elevación no es válido.");
    }

    const {
        nivelMar = 0.50
    } = opciones;

    const alto = mapaElevacion.length;
    const ancho = mapaElevacion[0].length;

    const mapaCostas = Array.from(
        { length: alto },
        () => Array(ancho).fill(false)
    );

    const vecinos = [
        [-1, -1], [0, -1], [1, -1],
        [-1,  0],          [1,  0],
        [-1,  1], [0,  1], [1,  1]
    ];

    for (let y = 0; y < alto; y++) {

        for (let x = 0; x < ancho; x++) {

            const altura = mapaElevacion[y][x];

            // Solo analizamos tierra.
            if (altura <= nivelMar) {
                continue;
            }

            let esCosta = false;

            for (const [dx, dy] of vecinos) {

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

                if (mapaElevacion[ny][nx] <= nivelMar) {
                    esCosta = true;
                    break;
                }

            }

            mapaCostas[y][x] = esCosta;

        }

    }

    return mapaCostas;

}