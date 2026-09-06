/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : mesetas.js
Ruta     : frontend/js/mapa/terreno/relieve/
Licencia : MIT
==========================================================

Generador de mesetas con borde irregular y altura variable.
No modifica el mapa recibido.
==========================================================
*/

import { crearRuido } from "../ruido/crearRuido.js";

const TIPOS_MESETA = new Set([
    "clasica", "volcanica", "altiplano", "mesa", "tepuy"
]);

/** Ajuste de elevación según el tipo geológico. */
const AJUSTE_TIPO = Object.freeze({
    clasica: 0,
    volcanica: 0.08,
    altiplano: -0.03,
    mesa: 0.02,
    tepuy: 0.12
});

/**
 * Genera mesetas sobre un mapa de elevación normalizado.
 *
 * @param {number[][]} mapaElevacion Mapa con valores entre 0 y 1.
 * @param {Object} opciones Configuración del generador.
 * @returns {number[][]} Nueva matriz de elevación.
 */
export function generarMesetas(mapaElevacion, opciones = {}) {

    validarMapaElevacion(mapaElevacion);

    const {
        semilla = 12345,
        nivelMar = 0.50,
        cantidadMesetas = 4,
        tipoMeseta = "clasica",
        alturaMinima = 0.58,
        alturaMeseta = 0.72,
        radioMinimo = 10,
        radioMaximo = 32,
        separacionMinima = 20,
        permitirSolapamiento = false,
        suavidadBorde = 0.30,
        variacionBorde = 4,
        variacionAltura = 0.05,
        frecuenciaRuido = 0.08
    } = opciones;

    validarOpciones({
        nivelMar,
        cantidadMesetas,
        tipoMeseta,
        alturaMinima,
        alturaMeseta,
        radioMinimo,
        radioMaximo,
        separacionMinima,
        permitirSolapamiento,
        suavidadBorde,
        variacionBorde,
        variacionAltura,
        frecuenciaRuido
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
    const ruido = crearRuido({
        motor: "simplex",
        semilla: semilla + 6000,
        frecuencia: frecuenciaRuido,
        usarFBM: true,
        octavas: 3,
        persistencia: 0.5,
        lacunaridad: 2.0
    });
    const centros = seleccionarCentros(
        candidatos,
        cantidadMesetas,
        separacionMinima,
        permitirSolapamiento,
        random
    );

    for (const centro of centros) {
        aplicarMeseta(
            resultado,
            centro.x,
            centro.y,
            enteroAleatorio(random, radioMinimo, radioMaximo),
            tipoMeseta,
            alturaMeseta,
            nivelMar,
            suavidadBorde,
            variacionBorde,
            variacionAltura,
            ruido
        );
    }

    return resultado;

}

/** @param {number[][]} mapaElevacion */
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
                throw new Error("Cada elevación debe estar entre 0 y 1.");
            }
        }
    }

}

/** @param {Object} opciones */
function validarOpciones(opciones) {

    const valoresNormalizados = [
        opciones.nivelMar,
        opciones.alturaMinima,
        opciones.alturaMeseta,
        opciones.suavidadBorde,
        opciones.variacionAltura
    ];

    if (valoresNormalizados.some((valor) => !Number.isFinite(valor) || valor < 0 || valor > 1)) {
        throw new Error(
            "nivelMar, alturaMinima, alturaMeseta, suavidadBorde y variacionAltura deben estar entre 0 y 1."
        );
    }

    if (!TIPOS_MESETA.has(opciones.tipoMeseta)) {
        throw new Error(`Tipo de meseta no soportado: ${opciones.tipoMeseta}.`);
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

    if (typeof opciones.permitirSolapamiento !== "boolean") {
        throw new Error("permitirSolapamiento debe ser verdadero o falso.");
    }

    if (!Number.isFinite(opciones.variacionBorde) || opciones.variacionBorde < 0) {
        throw new Error("variacionBorde debe ser un número igual o mayor que cero.");
    }

    if (!Number.isFinite(opciones.frecuenciaRuido) || opciones.frecuenciaRuido <= 0) {
        throw new Error("frecuenciaRuido debe ser un número mayor que cero.");
    }

}

/** @returns {{x: number, y: number}[]} */
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

/** @returns {{x: number, y: number}[]} */
function seleccionarCentros(
    candidatos,
    cantidadMesetas,
    separacionMinima,
    permitirSolapamiento,
    random
) {

    const disponibles = [...candidatos];
    const centros = [];
    const distanciaMinimaAlCuadrado = separacionMinima ** 2;

    while (disponibles.length > 0 && centros.length < cantidadMesetas) {
        const indice = enteroAleatorio(random, 0, disponibles.length - 1);
        const candidato = disponibles.splice(indice, 1)[0];
        const estaSeparado = permitirSolapamiento || centros.every((centro) => {
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
 * Aplana una región con borde irregular y altura específica para su tipo.
 */
function aplicarMeseta(
    mapa,
    centroX,
    centroY,
    radio,
    tipoMeseta,
    alturaMeseta,
    nivelMar,
    suavidadBorde,
    variacionBorde,
    variacionAltura,
    ruido
) {

    const alto = mapa.length;
    const ancho = mapa[0].length;
    const radioConMargen = Math.ceil(radio + variacionBorde);
    const alturaBase = limitar(
        alturaMeseta + (ruido.obtener(centroX, centroY) * variacionAltura)
    );

    for (let y = Math.max(0, centroY - radioConMargen); y <= Math.min(alto - 1, centroY + radioConMargen); y++) {
        for (let x = Math.max(0, centroX - radioConMargen); x <= Math.min(ancho - 1, centroX + radioConMargen); x++) {
            if (mapa[y][x] <= nivelMar) {
                continue;
            }

            const distancia = Math.hypot(x - centroX, y - centroY);
            const radioLocal = Math.max(
                1,
                radio + (ruido.obtener(x, y) * variacionBorde)
            );

            if (distancia > radioLocal) {
                continue;
            }

            const radioNucleo = radioLocal * (1 - suavidadBorde);
            const influencia = calcularInfluencia(
                distancia,
                radioNucleo,
                radioLocal
            );
            const alturaObjetivo = obtenerAlturaObjetivo(
                tipoMeseta,
                alturaBase,
                mapa[y][x]
            );

            mapa[y][x] = limitar(
                mapa[y][x] + ((alturaObjetivo - mapa[y][x]) * influencia)
            );
        }
    }

}

/** @returns {number} */
function obtenerAlturaObjetivo(tipoMeseta, alturaMeseta, alturaActual) {

    const ajuste = AJUSTE_TIPO[tipoMeseta] ?? AJUSTE_TIPO.clasica;

    return Math.max(alturaActual, alturaMeseta + ajuste);

}

/** @returns {number} */
function calcularInfluencia(distancia, radioNucleo, radioLocal) {

    if (distancia <= radioNucleo || radioNucleo >= radioLocal) {
        return 1;
    }

    const progreso = (distancia - radioNucleo) / (radioLocal - radioNucleo);

    return 1 - (progreso * progreso * (3 - (2 * progreso)));

}

/** @returns {Function} */
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

/** @returns {number} */
function enteroAleatorio(random, minimo, maximo) {

    return Math.floor(random() * ((maximo - minimo) + 1)) + minimo;

}

/** @returns {number} */
function limitar(valor) {

    return Math.min(1, Math.max(0, valor));

}
