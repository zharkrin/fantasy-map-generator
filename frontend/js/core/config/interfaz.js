/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : interfaz.js
Ruta     : frontend/js/core/config/interfaz.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Configuración global de la interfaz de usuario.

Este módulo almacena únicamente preferencias de la
interfaz. No contiene lógica de la UI ni referencias
directas a elementos del DOM.

==========================================================
*/

export const configuracionInterfaz = {

    /**
     * Indica si el módulo ha sido inicializado.
     */
    inicializado: false,

    /**
     * Idioma de la interfaz.
     *
     * Valores iniciales soportados:
     * - es
     * - en
     */
    idioma: "es",

    /**
     * Tema visual.
     *
     * Valores previstos:
     * - oscuro
     * - claro
     */
    tema: "oscuro",

    /**
     * Mostrar panel izquierdo.
     */
    mostrarPanelIzquierdo: true,

    /**
     * Mostrar panel derecho.
     */
    mostrarPanelDerecho: true,

    /**
     * Mostrar barra de herramientas.
     */
    mostrarBarraHerramientas: true,

    /**
     * Mostrar barra de estado.
     */
    mostrarBarraEstado: true,

    /**
     * Mostrar minimapa.
     */
    mostrarMiniMapa: false,

    /**
     * Confirmar acciones destructivas.
     */
    confirmarAcciones: true,

    /**
     * Activar animaciones.
     */
    animaciones: true,

    /**
     * Escala global de la interfaz.
     */
    escala: 1.0,

    /**
     * Inicializa el módulo.
     */
    async inicializar() {

        if (this.inicializado) {
            return;
        }

        console.info("Configuración de la interfaz inicializada.");

        this.inicializado = true;

    },

    /**
     * Cambia el idioma.
     *
     * @param {string} idioma
     */
    establecerIdioma(idioma) {

        this.idioma = idioma;

    },

    /**
     * Cambia el tema.
     *
     * @param {string} tema
     */
    establecerTema(tema) {

        this.tema = tema;

    },

    /**
     * Restaura la configuración por defecto.
     */
    restaurarValores() {

        this.idioma = "es";

        this.tema = "oscuro";

        this.mostrarPanelIzquierdo = true;

        this.mostrarPanelDerecho = true;

        this.mostrarBarraHerramientas = true;

        this.mostrarBarraEstado = true;

        this.mostrarMiniMapa = false;

        this.confirmarAcciones = true;

        this.animaciones = true;

        this.escala = 1.0;

    },

    /**
     * Libera el módulo.
     */
    destruir() {

        this.restaurarValores();

        this.inicializado = false;

    }

};