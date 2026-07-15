/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : mesetas.js
Ruta     : frontend/js/mapa/terreno/relieve/
Licencia : MIT
==========================================================

Generador de mesetas.

Una meseta es una región terrestre elevada cuyo centro es
relativamente plano y cuyos bordes ascienden de manera
gradual. Este módulo recibe un mapa de elevación, crea una
copia y devuelve el resultado sin alterar el mapa original.

No genera montañas, volcanes ni valles.
==========================================================
*/

/**
 * Genera mesetas sobre un mapa de elevación normalizado.
 *
 * @param {number[][]} mapaElevacion Mapa con valores entre 0 y 1.
 * @param {Object} opciones Configuración de las mesetas.
 * @returns {number[][]} Nueva matriz de elevación.
 */
export function generarMesetas(mapaElevacion, opciones = {}) {

    validarMapaElevacion(mapaElevacion);

    const {
        semilla = 12345,
        nivelMar = 0.50,
        cantidadMesetas = 4,
        alturaMinima = 0.58,
        alturaMeseta = 0.72,
        radioMinimo = 10,
        radioMaximo = 32,
        separacionMinima = 20,
        suavidadBorde = 0.30
    } = opciones;

    validarOpciones({
        nivelMar,
        cantidadMesetas,
        alturaMinima,
        alturaMeseta,
        radioMinimo,
        radioMaximo,
        separacionMinima,
        suavidadBorde
    });

    const resultado = mapaElevacion.map((fila) => [...fila]);
    const candidatos = obtenerCandidatos(
        mapaElevacion,
        nivelMar,
        alturaMinima
    );

    if (candidatos.length === 0 || cantidadMesetas === 0) {
        return resultado;
    }

    const random = crearGeneradorPseudoaleatorio(semilla);
    const centros = seleccionarCentros(
        candidatos,
        cantidadMesetas,
        separacionMinima,
        random
    );

    for (const centro of centros) {
        const radio = enteroAleatorio(random, radioMinimo, radioMaximo);

        aplicarMeseta(
            resultado,
            centro.x,
            centro.y,
            radio,
            alturaMeseta,
            nivelMar,
            suavidadBorde
        );
    }

    return resultado;

}

/**
 * Comprueba que el mapa sea una matriz rectangular de números.
 *
 * @param {number[][]} mapaElevacion
 */
function validarMapaElevacion(mapaElevacion) {

    if (!Array.isArray(mapaElevacion) || mapaElevacion.length === 0) {
        throw new Error("El mapa de elevación no es válido.");
    }

    const ancho = mapaElevacion[0]?.length;

    if (!Number.isInteger(ancho) || ancho === 0) {
        throw new Error("El mapa de elevación debe contener filas no vacías.");
    }

    for (const fila of mapaElevacion) {
        if (!Array.isArray(fila) || fila.length !== ancho) {
            throw new Error("El mapa de elevación debe ser rectangular.");
        }

        for (const altura of fila) {
            if (!Number.isFinite(altura) || altura < 0 || altura > 1) {
                throw new Error(
                    "La elevación de cada celda debe estar entre 0 y 1."
                );
            }
        }
    }

}

/**
 * Valida la configuración pública del generador.
 *
 * @param {Object} opciones
 */
function validarOpciones(opciones) {

    const valoresNormalizados = [
        opciones.nivelMar,
        opciones.alturaMinima,
        opciones.alturaMeseta,
        opciones.suavidadBorde
    ];

    if (valoresNormalizados.some((valor) => valor < 0 || valor > 1)) {
        throw new Error(
            "nivelMar, alturaMinima, alturaMeseta y suavidadBorde deben estar entre 0 y 1."
        );
    }

    if (!Number.isInteger(opciones.cantidadMesetas) || opciones.cantidadMesetas < 0) {
        throw new Error("cantidadMesetas debe ser un entero igual o mayor que cero.");
    }

    if (
        !Number.isInteger(opciones.radioMinimo) ||
        !Number.isInteger(opciones.radioMaximo) ||
        opciones.radioMinimo < 1 ||
        opciones.radioMaximo < opciones.radioMinimo
    ) {
        throw new Error("Los radios de las mesetas no son válidos.");
    }

    if (!Number.isFinite(opciones.separacionMinima) || opciones.separacionMinima < 0) {
        throw new Error("separacionMinima debe ser un número igual o mayor que cero.");
    }

}

/**
 * Obtiene celdas terrestres suficientemente elevadas para iniciar una meseta.
 *
 * @param {number[][]} mapaElevacion
 * @param {number} nivelMar
 * @param {number} alturaMinima
 * @returns {{x: number, y: number}[]}
 */
