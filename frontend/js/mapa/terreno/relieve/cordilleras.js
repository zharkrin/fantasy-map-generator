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

        //--------------------------------------------------
        // Generación de cordilleras
        //--------------------------------------------------

        cantidadCordilleras = 8,

        longitudMinima = 40,

        longitudMaxima = 180,

        //--------------------------------------------------
        // Geometría
        //--------------------------------------------------

        anchoBase = 3,

        anchoMaximo = 8,

        //--------------------------------------------------
        // Sistema de rutas (2.2.2A)
        //--------------------------------------------------

        usarRutaNatural = true,

        costeAltura = 2.0,

        costeDistancia = 1.0,

        costeAgua = Number.MAX_SAFE_INTEGER

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

        let destino = null;

        let intentos = 0;

        while (intentos < 50) {

            const candidato =
                picos[Math.floor(random() * picos.length)];

            if (candidato === origen) {
                intentos++;
                continue;
            }

            const dx = candidato.x - origen.x;
            const dy = candidato.y - origen.y;

            const distancia =
                Math.sqrt(dx * dx + dy * dy);

            if (
                distancia >= longitudMinima &&
                distancia <= longitudMaxima
            ) {
                destino = candidato;
                break;
            }

            intentos++;

        }

        if (destino === null) {
            continue;
        }
                //--------------------------------------------------
        // Crear trayectoria natural entre los dos macizos
        //--------------------------------------------------

        const camino = usarRutaNatural
            ? crearRutaNatural(
                origen,
                destino,
                resultado,
                {
                    nivelMar,
                    costeAltura,
                    costeDistancia,
                    costeAgua
                }
            )
            : crearTrayectoria(
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
 * Genera una ruta natural favoreciendo
 * zonas elevadas del terreno.
 */
function crearRutaNatural(

    origen,

    destino,

    mapa,

    opciones

) {
        const {

        nivelMar,
        costeAltura,
        costeDistancia,
        costeAgua

    } = opciones;

    const camino = [];

    let x = origen.x;
    let y = origen.y;

    const alto = mapa.length;
    const ancho = mapa[0].length;

    const maxPasos = ancho * alto;

    for (let paso = 0; paso < maxPasos; paso++) {

        camino.push({ x, y });

        if (x === destino.x && y === destino.y) {
            break;
        }

        let mejorX = x;
        let mejorY = y;
        let mejorCoste = Number.MAX_VALUE;

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

                const altura = mapa[ny][nx];

                let coste = costeDistancia;

                if (altura <= nivelMar) {
                    coste += costeAgua;
                } else {
                    coste += (1 - altura) * costeAltura;
                }

                coste +=
                    Math.hypot(
                        destino.x - nx,
                        destino.y - ny
                    ) * 0.01;

                if (coste < mejorCoste) {

                    mejorCoste = coste;
                    mejorX = nx;
                    mejorY = ny;

                }

            }

        }

        if (mejorX === x && mejorY === y) {
            break;
        }

        x = mejorX;
        y = mejorY;

    }

    return camino;

}
/**
 * Aumenta la elevación alrededor de un punto
 * perteneciente al eje de una cordillera.
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
    // Radio variable según el ruido
    //--------------------------------------------------

    const variacion = ruido.obtener(x, y);

    const radio = Math.max(
        anchoBase,
        anchoBase +
        Math.floor(
            variacion * (anchoMaximo - anchoBase)
        )
    );

    //--------------------------------------------------
    // Aplicar elevación alrededor del eje
    //--------------------------------------------------

    for (let dy = -radio; dy <= radio; dy++) {

        for (let dx = -radio; dx <= radio; dx++) {

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

            const distancia = Math.hypot(dx, dy);

            if (distancia > radio) {
                continue;
            }

            const factor = 1 - (distancia / radio);

            mapa[ny][nx] = Math.min(
                1,
                mapa[ny][nx] + (factor * intensidad)
            );

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
