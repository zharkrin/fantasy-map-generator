/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : montañas.js
Ruta     : frontend/js/mapa/terreno/relieve/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Generador de montañas.

Añade macizos montañosos sobre la elevación
existente utilizando ruido procedural.

No modifica el mapa original.

==========================================================
*/

import { crearRuido } from "../ruido/crearRuido.js";

/**
 * Genera montañas sobre un mapa de elevación.
 *
 * @param {number[][]} mapaElevacion
 * @param {Object} opciones
 * @returns {number[][]}
 */
export function generarMontanas(
    mapaElevacion,
    opciones = {}
) {

    if (!Array.isArray(mapaElevacion) || mapaElevacion.length === 0) {
        throw new Error("El mapa de elevación no es válido.");
    }

    const {

        semilla = 12345,

        nivelMar = 0.50,

        frecuencia = 0.0015,

        intensidad = 0.35,

        umbral = 0.72,

        usarFBM = true,

        octavas = 5,

        persistencia = 0.5,

        lacunaridad = 2.0

    } = opciones;

    const ruido = crearRuido({

        motor: "simplex",

        semilla: semilla + 1000,

        frecuencia,

        usarFBM,

        octavas,

        persistencia,

        lacunaridad

    });

    const alto = mapaElevacion.length;
    const ancho = mapaElevacion[0].length;

    const resultado = mapaElevacion.map(fila => [...fila]);

    for (let y = 0; y < alto; y++) {

        for (let x = 0; x < ancho; x++) {

            const altura = resultado[y][x];

            // Nunca generar montañas bajo el mar.
            if (altura <= nivelMar) {
                continue;
            }

            const valorRuido = ruido.obtener(x, y);

            if (valorRuido < umbral) {
                continue;
            }

            // Intensidad progresiva.
            const factor = (valorRuido - umbral) / (1 - umbral);

            resultado[y][x] += factor * intensidad;

            // Limitar a 1.0
            if (resultado[y][x] > 1) {
                resultado[y][x] = 1;
            }

        }

    }

    return resultado;

}