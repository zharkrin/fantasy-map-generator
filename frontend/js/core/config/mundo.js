/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : mundo.js
Ruta     : frontend/js/core/config/mundo.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Configuración global del mundo.

Este módulo contiene todos los parámetros generales que
controlan la generación del mundo.

IMPORTANTE

Este archivo únicamente contiene configuración.

No almacena datos del mapa generado.
No contiene lógica de generación.
No guarda estado.

==========================================================
*/

export const configuracionMundo = {

    /**
     * Indica si el módulo ha sido inicializado.
     */
    inicializado: false,

    /**
     * Tamaño del mundo.
     *
     * Valores permitidos:
     * 1.0 - 10.0
     *
     * Equivale a veces el tamaño aproximado de la Tierra.
     */
    escalaMundo: 1.0,

    /**
     * Dimensiones base del mapa.
     *
     * Posteriormente podrán modificarse desde la interfaz.
     */
    anchoMapa: 4096,

    altoMapa: 2048,

    /**
     * Semilla utilizada para la generación procedural.
     *
     * null = aleatoria.
     */
    semilla: null,

    /**
     * Nivel del mar.
     *
     * Rango recomendado:
     * 0.0 - 1.0
     */
    nivelMar: 0.50,

    /**
     * Resolución del terreno.
     *
     * Cuanto mayor sea el valor,
     * más detalle tendrá el mundo.
     */
    resolucion: 1024,

    /**
     * Configuración inicial de continentes.
     */
    continentes: {

        minimo: 1,

        maximo: 8,

        suavizadoCostas: true

    },

    /**
     * Configuración oceánica.
     */
    oceanos: {

        porcentajeMinimo: 45,

        porcentajeMaximo: 75

    },

    /**
     * Configuración inicial del clima.
     */
    clima: {

        activar: true,

        temperaturaGlobal: 1.0,

        humedadGlobal: 1.0

    },

    /**
     * Configuración de generación.
     */
    generacion: {

        usarPerlin: false,

        usarSimplex: true,

        aplicarErosion: true,

        suavizarTerreno: true

    },

    /**
     * Inicializa el módulo.
     */
    async inicializar() {

        if (this.inicializado) {
            return;
        }

        console.info("Configuración del mundo inicializada.");

        this.inicializado = true;

    },

    /**
     * Restaura la configuración por defecto.
     */
    restaurarValores() {

        this.escalaMundo = 1.0;

        this.anchoMapa = 4096;

        this.altoMapa = 2048;

        this.semilla = null;

        this.nivelMar = 0.50;

        this.resolucion = 1024;

        this.continentes = {

            minimo: 1,

            maximo: 8,

            suavizadoCostas: true

        };

        this.oceanos = {

            porcentajeMinimo: 45,

            porcentajeMaximo: 75

        };

        this.clima = {

            activar: true,

            temperaturaGlobal: 1.0,

            humedadGlobal: 1.0

        };

        this.generacion = {

            usarPerlin: false,

            usarSimplex: true,

            aplicarErosion: true,

            suavizarTerreno: true

        };

    },

    /**
     * Destruye el módulo.
     */
    destruir() {

        this.restaurarValores();

        this.inicializado = false;

    }

};