/**
 * ==========================================================
 * Generador de Mapas Fantásticos
 * Estado del Mundo
 * ==========================================================
 */

import { CONFIG, obtenerEscala } from "../config.js";

const escalaInicial = obtenerEscala(
    CONFIG.mundo.escalaPorDefecto
);

export const mundo = {

    /*
    ==========================================
    Información general
    ==========================================
    */

    nombre: "Nuevo Mundo",

    descripcion: "",

    semilla: 0,

    escala: CONFIG.mundo.escalaPorDefecto,

    ancho: escalaInicial.ancho,

    alto: escalaInicial.alto,

    fechaCreacion: null,

    fechaModificacion: null,

    autor: "",

    version: CONFIG.proyecto.version

};

/*
==============================================
Funciones
==============================================
*/

export function cambiarNombre(nombre){

    mundo.nombre = nombre;

}

export function cambiarSemilla(semilla){

    mundo.semilla = semilla;

}

export function cambiarEscala(escala){

    const datos = obtenerEscala(escala);

    mundo.escala = escala;

    mundo.ancho = datos.ancho;

    mundo.alto = datos.alto;

}