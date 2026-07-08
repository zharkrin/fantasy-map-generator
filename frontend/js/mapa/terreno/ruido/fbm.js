/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : fbm.js
Ruta     : frontend/js/mapa/terreno/ruido/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Generador Fractal Brownian Motion (fBm).

Este módulo recibe un motor de ruido (por ejemplo,
Simplex) y combina varias octavas para obtener un
terreno más natural.

No depende de ningún motor concreto.
==========================================================
*/

/**
 * Crea un generador fBm.
 *
 * @param {Object} motor Motor de ruido con el método obtener(x, y).
 * @param {Object} opciones Configuración del fBm.
 *
 * @returns {Object}
 */
export function crearFBM(motor, opciones = {}) {

    if (!motor || typeof motor.obtener !== "function") {
        throw new Error(
            "El motor de ruido debe implementar obtener(x, y)."
        );
    }

    const {
        octavas = 6,
        persistencia = 0.5,
        lacunaridad = 2.0
    } = opciones;

    return {

        /**
         * Obtiene el valor fBm para unas coordenadas.
         *
         * @param {number} x
         * @param {number} y
         * @returns {number}
         */
        obtener(x, y) {

            let amplitud = 1;
            let frecuencia = 1;

            let suma = 0;
            let amplitudMaxima = 0;

            for (let i = 0; i < octavas; i++) {

                suma +=
                    motor.obtener(
                        x * frecuencia,
                        y * frecuencia
                    ) * amplitud;

                amplitudMaxima += amplitud;

                amplitud *= persistencia;
                frecuencia *= lacunaridad;
            }

            return suma / amplitudMaxima;
        }

    };

}