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
existente utilizando dos capas de ruido:

- Ruido de macizos (baja frecuencia)
- Ruido de detalle (alta frecuencia)

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

        // Ruido de detalle
        frecuencia = 0.0015,

        // Ruido de macizos
        frecuenciaMacizos = 0.00045,

        intensidad = 0.35,

        umbral = 0.72,

        umbralMacizos = 0.55,

        usarFBM = true,

        octavas = 5,

        persistencia = 0.5,

        lacunaridad = 2.0

    } = opciones;

    // Generador de detalle

    const ruidoDetalle = crearRuido({

        motor: "simplex",

        semilla: semilla + 1000,

        frecuencia,

        usarFBM,

        octavas,

        persistencia,

        lacunaridad

    });

    // Generador de macizos

    const ruidoMacizos = crearRuido({

        motor: "simplex",

        semilla: semilla + 2000,

        frecuencia: frecuenciaMacizos,

        usarFBM: true,

        octavas: 3,

        persistencia: 0.5,

        lacunaridad: 2.0

    });

    const alto = mapaElevacion.length;
    const ancho = mapaElevacion[0].length;

    const resultado = mapaElevacion.map(fila => [...fila]);

    const rangoDetalle = 1 - umbral;
    const rangoMacizos = 1 - umbralMacizos;

    for (let y = 0; y < alto; y++) {

        for (let x = 0; x < ancho; x++) {

            const altura = resultado[y][x];

            // Nunca generar montañas bajo el mar.

            if (altura <= nivelMar) {
                continue;
            }

            const macizo = ruidoMacizos.obtener(x, y);

            if (macizo < umbralMacizos) {
                continue;
            }

            const detalle = ruidoDetalle.obtener(x, y);

            if (detalle < umbral) {
                continue;
            }

            const factorMacizo =
                (macizo - umbralMacizos) / rangoMacizos;

            const factorDetalle =
                (detalle - umbral) / rangoDetalle;

            const factor = factorMacizo * factorDetalle;

            resultado[y][x] += factor * intensidad;

            if (resultado[y][x] > 1) {
                resultado[y][x] = 1;
            }

        }

    }

    return resultado;

}