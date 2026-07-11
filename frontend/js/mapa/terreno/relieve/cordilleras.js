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
        // Sistema de rutas (2.2.2B)
        //--------------------------------------------------

        usarRutaNatural = true,

        usarAStar = true,

        evitarRepetidos = true,

        radioBusqueda = 6,

        curvatura = 0.35,

        maxPasos = 5000,

        costeAltura = 2.0,

        costeDistancia = 1.0,

        costeAgua = Number.MAX_SAFE_INTEGER,

        factorCentro = 1.40,

        factorExtremos = 0.70

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

    const picosUtilizados = new Set();

    for (
        let indiceCordillera = 0;
        indiceCordillera < cantidadCordilleras;
        indiceCordillera++
    ) {

        let origen = null;

        //--------------------------------------------------
        // Buscar un pico de origen no utilizado
        //--------------------------------------------------

        for (let intento = 0; intento < 50; intento++) {

            const candidato =
                picos[Math.floor(random() * picos.length)];

            const clave =
                `${candidato.x},${candidato.y}`;

            if (!picosUtilizados.has(clave)) {

                origen = candidato;
                picosUtilizados.add(clave);
                break;

            }

        }

        if (origen === null) {
            continue;
        }

        let destino = buscarPuntoAlto(

            resultado,

            origen.x,

            origen.y,

            longitudMaxima

        );
                if (
            destino === null ||
            (destino.x === origen.x &&
             destino.y === origen.y)
        ) {
            continue;
        }

        //--------------------------------------------------
        // Crear trayectoria entre ambos macizos
        //--------------------------------------------------

        const camino = usarAStar

            ? crearRutaNatural(

                origen,

                destino,

                resultado,

                ruidoCordillera,

                {

                    nivelMar,

                    costeAltura,

                    costeDistancia,

                    costeAgua,

                    radioBusqueda,

                    curvatura,

                    evitarRepetidos,

                    maxPasos

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

        if (camino.length === 0) {
            continue;
        }
                //--------------------------------------------------
        // Aplicar relieve sobre el eje de la cordillera
        //--------------------------------------------------

        const longitud = camino.length;

        for (let i = 0; i < longitud; i++) {

            const punto = camino[i];

            // Progreso de 0 → 1
            const t = longitud <= 1
                ? 0
                : i / (longitud - 1);

            // Intensidad máxima en el centro
            const perfil =
                factorExtremos +
                Math.sin(t * Math.PI) *
                (factorCentro - factorExtremos);

            // Anchura suavizada por ruido
            const ruidoLocal =
                ruidoCordillera.obtener(
                    punto.x,
                    punto.y
                );

            const anchoActual =
                Math.max(
                    anchoBase,
                    Math.round(
                        anchoBase +
                        (anchoMaximo - anchoBase) *
                        (0.5 + ruidoLocal * 0.5)
                    )
                );

            elevarZonaCordillera(

                resultado,

                punto.x,

                punto.y,

                anchoActual,

                anchoMaximo,

                intensidad * perfil,

                ruidoCordillera

            );

        }

    }

    return resultado;

}
/**
 * Genera una ruta natural entre dos macizos
 * utilizando búsqueda con memoria.
 */
function crearRutaNatural(

    origen,

    destino,

    mapa,

    ruido,

    opciones

) {

    const {

        nivelMar,

        costeAltura,

        costeDistancia,

        costeAgua,

        radioBusqueda,

        curvatura,

        evitarRepetidos,

        maxPasos

    } = opciones;

    const alto = mapa.length;
    const ancho = mapa[0].length;

    const camino = [];

    const visitados = new Set();

    let actual = {

        x: origen.x,

        y: origen.y

    };

    for (

        let paso = 0;

        paso < maxPasos;

        paso++

    ) {

        camino.push({

            x: actual.x,

            y: actual.y

        });

        if (

            actual.x === destino.x &&

            actual.y === destino.y

        ) {

            break;

        }
               const clave = `${actual.x},${actual.y}`;

        if (evitarRepetidos) {
            visitados.add(clave);
        }

        let mejor = null;
        let mejorCoste = Number.MAX_VALUE;

        for (let dy = -1; dy <= 1; dy++) {

            for (let dx = -1; dx <= 1; dx++) {

                if (dx === 0 && dy === 0) {
                    continue;
                }

                const nx = actual.x + dx;
                const ny = actual.y + dy;

                if (
                    nx < 0 ||
                    ny < 0 ||
                    nx >= ancho ||
                    ny >= alto
                ) {
                    continue;
                }

                const claveVecino = `${nx},${ny}`;

                if (
                    evitarRepetidos &&
                    visitados.has(claveVecino)
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

                coste += Math.hypot(
                    destino.x - nx,
                    destino.y - ny
                ) * 0.01;

                coste +=
                    ruido.obtener(nx, ny) *
                    curvatura;

                if (coste < mejorCoste) {

                    mejorCoste = coste;

                    mejor = {
                        x: nx,
                        y: ny
                    };

                }

            }

        }

        if (mejor === null) {
            break;
        }

        actual = mejor;

    }

    return camino;

} 
