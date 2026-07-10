/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : cordilleras.js
Ruta     : frontend/js/mapa/terreno/relieve/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Generador de cordilleras.

Este módulo conecta macizos montañosos ya existentes
para formar sistemas montañosos largos y naturales.

No crea montañas nuevas desde cero.
Trabaja sobre el mapa generado por montañas.js.

No modifica el mapa original.

==========================================================
*/

import { crearRuido } from "../ruido/crearRuido.js";

/**
 * Genera cordilleras sobre un mapa de elevación.
 *
 * @param {number[][]} mapaElevacion
 * @param {Object} opciones
 * @returns {number[][]}
 */
export function generarCordilleras(
    mapaElevacion,
    opciones = {}
) {

    if (!Array.isArray(mapaElevacion) || mapaElevacion.length === 0) {
        throw new Error(
            "El mapa de elevación no es válido."
        );
    }

    const {

        semilla = 12345,

        nivelMar = 0.50,

        umbralMontana = 0.75,

        intensidad = 0.18,

        frecuencia = 0.002,
                usarFBM = true,

        octavas = 4,

        persistencia = 0.50,

        lacunaridad = 2.0,

        cantidadCordilleras = 8,

        longitudMinima = 40,

        longitudMaxima = 180,

        anchoBase = 3,

        anchoMaximo = 8

    } = opciones;

    //------------------------------------------------------
    // Generador de variación para las cordilleras
    //------------------------------------------------------

    const ruidoCordillera = crearRuido({

        motor: "simplex",

        semilla: semilla + 3000,

        frecuencia,

        usarFBM,

        octavas,

        persistencia,

        lacunaridad

    });

    const alto = mapaElevacion.length;
    const ancho = mapaElevacion[0].length;

    const resultado =
        mapaElevacion.map(fila => [...fila]);

    //------------------------------------------------------
    // Buscar todos los posibles picos
    //------------------------------------------------------

    const picos = [];

    for (let y = 1; y < alto - 1; y++) {

        for (let x = 1; x < ancho - 1; x++) {

            if (resultado[y][x] >= umbralMontana) {

                picos.push({
                    x,
                    y,
                    altura: resultado[y][x]
                });

            }

        }

    }
        //------------------------------------------------------
    // Si no existen suficientes picos no se generan
    // cordilleras.
    //------------------------------------------------------

    if (picos.length < 2) {
        return resultado;
    }

    //------------------------------------------------------
    // Generador pseudoaleatorio determinista
    //------------------------------------------------------

    let estado = semilla + 987654321;

    function random() {

        estado = (estado * 1664525 + 1013904223) >>> 0;

        return estado / 4294967296;

    }

    //------------------------------------------------------
    // Crear varias cordilleras
    //------------------------------------------------------

    for (
        let indiceCordillera = 0;
        indiceCordillera < cantidadCordilleras;
        indiceCordillera++
    ) {

        const origen =
            picos[Math.floor(random() * picos.length)];

        let destino =
            picos[Math.floor(random() * picos.length)];

        let intentos = 0;

        while (
            origen === destino &&
            intentos < 20
        ) {

            destino =
                picos[Math.floor(random() * picos.length)];

            intentos++;

        }

        if (origen === destino) {
            continue;
        }
                //--------------------------------------------------
        // Crear trayectoria entre los dos macizos
        //--------------------------------------------------

        const camino = crearTrayectoria(

            origen.x,
            origen.y,

            destino.x,
            destino.y,

            ancho,
            alto,

            resultado

        );


        //--------------------------------------------------
        // Aplicar elevación a la trayectoria
        //--------------------------------------------------

        for (const punto of camino) {

            elevarZonaCordillera(

                resultado,

                punto.x,

                punto.y,

                anchoBase,

                anchoMaximo,

                intensidad,

                ruidoCordillera

            );

        }

    }


    return resultado;

}


/**
 * Crea una trayectoria irregular entre dos puntos.
 *
 * No utiliza una línea recta perfecta para evitar
 * cordilleras artificiales.
 *
 * @returns {Array}
 */
