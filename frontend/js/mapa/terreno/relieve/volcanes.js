/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : volcanes.js
Ruta     : frontend/js/mapa/terreno/relieve/
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Generador de volcanes.

Este módulo añade volcanes sobre un relieve
existente.

Los volcanes no crean cordilleras nuevas.
Trabajan sobre zonas montañosas y regiones
compatibles con actividad volcánica.

No modifica el mapa original.

==========================================================
*/

import { crearRuido } from "../ruido/crearRuido.js";


/**
 * Genera volcanes sobre un mapa de elevación.
 *
 * @param {number[][]} mapaElevacion
 * @param {Object} opciones
 * @returns {number[][]}
 */
export function generarVolcanes(

    mapaElevacion,

    opciones = {}

) {


    if (

        !Array.isArray(mapaElevacion) ||

        mapaElevacion.length === 0

    ) {

        throw new Error(
            "El mapa de elevación no es válido."
        );

    }


    const {

        semilla = 12345,

        nivelMar = 0.50,

        alturaMinima = 0.65,

        cantidadVolcanes = 12,

        intensidad = 0.25,

        radioBase = 4,

        radioMaximo = 10,


        frecuencia = 0.003,

        usarFBM = true,

        octavas = 4,

        persistencia = 0.5,

        lacunaridad = 2.0

    } = opciones;
        //------------------------------------------------------
    // Ruido para distribución volcánica
    //------------------------------------------------------

    const ruidoVolcan = crearRuido({

        motor: "simplex",

        semilla: semilla + 4000,

        frecuencia,

        usarFBM,

        octavas,

        persistencia,

        lacunaridad

    });


    //------------------------------------------------------
    // Ruido para variación del cono volcánico
    //------------------------------------------------------

    const ruidoCono = crearRuido({

        motor: "simplex",

        semilla: semilla + 5000,

        frecuencia: frecuencia * 2,

        usarFBM: true,

        octavas: 3,

        persistencia: 0.5,

        lacunaridad: 2.0

    });


    const alto = mapaElevacion.length;

    const ancho = mapaElevacion[0].length;


    //------------------------------------------------------
    // Copia del mapa original
    //------------------------------------------------------

    const resultado =
        mapaElevacion.map(fila => [...fila]);


    //------------------------------------------------------
    // Buscar zonas candidatas
    //------------------------------------------------------

    const candidatos = [];


    for (

        let y = 1;

        y < alto - 1;

        y++

    ) {

        for (

            let x = 1;

            x < ancho - 1;

            x++

        ) {


            const altura =
                resultado[y][x];


            if (

                altura < alturaMinima

            ) {

                continue;

            }


            const valorRuido =
                ruidoVolcan.obtener(

                    x,

                    y

                );


            if (

                valorRuido < 0.55

            ) {

                continue;

            }


            candidatos.push({

                x,

                y,

                altura,

                influencia:
                    valorRuido

            });


        }

    }
        //------------------------------------------------------
    // Sin candidatos no se generan volcanes
    //------------------------------------------------------

    if (candidatos.length === 0) {

        return resultado;

    }


    //------------------------------------------------------
    // Generador aleatorio determinista
    //------------------------------------------------------

    let estado =
        semilla + 456789;


    function random() {

        estado =
            (
                estado *
                1664525 +

                1013904223

            ) >>> 0;


        return estado / 4294967296;

    }


    //------------------------------------------------------
    // Selección de volcanes
    //------------------------------------------------------

    const volcanes = [];

    const usados = new Set();


    for (

        let i = 0;

        i < cantidadVolcanes;

        i++

    ) {


        let seleccionado = null;


        for (

            let intento = 0;

            intento < 50;

            intento++

        ) {


            const candidato =

                candidatos[

                    Math.floor(

                        random() *

                        candidatos.length

                    )

                ];


            const clave =

                `${candidato.x},${candidato.y}`;


            if (

                usados.has(clave)

            ) {

                continue;

            }


            seleccionado = candidato;


            usados.add(clave);


            break;


        }


        if (

            seleccionado === null

        ) {

            continue;

        }


        volcanes.push(

            seleccionado

        );


    }
        //------------------------------------------------------
    // Crear conos volcánicos
    //------------------------------------------------------

    for (const volcan of volcanes) {


        crearConoVolcanico(

            resultado,

            volcan.x,

            volcan.y,

            radioBase,

            radioMaximo,

            intensidad,

            ruidoCono

        );


    }


    return resultado;


}


