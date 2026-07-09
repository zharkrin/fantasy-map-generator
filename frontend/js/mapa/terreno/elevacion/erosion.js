/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : erosion.js
Ruta     : frontend/js/mapa/terreno/elevacion/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Aplica una erosión térmica sencilla sobre un mapa
de elevación.

Esta primera versión reduce pendientes demasiado
pronunciadas trasladando parte de la altura hacia
las celdas vecinas más bajas.

No modifica el mapa original.

==========================================================
*/

/**
 * Aplica erosión al mapa.
 *
 * @param {number[][]} mapa
 * @param {Object} opciones
 * @returns {number[][]}
 */
export function erosionarElevacion(mapa, opciones = {}) {

    if (!Array.isArray(mapa) || mapa.length === 0) {
        throw new Error("El mapa de elevación no es válido.");
    }

    const {
        iteraciones = 10,
        talud = 0.05,
        intensidad = 0.5
    } = opciones;

    let resultado = copiarMapa(mapa);

    for (let i = 0; i < iteraciones; i++) {
        resultado = erosionarPaso(
            resultado,
            talud,
            intensidad
        );
    }

    return resultado;

}

/**
 * Ejecuta una iteración de erosión.
 *
 * @param {number[][]} mapa
 * @param {number} talud
 * @param {number} intensidad
 * @returns {number[][]}
 */
function erosionarPaso(mapa, talud, intensidad) {

    const alto = mapa.length;
    const ancho = mapa[0].length;

    const nuevo = copiarMapa(mapa);

    const vecinos = [
        [-1, -1], [0, -1], [1, -1],
        [-1,  0],          [1,  0],
        [-1,  1], [0,  1], [1,  1]
    ];

    for (let y = 0; y < alto; y++) {

        for (let x = 0; x < ancho; x++) {

            const altura = mapa[y][x];

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

                const diferencia = altura - mapa[ny][nx];

                if (diferencia > talud) {

                    const transporte =
                        (diferencia - talud) *
                        intensidad *
                        0.5;

                    nuevo[y][x] -= transporte;
                    nuevo[ny][nx] += transporte;

                }

            }

        }

    }

    return nuevo;

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