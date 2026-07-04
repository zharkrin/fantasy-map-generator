/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : mundo.js
Ruta     : frontend/js/core/estado/mundo.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Estado principal del mundo.

Este módulo contiene la única copia del estado del mundo.
Todos los sistemas (terreno, ríos, clima, biomas,
civilizaciones, etc.) leerán y modificarán este objeto.

Ningún módulo deberá mantener copias independientes de
estos datos.

==========================================================
*/

/**
 * Estado del mundo.
 */
export const estadoMundo = {

    /**
     * Indica si el estado ha sido inicializado.
     */
    inicializado: false,

    /**
     * Semilla del mundo.
     */
    semilla: null,

    /**
     * Configuración utilizada para generar el mundo.
     */
    configuracion: {},

    /**
     * Información general.
     */
    informacion: {

        nombre: "",

        fechaCreacion: null,

        version: "0.1.0"

    },

    /**
     * Terreno.
     * Se irá ampliando durante las siguientes fases.
     */
    terreno: {},

    /**
     * Hidrología.
     */
    hidrologia: {},

    /**
     * Clima.
     */
    clima: {},

    /**
     * Biomas.
     */
    biomas: {},

    /**
     * Recursos naturales.
     */
    recursos: {},

    /**
     * Flora.
     */
    flora: {},

    /**
     * Fauna.
     */
    fauna: {},

    /**
     * Civilización.
     */
    civilizacion: {

        ciudades: {},

        caminos: {},

        naciones: {},

        culturas: {},

        religiones: {},

        idiomas: {},

        razas: {},

        economia: {}

    },

    /**
     * Cámara.
     */
    camara: {},

    /**
     * Selección.
     */
    seleccion: {},

    /**
     * Editor.
     */
    editor: {},

    /**
     * Inicializa el estado.
     */
    async inicializar() {

        if (this.inicializado) {
            return;
        }

        console.info("Inicializando estado del mundo...");

        this.fechaCreacion = new Date();

        this.inicializado = true;

        console.info("Estado del mundo inicializado.");

    },

    /**
     * Actualización por fotograma.
     *
     * @param {number} deltaTime
     */
    actualizar(deltaTime) {

        void deltaTime;

    },

    /**
     * Renderizado por fotograma.
     *
     * @param {number} deltaTime
     */
    renderizar(deltaTime) {

        void deltaTime;

    },

    /**
     * Reinicia el estado del mundo.
     */
    reiniciar() {

        this.semilla = null;

        this.configuracion = {};

        this.informacion = {

            nombre: "",

            fechaCreacion: null,

            version: "0.1.0"

        };

        this.terreno = {};

        this.hidrologia = {};

        this.clima = {};

        this.biomas = {};

        this.recursos = {};

        this.flora = {};

        this.fauna = {};

        this.civilizacion = {

            ciudades: {},

            caminos: {},

            naciones: {},

            culturas: {},

            religiones: {},

            idiomas: {},

            razas: {},

            economia: {}

        };

        this.camara = {};

        this.seleccion = {};

        this.editor = {};

    },

    /**
     * Libera el estado.
     */
    destruir() {

        this.reiniciar();

        this.inicializado = false;

        console.info("Estado del mundo destruido.");

    }

};