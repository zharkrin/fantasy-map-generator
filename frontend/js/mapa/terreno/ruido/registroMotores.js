/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : registroMotores.js
Ruta     : frontend/js/mapa/terreno/ruido/registroMotores.js
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Registro central de motores de ruido.

Este módulo mantiene la lista de motores disponibles y
permite registrar nuevos motores sin modificar el resto
del sistema.

==========================================================
*/

const motores = new Map();

/**
 * Registra un motor de ruido.
 *
 * @param {string} nombre
 * @param {Function} creador
 */
export function registrarMotor(nombre, creador) {

    if (typeof nombre !== "string" || nombre.trim() === "") {
        throw new Error("El nombre del motor es obligatorio.");
    }

    if (typeof creador !== "function") {
        throw new Error("El creador del motor debe ser una función.");
    }

    if (motores.has(nombre)) {
        throw new Error(
            `El motor "${nombre}" ya está registrado.`
        );
    }

    motores.set(nombre, creador);

}

/**
 * Obtiene un motor registrado.
 *
 * @param {string} nombre
 *
 * @returns {Function}
 */
export function obtenerMotor(nombre) {

    return motores.get(nombre);

}

/**
 * Comprueba si un motor existe.
 *
 * @param {string} nombre
 *
 * @returns {boolean}
 */
export function existeMotor(nombre) {

    return motores.has(nombre);

}

/**
 * Devuelve todos los motores registrados.
 *
 * @returns {string[]}
 */
export function obtenerMotoresDisponibles() {

    return [...motores.keys()];

}