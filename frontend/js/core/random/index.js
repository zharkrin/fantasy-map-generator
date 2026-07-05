/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : index.js
Ruta     : frontend/js/core/random/index.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Punto de acceso único al sistema de generación aleatoria.

Todos los módulos del proyecto deberán importar este
archivo en lugar de acceder directamente a los archivos
internos.

Responsabilidades:

- Gestionar la instancia global del generador.
- Inicializar la semilla.
- Exponer una API única.
- Evitar múltiples generadores independientes.

==========================================================
*/

import { GeneradorAleatorio } from "./generador.js";

import {
    generarSemilla,
    normalizarSemilla,
    esSemillaValida,
    textoASemilla,
    semillaAHexadecimal,
    hexadecimalASemilla
} from "./semillas.js";

/**
 * Instancia única del generador.
 */
let generador = new GeneradorAleatorio(
    generarSemilla()
);

/**
 * Sistema global de aleatoriedad.
 */
export const random = {

    /**
     * Inicializa el sistema.
     *
     * @param {number|string|null} semilla
     */
    inicializar(semilla = null) {

        const valor = normalizarSemilla(semilla);

        generador.establecerSemilla(valor);

    },

    /**
     * Cambia la semilla.
     *
     * @param {number|string} semilla
     */
    establecerSemilla(semilla) {

        generador.establecerSemilla(
            normalizarSemilla(semilla)
        );

    },

    /**
     * Devuelve un decimal entre 0 y 1.
     *
     * @returns {number}
     */
    random() {

        return generador.random();

    },

    /**
     * Devuelve un entero.
     *
     * @param {number} minimo
     * @param {number} maximo
     *
     * @returns {number}
     */
    entero(minimo, maximo) {

        return generador.entero(minimo, maximo);

    },

    /**
     * Devuelve un decimal.
     *
     * @param {number} minimo
     * @param {number} maximo
     *
     * @returns {number}
     */
    decimal(minimo, maximo) {

        return generador.decimal(minimo, maximo);

    },

    /**
     * Devuelve un booleano.
     *
     * @param {number} probabilidad
     *
     * @returns {boolean}
     */
    booleano(probabilidad = 0.5) {

        return generador.booleano(probabilidad);

    },

    /**
     * Selecciona un elemento.
     *
     * @param {Array} elementos
     *
     * @returns {*}
     */
    elegir(elementos) {

        return generador.elegir(elementos);

    },

    /**
     * Mezcla un array.
     *
     * @param {Array} elementos
     *
     * @returns {Array}
     */
    mezclar(elementos) {

        return generador.mezclar(elementos);

    },

    /**
     * Genera una nueva semilla.
     *
     * @returns {number}
     */
    generarSemilla,

    /**
     * Normaliza una semilla.
     */
    normalizarSemilla,

    /**
     * Comprueba si una semilla es válida.
     */
    esSemillaValida,

    /**
     * Convierte texto a semilla.
     */
    textoASemilla,

    /**
     * Convierte una semilla a hexadecimal.
     */
    semillaAHexadecimal,

    /**
     * Convierte hexadecimal a semilla.
     */
    hexadecimalASemilla

};