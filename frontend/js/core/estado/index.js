/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : index.js
Ruta     : frontend/js/core/estado/index.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Gestor del estado global del proyecto.

Este módulo centraliza todos los estados de la aplicación.

Ningún módulo accederá directamente a los archivos internos
del estado.

Toda interacción deberá realizarse mediante este archivo.

Responsabilidades:

- Inicializar los estados.
- Centralizar el acceso.
- Gestionar el ciclo de vida.
- Facilitar futuras ampliaciones.

==========================================================
*/

import { estadoMundo } from "./mundo.js";

/**
 * Estado global del proyecto.
 */
export const estado = {

    /**
     * Estado del mundo.
     */
    mundo: estadoMundo,

    /**
     * Indica si el estado ha sido inicializado.
     */
    inicializado: false,

    /**
     * Inicializa todos los estados.
     */
    async inicializar() {

        if (this.inicializado) {
            return;
        }

        console.info("Inicializando estado global...");

        await this.mundo.inicializar();

        this.inicializado = true;

        console.info("Estado global inicializado.");

    },

    /**
     * Actualización del estado.
     *
     * Se ejecuta una vez por fotograma desde el Core.
     *
     * @param {number} deltaTime
     */
    actualizar(deltaTime) {

        if (typeof this.mundo.actualizar === "function") {

            this.mundo.actualizar(deltaTime);

        }

    },

    /**
     * Renderizado del estado.
     *
     * Actualmente no realiza ninguna acción, pero se
     * mantiene por consistencia con el ciclo de vida de
     * todos los módulos del proyecto.
     *
     * @param {number} deltaTime
     */
    renderizar(deltaTime) {

        if (typeof this.mundo.renderizar === "function") {

            this.mundo.renderizar(deltaTime);

        }

    },

    /**
     * Reinicia todos los estados del proyecto.
     */
    reiniciar() {

        if (typeof this.mundo.reiniciar === "function") {

            this.mundo.reiniciar();

        }

    },

    /**
     * Libera todos los recursos asociados al estado.
     */
    destruir() {

        if (typeof this.mundo.destruir === "function") {

            this.mundo.destruir();

        }

        this.inicializado = false;

        console.info("Estado global destruido.");

    }

};