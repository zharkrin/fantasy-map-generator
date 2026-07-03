/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : index.js
Ruta     : frontend/js/core/index.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Núcleo principal (Core) de la aplicación.

El Core es el encargado de:

- Inicializar todos los módulos.
- Gestionar el ciclo de vida del proyecto.
- Ejecutar el bucle principal.
- Actualizar los módulos.
- Renderizar los módulos.
- Finalizar correctamente la aplicación.

IMPORTANTE:

El Core NO contiene lógica del mapa.

Simplemente coordina todos los sistemas.

==========================================================
*/

import { configuracion } from "./config/index.js";
import { estado } from "./estado/index.js";

export class Core {

    /**
     * Constructor.
     */
    constructor() {

        /**
         * Lista de módulos registrados.
         * Todos los sistemas futuros (Render,
         * Terreno, Clima, IA, etc.) se añadirán aquí.
         */
        this.modulos = [];

        /**
         * Estado del motor.
         */
        this.iniciado = false;

        /**
         * Control del bucle principal.
         */
        this.enEjecucion = false;

        /**
         * Frame anterior.
         */
        this.tiempoAnterior = 0;

        /**
         * Delta Time.
         */
        this.deltaTime = 0;

        /**
         * ID del requestAnimationFrame.
         */
        this.animationFrame = null;

    }

    /**
     * Inicializa el motor.
     */
    async inicializar() {

        console.info("==========================================");
        console.info("Inicializando Core...");
        console.info("==========================================");

        await configuracion.inicializar();

        await estado.inicializar();

        this.registrarModulo(configuracion);
        this.registrarModulo(estado);

        await this.inicializarModulos();

        this.iniciado = true;

        this.iniciarBucle();

        console.info("Core inicializado correctamente.");

    }

    /**
     * Registra un módulo.
     *
     * @param {Object} modulo
     */
    registrarModulo(modulo) {

        if (!modulo) {
            return;
        }

        this.modulos.push(modulo);

    }

    /**
     * Inicializa todos los módulos registrados.
     */
    async inicializarModulos() {

        for (const modulo of this.modulos) {

            if (typeof modulo.inicializar === "function") {

                await modulo.inicializar();

            }

        }

    }

    /**
     * Inicia el bucle principal.
     */
    iniciarBucle() {

        if (this.enEjecucion) {
            return;
        }

        this.enEjecucion = true;

        this.tiempoAnterior = performance.now();

        this.animationFrame = requestAnimationFrame(
            this.bucle.bind(this)
        );

    }

    /**
     * Bucle principal.
     *
     * @param {number} tiempoActual
     */
    bucle(tiempoActual) {

        if (!this.enEjecucion) {
            return;
        }

        this.deltaTime =
            (tiempoActual - this.tiempoAnterior) / 1000;

        this.tiempoAnterior = tiempoActual;

        this.actualizar(this.deltaTime);

        this.renderizar(this.deltaTime);

        this.animationFrame = requestAnimationFrame(
            this.bucle.bind(this)
        );

    }

    /**
     * Actualiza todos los módulos.
     *
     * @param {number} deltaTime
     */
    actualizar(deltaTime) {

        for (const modulo of this.modulos) {

            if (typeof modulo.actualizar === "function") {

                modulo.actualizar(deltaTime);

            }

        }

    }

    /**
     * Renderiza todos los módulos.
     *
     * @param {number} deltaTime
     */
    renderizar(deltaTime) {

        for (const modulo of this.modulos) {

            if (typeof modulo.renderizar === "function") {

                modulo.renderizar(deltaTime);

            }

        }

    }

    /**
     * Detiene el motor.
     */
    detener() {

        this.enEjecucion = false;

        if (this.animationFrame !== null) {

            cancelAnimationFrame(this.animationFrame);

            this.animationFrame = null;

        }

    }

    /**
     * Destruye todos los módulos.
     */
    destruir() {

        this.detener();

        for (const modulo of this.modulos) {

            if (typeof modulo.destruir === "function") {

                modulo.destruir();

            }

        }

        this.modulos.length = 0;

        this.iniciado = false;

        console.info("Core destruido.");

    }

}