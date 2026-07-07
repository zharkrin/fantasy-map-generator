/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : Registro.js
Ruta     : frontend/js/utilidades/registro/Registro.js
Autor    : OpenAI + Asmodeus
Licencia : MIT
==========================================================

Clase genérica para registrar componentes del motor.

Puede utilizarse para registrar:

- Motores de ruido
- Algoritmos
- Exportadores
- Renderizadores
- IA
- Biomas
- Generadores de nombres
- Etc.

==========================================================
*/

export class Registro {

    #elementos;

    constructor() {

        this.#elementos = new Map();

    }

    /**
     * Registra un elemento.
     *
     * @param {string} nombre
     * @param {*} elemento
     */
    registrar(nombre, elemento) {

        if (typeof nombre !== "string") {

            throw new Error(
                "El nombre debe ser una cadena."
            );

        }

        const clave = nombre.trim();

        if (clave.length === 0) {

            throw new Error(
                "El nombre no puede estar vacío."
            );

        }

        if (this.#elementos.has(clave)) {

            throw new Error(
                `Ya existe "${clave}".`
            );

        }

        this.#elementos.set(clave, elemento);

    }

    /**
     * Obtiene un elemento.
     *
     * @param {string} nombre
     *
     * @returns {*}
     */
    obtener(nombre) {

        return this.#elementos.get(nombre);

    }

    /**
     * Indica si existe.
     *
     * @param {string} nombre
     *
     * @returns {boolean}
     */
    existe(nombre) {

        return this.#elementos.has(nombre);

    }

    /**
     * Elimina un elemento.
     *
     * @param {string} nombre
     *
     * @returns {boolean}
     */
    eliminar(nombre) {

        return this.#elementos.delete(nombre);

    }

    /**
     * Vacía el registro.
     */
    limpiar() {

        this.#elementos.clear();

    }

    /**
     * Devuelve todos los nombres registrados.
     *
     * @returns {string[]}
     */
    nombres() {

        return [...this.#elementos.keys()];

    }

    /**
     * Devuelve todos los elementos.
     *
     * @returns {Array}
     */
    elementos() {

        return [...this.#elementos.values()];

    }

    /**
     * Número de elementos registrados.
     *
     * @returns {number}
     */
    cantidad() {

        return this.#elementos.size;

    }

}