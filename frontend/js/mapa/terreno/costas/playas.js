/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : playas.js
Ruta     : frontend/js/mapa/terreno/costas/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Genera un mapa de playas.

Una playa es una celda de costa que cumple:

- Está cerca del nivel del mar.
- Tiene una pendiente suave.

Este módulo únicamente clasifica las playas.
No modifica la elevación del terreno.

==========================================================
*/

/**
 * Detecta las playas del mapa.
 *
 * @param {number[][]} mapaElevacion
 * @param {boolean[][]} mapaCostas
 * @param {Object} opciones
 * @returns {boolean[][]}
 */
export function detectarPlayas(
    mapaElevacion,
    mapaCostas,
    opciones = {}
) {

    if (!Array.isArray(mapaElevacion) || mapaElevacion.length === 0) {
        throw new Error("El mapa de elevación no es válido.");
    }

    if (!Array.isArray(mapaCostas) || mapaCostas.length !== mapaElevacion.length) {
        throw new Error("El mapa de costas no es válido.");
    }

    const {

        nivelMar = 0.50,

        alturaMaxima = 0.08,

        pendienteMaxima = 0.10

    } = opciones;

    const alto = mapaElevacion.length;
    const ancho = mapaElevacion[0].length;

    const mapaPlayas = Array.from(
        { length: alto },
        () => Array(ancho).fill(false)
    );

    const vecinos = [
        [-1,-1],[0,-1],[1,-1],
        [-1, 0],       [1, 0],
        [-1, 1],[0, 1],[1, 1]
    ];

    for (let y = 0; y < alto; y++) {

        for (let x = 0; x < ancho; x++) {

            if (!mapaCostas[y][x]) {
                continue;
            }

            const altura = mapaElevacion[y][x];

            if (altura > nivelMar + alturaMaxima) {
                continue;
            }

            let pendiente = 0;
            let vecinosValidos = 0;

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

                pendiente += Math.abs(
                    altura - mapaElevacion[ny][nx]
                );

                vecinosValidos++;

            }

            pendiente /= vecinosValidos;

            if (pendiente <= pendienteMaxima) {

                mapaPlayas[y][x] = true;

            }

        }

    }

    return mapaPlayas;

}