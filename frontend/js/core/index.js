/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : index.js
Ruta     : frontend/js/core/index.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Núcleo principal (Core) de la aplicación.

Responsabilidades:

- Inicializar los servicios principales.
- Gestionar el ciclo de vida del motor.
- Ejecutar el bucle principal.
- Coordinar los módulos registrados.

==========================================================
*/

import { configuracion } from "./config/index.js";
import { estado } from "./estado/index.js";
import { random } from "./random/index.js";

export class Core {

    constructor() {

        this.modulos = [];

        this.iniciado = false;

        this.enEjecucion = false;

        this.tiempoAnterior = 0;

        this.deltaTime = 0;

        this.animationFrame = null;

    }

    async inicializar() {

        console.info("==========================================");
        console.info("Inicializando Core...");
        console.info("==========================================");

        /*
        ==========================================
        Servicios principales
        ==========================================
        */

        await configuracion.inicializar();

        random.inicializar(
            configuracion.mundo.semilla
        );

        await estado.inicializar();

        /*
        ==========================================
        Registro de módulos
        ==========================================
        */

        this.registrarModulo(configuracion);

        this.registrarModulo(estado);

        await this.inicializarModulos();

        this.iniciado = true;

        this.iniciarBucle();

        console.info("Core inicializado correctamente.");

    }

    registrarModulo(modulo) {

        if (!modulo) {
            return;
        }

        if (this.modulos.includes(modulo)) {
            return;
        }

        this.modulos.push(modulo);

    }

    async inicializarModulos() {

        for (const modulo of this.modulos) {

            if (typeof modulo.inicializar === "function") {

                await modulo.inicializar();

            }

        }

    }

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

    actualizar(deltaTime) {

        for (const modulo of this.modulos) {

            if (typeof modulo.actualizar === "function") {

                modulo.actualizar(deltaTime);

            }

        }

    }

    renderizar(deltaTime) {

        for (const modulo of this.modulos) {

            if (typeof modulo.renderizar === "function") {

                modulo.renderizar(deltaTime);

            }

        }

    }

    detener() {

        this.enEjecucion = false;

        if (this.animationFrame !== null) {

            cancelAnimationFrame(this.animationFrame);

            this.animationFrame = null;

        }

    }

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