/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : semillas.js
Ruta     : frontend/js/core/random/semillas.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Utilidades para la gestión de semillas.

Responsabilidades:

- Generar semillas aleatorias.
- Validar semillas.
- Convertir texto en semillas numéricas.
- Normalizar semillas.
- Garantizar reproducibilidad.

==========================================================
*/

/**
 * Genera una semilla basada en la fecha y un pequeño
 * componente aleatorio del sistema.
 *
 * @returns {number}
 */
export function generarSemilla() {

    const tiempo = Date.now();

    const rendimiento = Math.floor(performance.now());

    return (tiempo ^ rendimiento) >>> 0;

}

/**
 * Comprueba si una semilla es válida.
 *
 * @param {*} valor
 * @returns {boolean}
 */
export function esSemillaValida(valor) {

    return Number.isInteger(valor) &&
           valor >= 0 &&
           valor <= 0xFFFFFFFF;

}

/**
 * Convierte cualquier valor en una semilla válida.
 *
 * @param {*} valor
 * @returns {number}
 */
export function normalizarSemilla(valor) {

    if (typeof valor === "number") {

        return valor >>> 0;

    }

    if (typeof valor === "string") {

        return textoASemilla(valor);

    }

    return generarSemilla();

}

/**
 * Convierte un texto en una semilla de 32 bits.
 *
 * Algoritmo:
 * FNV-1a 32 bits
 *
 * @param {string} texto
 * @returns {number}
 */
export function textoASemilla(texto) {

    let hash = 2166136261;

    for (let i = 0; i < texto.length; i++) {

        hash ^= texto.charCodeAt(i);

        hash = Math.imul(hash, 16777619);

    }

    return hash >>> 0;

}

/**
 * Convierte una semilla en una cadena hexadecimal.
 *
 * @param {number} semilla
 * @returns {string}
 */
export function semillaAHexadecimal(semilla) {

    return (semilla >>> 0)
        .toString(16)
        .toUpperCase()
        .padStart(8, "0");

}

/**
 * Convierte un hexadecimal en semilla.
 *
 * @param {string} hexadecimal
 * @returns {number}
 */
export function hexadecimalASemilla(hexadecimal) {

    return parseInt(hexadecimal, 16) >>> 0;

}