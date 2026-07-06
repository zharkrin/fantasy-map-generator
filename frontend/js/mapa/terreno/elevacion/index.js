/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : index.js
Ruta     : frontend/js/mapa/terreno/elevacion/index.js
Autor    : OpenAI + Asmodeus
Licencia : MIT

Descripción:
Pipeline del sistema de elevación.

Este módulo coordina las distintas etapas necesarias
para generar un mapa de elevación.

==========================================================
*/

import { generarElevacion } from "./generarElevacion.js";
import { suavizarElevacion } from "./suavizar.js";
import { erosionarElevacion } from "./erosion.js";

/**
 * Genera un mapa de elevación completo.
 *
 * @param {Object} opciones
 *
 * @returns {Array<Array<Object>>}
 */
export function generarMapaElevacion(opciones = {}) {

    const {

        ancho = 512,

        alto = 512,

        suavizados = 2,

        erosion = true,

        intensidadErosion = 0.15

    } = opciones;

    let mapa = generarElevacion(ancho, alto);

    for (let i = 0; i < suavizados; i++) {

        mapa = suavizarElevacion(mapa);

    }

    if (erosion) {

        mapa = erosionarElevacion(
            mapa,
            intensidadErosion
        );

    }

    return mapa;

}

/**
 * Exportaciones públicas.
 */
export {
    generarElevacion,
    suavizarElevacion,
    erosionarElevacion
};