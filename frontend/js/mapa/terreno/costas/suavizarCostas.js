/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : suavizarCostas.js
Ruta     : frontend/js/mapa/terreno/costas/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Suaviza el mapa de costas eliminando pequeñas
irregularidades producidas por la resolución
de la cuadrícula.

No modifica el mapa de elevación.

==========================================================
*/

/**
 * Suaviza un mapa de costas.
 *
 * @param {boolean[][]} mapaCostas
 * @param {Object} opciones
 * @returns {boolean[][]}
 */
export function suavizarCostas(mapaCostas, opciones = {}) {

    if (!Array.isArray(mapaCostas) || mapaCostas.length === 0) {
        throw new Error("El mapa de costas no es válido.");
    }

    const {
        pasadas = 1,
        vecinosMinimos = 3
    } = opciones;

    let resultado = copiarMapa(mapaCostas);

    for (let i = 0; i < pasadas; i++) {
        resultado = suavizarPaso(resultado, vecinosMinimos);
    }

    return resultado;

}

/**
 * Ejecuta una pasada de suavizado.
 *
 * @param {boolean[][]} mapa
 * @param {number} vecinosMinimos
 * @returns {boolean[][]}
 */
function suavizarPaso(mapa, vecinosMinimos) {

    const alto = mapa.length;
    const ancho = mapa[0].length;

    const nuevoMapa = copiarMapa(mapa);

    const vecinos = [
        [-1, -1], [0, -1], [1, -1],
        [-1,  0],          [1,  0],
        [-1,  1], [0,  1], [1,  1]
    ];

    for (let y = 0; y < alto; y++) {

        for (let x = 0; x < ancho; x++) {

            let total = 0;

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

                if (mapa[ny][nx]) {
                    total++;
                }

            }

            if (mapa[y][x]) {

                // Elimina pequeñas puntas aisladas.
                if (total < vecinosMinimos) {
                    nuevoMapa[y][x] = false;
                }

            } else {

                // Rellena pequeños huecos.
                if (total > 6) {
                    nuevoMapa[y][x] = true;
                }

            }

        }

    }

    return nuevoMapa;

}

/**
 * Copia una matriz bidimensional.
 *
 * @param {boolean[][]} mapa
 * @returns {boolean[][]}
 */
function copiarMapa(mapa) {

    return mapa.map(fila => [...fila]);

}