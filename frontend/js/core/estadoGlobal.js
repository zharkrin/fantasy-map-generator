/**
 * ==========================================================
 * Generador de Mapas Fantásticos
 * Estado Global
 * ==========================================================
 *
 * ESTE ARCHIVO NUNCA GUARDARÁ DATOS.
 *
 * Únicamente une todos los módulos
 * del estado del proyecto.
 *
 * ==========================================================
 */

import { mundo } from "./estado/mundo.js";

import { terreno } from "./estado/terreno.js";

export const estadoGlobal = {

    /*
    ==========================================
    Información general
    ==========================================
    */

    mundo,

    /*
    ==========================================
    Sistemas
    ==========================================
    */

    terreno

};