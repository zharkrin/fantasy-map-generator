/**
 * ==========================================================
 * Generador de Mapas Fantásticos
 * Estado Global
 * ==========================================================
 *
 * Este archivo únicamente reúne todos los módulos de estado.
 * Nunca almacenará datos propios.
 * ==========================================================
 */

import { mundo } from "./estado/mundo.js";
import { terreno } from "./estado/terreno.js";
import { rios } from "./estado/rios.js";
import { lagos } from "./estado/lagos.js";
import { oceanos } from "./estado/oceanos.js";

export const estadoGlobal = {

    /*
    ==========================================================
    Información del mundo
    ==========================================================
    */

    mundo,

    /*
    ==========================================================
    Sistemas
    ==========================================================
    */

    terreno,

    rios,

    lagos,

    oceanos

};