function obtenerCandidatos(mapaElevacion, nivelMar, alturaMinima) {

    const candidatos = [];
    const alturaRequerida = Math.max(nivelMar, alturaMinima);

    for (let y = 0; y < mapaElevacion.length; y++) {
        for (let x = 0; x < mapaElevacion[y].length; x++) {
            if (mapaElevacion[y][x] >= alturaRequerida) {
                candidatos.push({ x, y });
            }
        }
    }

    return candidatos;

}

/**
 * Elige centros separados entre sí para que las mesetas no se solapen.
 *
 * @param {{x: number, y: number}[]} candidatos
 * @param {number} cantidadMesetas
 * @param {number} separacionMinima
 * @param {Function} random
 * @returns {{x: number, y: number}[]}
 */
function seleccionarCentros(
    candidatos,
    cantidadMesetas,
    separacionMinima,
    random
) {

    const disponibles = [...candidatos];
    const centros = [];
    const distanciaMinimaAlCuadrado = separacionMinima ** 2;

    while (disponibles.length > 0 && centros.length < cantidadMesetas) {
        const indice = enteroAleatorio(random, 0, disponibles.length - 1);
        const candidato = disponibles.splice(indice, 1)[0];

        const estaSeparado = centros.every((centro) => {
            const dx = candidato.x - centro.x;
            const dy = candidato.y - centro.y;

            return (dx * dx) + (dy * dy) >= distanciaMinimaAlCuadrado;
        });

        if (estaSeparado) {
            centros.push(candidato);
        }
    }

    return centros;

}

/**
 * Aplana gradualmente una región circular de terreno elevado.
 *
 * @param {number[][]} mapa
 * @param {number} centroX
 * @param {number} centroY
 * @param {number} radio
 * @param {number} alturaMeseta
 * @param {number} nivelMar
 * @param {number} suavidadBorde
 */
function aplicarMeseta(
    mapa,
    centroX,
    centroY,
    radio,
    alturaMeseta,
    nivelMar,
    suavidadBorde
) {

    const alto = mapa.length;
    const ancho = mapa[0].length;
    const radioAlCuadrado = radio ** 2;
    const radioNucleo = radio * (1 - suavidadBorde);

    for (let y = Math.max(0, centroY - radio); y <= Math.min(alto - 1, centroY + radio); y++) {
        for (let x = Math.max(0, centroX - radio); x <= Math.min(ancho - 1, centroX + radio); x++) {
            const dx = x - centroX;
            const dy = y - centroY;
            const distanciaAlCuadrado = (dx * dx) + (dy * dy);

            if (distanciaAlCuadrado > radioAlCuadrado || mapa[y][x] <= nivelMar) {
                continue;
            }

            const distancia = Math.sqrt(distanciaAlCuadrado);
            const influencia = calcularInfluencia(
                distancia,
                radioNucleo,
                radio
            );

            const alturaObjetivo = Math.max(mapa[y][x], alturaMeseta);

            mapa[y][x] = limitar(
                mapa[y][x] + ((alturaObjetivo - mapa[y][x]) * influencia)
            );
        }
    }

}

/**
 * Devuelve la influencia de una meseta: total en el núcleo y gradual en el borde.
 *
 * @param {number} distancia
 * @param {number} radioNucleo
 * @param {number} radio
 * @returns {number}
 */
function calcularInfluencia(distancia, radioNucleo, radio) {

    if (distancia <= radioNucleo || radioNucleo >= radio) {
        return 1;
    }

    const progreso = (distancia - radioNucleo) / (radio - radioNucleo);

    return 1 - (progreso * progreso * (3 - (2 * progreso)));

}

/**
 * Crea un generador Mulberry32 para que una semilla produzca siempre el mismo resultado.
 *
 * @param {number} semilla
 * @returns {Function}
 */
function crearGeneradorPseudoaleatorio(semilla) {

    let estado = Number(semilla) >>> 0;

    return () => {
        estado += 0x6D2B79F5;

        let temporal = estado;

        temporal = Math.imul(temporal ^ (temporal >>> 15), temporal | 1);
        temporal ^= temporal + Math.imul(temporal ^ (temporal >>> 7), temporal | 61);

        return ((temporal ^ (temporal >>> 14)) >>> 0) / 4294967296;
    };

}

/**
 * Genera un entero inclusivo a partir de un generador pseudoaleatorio.
 *
 * @param {Function} random
 * @param {number} minimo
 * @param {number} maximo
 * @returns {number}
 */
function enteroAleatorio(random, minimo, maximo) {

    return Math.floor(random() * ((maximo - minimo) + 1)) + minimo;

}

/**
 * Limita una altura al rango normalizado del mapa.
 *
 * @param {number} valor
 * @returns {number}
 */
function limitar(valor) {

    return Math.min(1, Math.max(0, valor));

}