function crearTrayectoria(

    x1,
    y1,

    x2,
    y2,

    ancho,
    alto,

    mapa

) {

    const camino = [];

    let x = x1;
    let y = y1;

    const distancia =
        Math.max(
            Math.abs(x2 - x1),
            Math.abs(y2 - y1)
        );

    const pasos =
        Math.max(
            distancia,
            1
        );
            //--------------------------------------------------
    // Avance progresivo hacia el destino
    //--------------------------------------------------

    for (let i = 0; i <= pasos; i++) {

        const progreso =
            i / pasos;


        let nx =
            Math.round(
                x1 +
                (x2 - x1) * progreso
            );


        let ny =
            Math.round(
                y1 +
                (y2 - y1) * progreso
            );


        //--------------------------------------------------
        // Desviación natural del eje
        //--------------------------------------------------

        if (i !== 0 && i !== pasos) {

            const desviacionX =
                Math.sin(i * 0.8) * 2;

            const desviacionY =
                Math.cos(i * 0.6) * 2;


            nx += Math.round(desviacionX);

            ny += Math.round(desviacionY);

        }


        //--------------------------------------------------
        // Mantener dentro del mapa
        //--------------------------------------------------

        nx = Math.max(
            0,
            Math.min(
                ancho - 1,
                nx
            )
        );


        ny = Math.max(
            0,
            Math.min(
                alto - 1,
                ny
            )
        );


        camino.push({

            x: nx,

            y: ny

        });

    }


    return camino;

}


/**
 * Aumenta la elevación alrededor de un punto
 * de cordillera.
 */
function elevarZonaCordillera(

    mapa,

    x,

    y,

    anchoBase,

    anchoMaximo,

    intensidad,

    ruido

) {
    const alto = mapa.length;
    const ancho = mapa[0].length;


    //--------------------------------------------------
    // Radio variable del relieve
    //--------------------------------------------------

    const variacion =
        ruido.obtener(x, y);


    const radio =
        Math.max(
            anchoBase,
            anchoBase +
            Math.floor(
                variacion * anchoMaximo
            )
        );


    //--------------------------------------------------
    // Aplicar elevación alrededor del eje
    //--------------------------------------------------

    for (
        let dy = -radio;
        dy <= radio;
        dy++
    ) {

        for (
            let dx = -radio;
            dx <= radio;
            dx++
        ) {


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


            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (distancia > radio) {
                continue;
            }


            //--------------------------------------------------
            // Centro más elevado, bordes suaves
            //--------------------------------------------------

            const factor =
                1 -
                (
                    distancia /
                    radio
                );


            mapa[ny][nx] +=
                factor *
                intensidad;


            if (mapa[ny][nx] > 1) {

                mapa[ny][nx] = 1;

            }

        }

    }

}
/**
 * Calcula la distancia entre dos puntos.
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
function distanciaEntrePuntos(
    x1,
    y1,
    x2,
    y2
) {

    const dx = x2 - x1;
    const dy = y2 - y1;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/**
 * Busca el punto de mayor elevación
 * cercano a una posición.
 *
 * Preparado para futuras mejoras:
 * tectónica, placas y orogenia.
 *
 * @param {number[][]} mapa
 * @param {number} x
 * @param {number} y
 * @param {number} radio
 * @returns {Object|null}
 */
function buscarPuntoAlto(
    mapa,
    x,
    y,
    radio
) {

    const alto = mapa.length;
    const ancho = mapa[0].length;

    let mejor = null;


    for (
        let dy = -radio;
        dy <= radio;
        dy++
    ) {

        for (
            let dx = -radio;
            dx <= radio;
            dx++
        ) {

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


            if (
                mejor === null ||
                mapa[ny][nx] > mejor.altura
            ) {

                mejor = {

                    x: nx,

                    y: ny,

                    altura: mapa[ny][nx]

                };

            }

        }

    }


    return mejor;

}


/*
==========================================================
Fin del módulo cordilleras.js

Responsabilidad:

- Conectar macizos montañosos.
- Crear ejes montañosos.
- Ensanchar cordilleras.
- Mantener compatibilidad con futuras fases.

==========================================================
*/
        