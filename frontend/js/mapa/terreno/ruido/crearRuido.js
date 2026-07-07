/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : crearRuido.js
Ruta     : frontend/js/mapa/terreno/ruido/crearRuido.js
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Este módulo actúa como punto único de creación de
generadores de ruido.

Todo el proyecto debe utilizar EXCLUSIVAMENTE esta API
para crear ruido procedural.

Nunca se deberá importar directamente simplex.js,
perlin.js u otros motores desde el resto del proyecto.

==========================================================
*/

import { crearSimplex } from "./motores/simplex.js";
import { crearPerlin } from "./motores/perlin.js";

/**
 * Motores de ruido registrados.
 *
 * Para añadir un nuevo motor únicamente será necesario:
 *
 * 1. Importarlo.
 * 2. Registrarlo aquí.
 */
const MOTORES = {

    simplex: crearSimplex,

    perlin: crearPerlin

};

/**
 * Crea un generador de ruido.
 *
 * @param {Object} opciones
 *
 * @property {string} motor
 * @property {number} semilla
 * @property {number} frecuencia
 * @property {number} octavas
 * @property {number} persistencia
 * @property {number} lacunaridad
 *
 * @returns {Object}
 */
export function crearRuido(opciones = {}) {

    const {

        motor = "simplex"

    } = opciones;

    const creador = MOTORES[motor];

    if (!creador) {

        throw new Error(
            `Motor de ruido no soportado: ${motor}`
        );

    }

    return creador(opciones);

}

/**
 * Devuelve los motores disponibles.
 *
 * @returns {string[]}
 */
export function obtenerMotoresDisponibles() {

    return Object.keys(MOTORES);

}