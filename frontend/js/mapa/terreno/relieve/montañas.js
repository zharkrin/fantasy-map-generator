/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : montañas.js
Ruta     : frontend/js/mapa/terreno/relieve/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Generador de montañas.

Versión 2.2.1B

Mejoras respecto a la versión A:

- Macizos orientados mediante rotación.
- Elongación configurable.
- Centro del mapa como origen de la transformación.
- Mejor comportamiento en mapas grandes.

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

        lacunaridad = 2.0,

        // NUEVO (2.2.1B)

        direccion = 45,

        elongacion = 2.0

    } = opciones;

    //------------------------------------------------------
    // Generador de detalle
    //------------------------------------------------------

    const ruidoDetalle = crearRuido({

        motor: "simplex",

        semilla: semilla + 1000,

        frecuencia,

        usarFBM,

        octavas,

        persistencia,

        lacunaridad

    });

    //------------------------------------------------------
    // Generador de macizos
    //------------------------------------------------------

    const ruidoMacizos = crearRuido({

        motor: "simplex",

        semilla: semilla + 2000,

        frecuencia: frecuenciaMacizos,

        usarFBM: true,

        octavas: 3,

        persistencia: 0.5,

        lacunaridad: 2.0

    });

    //------------------------------------------------------

    const alto = mapaElevacion.length;
    const ancho = mapaElevacion[0].length;

    const resultado = mapaElevacion.map(fila => [...fila]);

    const rangoDetalle = 1 - umbral;
    const rangoMacizos = 1 - umbralMacizos;

    //------------------------------------------------------
    // Transformación para orientar macizos
    //------------------------------------------------------

    const radianes = direccion * Math.PI / 180;

    const cos = Math.cos(radianes);
    const sin = Math.sin(radianes);

    const centroX = ancho / 2;
    const centroY = alto / 2;

    //------------------------------------------------------

    for (let y = 0; y < alto; y++) {

        for (let x = 0; x < ancho; x++) {

            const altura = resultado[y][x];

            // Nunca generar montañas bajo el mar.

            if (altura <= nivelMar) {
                continue;
            }

            //--------------------------------------------------
            // Coordenadas centradas
            //--------------------------------------------------

            const px = x - centroX;
            const py = y - centroY;

            //--------------------------------------------------
            // Rotación
            //--------------------------------------------------

            const rx =
                (px * cos - py * sin) * elongacion;

            const ry =
                (px * sin + py * cos);

            //--------------------------------------------------
            // Volver al sistema del mapa
            //--------------------------------------------------

            const ruidoX = rx + centroX;
            const ruidoY = ry + centroY;

            //--------------------------------------------------

            const macizo =
                ruidoMacizos.obtener(
                    ruidoX,
                    ruidoY
                );

            if (macizo < umbralMacizos) {
                continue;
            }

            const detalle =
                ruidoDetalle.obtener(
                    x,
                    y
                );

            if (detalle < umbral) {
                continue;
            }

            const factorMacizo =
                (macizo - umbralMacizos) /
                rangoMacizos;

            const factorDetalle =
                (detalle - umbral) /
                rangoDetalle;

            const factor =
                factorMacizo *
                factorDetalle;

            resultado[y][x] +=
                factor *
                intensidad;

            if (resultado[y][x] > 1) {
                resultado[y][x] = 1;
            }

        }

    }

    return resultado;

}