/**
 * Genera la forma básica de un volcán.
 *
 * El centro tiene mayor elevación y
 * disminuye progresivamente hacia los bordes.
 */
function crearConoVolcanico(

    mapa,

    x,

    y,

    radioBase,

    radioMaximo,

    intensidad,

    ruido

) {


    const alto = mapa.length;

    const ancho = mapa[0].length;


    const variacion =

        ruido.obtener(

            x,

            y

        );


    const radio = Math.max(

        radioBase,

        radioBase +

        Math.floor(

            variacion *

            (radioMaximo - radioBase)

        )

    );


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


            if (

                distancia > radio

            ) {

                continue;

            }
                        //--------------------------------------------------
            // Forma del cono volcánico
            //--------------------------------------------------

            const factor =

                1 -

                (
                    distancia /

                    radio

                );


            const suavizado =

                factor *

                factor;


            mapa[ny][nx] +=

                suavizado *

                intensidad;


            if (

                mapa[ny][nx] > 1

            ) {

                mapa[ny][nx] = 1;

            }


        }

    }


    //------------------------------------------------------
    // Crear cima volcánica
    //------------------------------------------------------

    crearCimaVolcanica(

        mapa,

        x,

        y,

        intensidad * 0.35

    );


}


/**
 * Eleva la zona central del volcán.
 *
 * Representa el cono superior y evita
 * que todos los volcanes tengan una
 * forma completamente plana.
 */
function crearCimaVolcanica(

    mapa,

    x,

    y,

    intensidad

) {


    const alto = mapa.length;

    const ancho = mapa[0].length;


    const radio = 2;


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


            if (

                distancia > radio

            ) {

                continue;

            }


            const factor =

                1 -

                (
                    distancia /

                    radio

                );


            mapa[ny][nx] = Math.min(

                1,

                mapa[ny][nx] +

                (
                    factor *

                    intensidad

                )

            );


        }

    }


}


/**
 * Busca si existe otro volcán cercano.
 *
 * Evita crear volcanes demasiado juntos.
 */
function volcanCercano(

    volcanes,

    x,

    y,

    distanciaMinima

) {


    for (const volcan of volcanes) {


        const distancia =

            Math.sqrt(

                (
                    volcan.x -

                    x

                ) ** 2 +

                (
                    volcan.y -

                    y

                ) ** 2

            );


        if (

            distancia < distanciaMinima

        ) {

            return true;

        }


    }


    return false;

}
/**
 * Calcula la distancia entre dos puntos.
 *
 * Utilidad para futuras fases:
 * tectónica, placas y cadenas volcánicas.
 */
function distanciaEntrePuntos(

    x1,

    y1,

    x2,

    y2

) {


    const dx =

        x2 - x1;


    const dy =

        y2 - y1;


    return Math.sqrt(

        dx * dx +

        dy * dy

    );

}


/**
 * Ajusta la intensidad volcánica
 * según la altura existente.
 *
 * Las zonas ya elevadas reciben
 * una mayor actividad.
 */
function calcularInfluenciaVolcanica(

    altura,

    nivelMar,

    intensidad

) {


    if (

        altura <= nivelMar

    ) {

        return 0;

    }


    const factor =

        (
            altura -

            nivelMar

        )

        /

        (
            1 -

            nivelMar

        );


    return intensidad * factor;

}


/*
==========================================================
Fin del módulo volcanes.js

Responsabilidad:

- Detectar zonas volcánicas.
- Crear conos volcánicos.
- Añadir elevación local.
- Mantener compatibilidad con:
    - montañas.js
    - cordilleras.js
    - tectónica futura.

==========================================================
*/
