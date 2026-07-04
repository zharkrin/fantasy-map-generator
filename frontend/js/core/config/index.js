/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : index.js
Ruta     : frontend/js/core/config/index.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Módulo principal de configuración.

Este módulo centraliza todas las configuraciones del
proyecto.

Ningún sistema accederá directamente a los archivos de
configuración individuales.

Todos deberán hacerlo a través de este módulo.

Responsabilidades:

- Inicializar las configuraciones.
- Proporcionar acceso unificado.
- Validar la carga.
- Facilitar futuras ampliaciones.

==========================================================
*/

import { configuracionMundo } from "./mundo.js";
import { configuracionRender } from "./render.js";
import { configuracionInterfaz } from "./interfaz.js";

/**
 * Módulo principal de configuración.
 */
export const configuracion = {

    /**
     * Configuración del mundo.
     */
    mundo: configuracionMundo,

    /**
     * Configuración del render.
     */
    render: configuracionRender,

    /**
     * Configuración de la interfaz.
     */
    interfaz: configuracionInterfaz,

    /**
     * Indica si el módulo ya fue inicializado.
     */
    inicializado: false,

    /**
     * Inicializa todas las configuraciones.
     */
    async inicializar() {

        if (this.inicializado) {
            return;
        }

        console.info("Inicializando configuraciones...");

        await this.mundo.inicializar();

        await this.render.inicializar();

        await this.interfaz.inicializar();

        this.inicializado = true;

        console.info("Configuraciones cargadas.");

    },

    /**
     * Método llamado por el Core.
     * Reservado para futuras necesidades.
     */
    actualizar() {
        // Sin implementación por el momento.
    },

    /**
     * Método llamado por el Core.
     * Reservado para futuras necesidades.
     */
    renderizar() {
        // Sin implementación por el momento.
    },

    /**
     * Libera el módulo.
     */
    destruir() {

        this.inicializado = false;

    }

};