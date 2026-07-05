/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : generador.js
Ruta     : frontend/js/core/random/generador.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Generador de números pseudoaleatorios determinista.

Todos los sistemas del proyecto utilizarán este generador.

IMPORTANTE

No debe utilizarse Math.random() en ninguna otra parte
del proyecto.

==========================================================
*/

/**
 * Generador pseudoaleatorio basado en Mulberry32.
 *
 * Es rápido, determinista y suficiente para generación
 * procedural de mundos.
 */
export class GeneradorAleatorio {

    /**
     * @param {number} semilla
     */
    constructor(semilla = Date.now()) {

        this.establecerSemilla(semilla);

    }

    /**
     * Cambia la semilla.
     *
     * @param {number} semilla
     */
    establecerSemilla(semilla) {

        this.semilla = semilla >>> 0;

    }

    /**
     * Devuelve un número decimal entre 0 y 1.
     *
     * @returns {number}
     */
    random() {

        let t = this.semilla += 0x6D2B79F5;

        t = Math.imul(t ^ (t >>> 15), t | 1);

        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;

    }

    /**
     * Número entero.
     *
     * @param {number} minimo
     * @param {number} maximo
     * @returns {number}
     */
    entero(minimo, maximo) {

        return Math.floor(
            this.random() * (maximo - minimo + 1)
        ) + minimo;

    }

    /**
     * Número decimal.
     *
     * @param {number} minimo
     * @param {number} maximo
     * @returns {number}
     */
    decimal(minimo, maximo) {

        return this.random() * (maximo - minimo) + minimo;

    }

    /**
     * Devuelve verdadero o falso.
     *
     * @param {number} probabilidad
     * Probabilidad entre 0 y 1.
     *
     * @returns {boolean}
     */
    booleano(probabilidad = 0.5) {

        return this.random() < probabilidad;

    }

    /**
     * Selecciona un elemento aleatorio.
     *
     * @param {Array} elementos
     * @returns {*}
     */
    elegir(elementos) {

        if (!Array.isArray(elementos)) {
            return null;
        }

        if (elementos.length === 0) {
            return null;
        }

        return elementos[
            this.entero(0, elementos.length - 1)
        ];

    }

    /**
     * Mezcla un array.
     *
     * Devuelve una copia.
     *
     * @param {Array} elementos
     * @returns {Array}
     */
    mezclar(elementos) {

        const copia = [...elementos];

        for (let i = copia.length - 1; i > 0; i--) {

            const j = this.entero(0, i);

            [copia[i], copia[j]] = [copia[j], copia[i]];

        }

        return copia;

    }

}