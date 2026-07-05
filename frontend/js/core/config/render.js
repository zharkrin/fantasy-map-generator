/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : render.js
Ruta     : frontend/js/core/config/render.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Configuración global del motor de renderizado.

Este archivo define exclusivamente los parámetros
relacionados con la representación gráfica.

No contiene lógica de render.
No dibuja elementos.
No almacena estado.

==========================================================
*/

export const configuracionRender = {

    /**
     * Indica si el módulo está inicializado.
     */
    inicializado: false,

    /**
     * Motor gráfico.
     *
     * Valores previstos:
     *
     * canvas2d
     * webgl
     * isometrico
     */
    motor: "canvas2d",

    /**
     * Escala inicial del mapa.
     */
    zoomInicial: 1.0,

    /**
     * Zoom mínimo permitido.
     */
    zoomMinimo: 0.25,

    /**
     * Zoom máximo permitido.
     */
    zoomMaximo: 20.0,

    /**
     * Activar suavizado.
     */
    antialias: true,

    /**
     * Mostrar FPS.
     */
    mostrarFPS: false,

    /**
     * Dibujar cuadrícula.
     */
    mostrarCuadricula: false,

    /**
     * Dibujar coordenadas.
     */
    mostrarCoordenadas: false,

    /**
     * Fondo del mapa.
     */
    colorFondo: "#101820",

    /**
     * Activar sombras.
     */
    sombras: true,

    /**
     * Activar iluminación.
     */
    iluminacion: true,

    /**
     * Escala de interfaz.
     */
    escalaUI: 1.0,

    /**
     * Inicialización.
     */
    async inicializar() {

        if (this.inicializado) {
            return;
        }

        console.info("Configuración de render inicializada.");

        this.inicializado = true;

    },

    /**
     * Restaura la configuración.
     */
    restaurarValores() {

        this.motor = "canvas2d";

        this.zoomInicial = 1.0;

        this.zoomMinimo = 0.25;

        this.zoomMaximo = 20.0;

        this.antialias = true;

        this.mostrarFPS = false;

        this.mostrarCuadricula = false;

        this.mostrarCoordenadas = false;

        this.colorFondo = "#101820";

        this.sombras = true;

        this.iluminacion = true;

        this.escalaUI = 1.0;

    },

    /**
     * Libera el módulo.
     */
    destruir() {

        this.restaurarValores();

        this.inicializado = false;

    }

};