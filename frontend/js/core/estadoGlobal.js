/**
 * ==========================================================
 * Generador de Mapas Fantásticos
 * Archivo:
 * frontend/js/core/estadoGlobal.js
 * ----------------------------------------------------------
 * Estado global del motor.
 *
 * Todo el proyecto trabaja sobre este objeto.
 * Ningún módulo debe guardar información permanente fuera
 * de este estado.
 * ==========================================================
 */

import { CONFIG, obtenerEscala } from "./config.js";

/**
 * ----------------------------------------------------------
 * Crea un mundo completamente nuevo.
 * ----------------------------------------------------------
 */

function crearMundo() {

    const escala = obtenerEscala(
        CONFIG.mundo.escalaPorDefecto
    );

    return {

        /*
        ------------------------------------------------------
        Información general
        ------------------------------------------------------
        */

        nombre: "Nuevo Mundo",

        descripcion: "",

        semilla: 0,

        escala: CONFIG.mundo.escalaPorDefecto,

        ancho: escala.ancho,

        alto: escala.alto,

        fechaCreacion: null,

        ultimaModificacion: null,

        /*
        ------------------------------------------------------
        Capas del mapa
        ------------------------------------------------------
        */

        altura: [],

        humedad: [],

        temperatura: [],

        biomas: [],

        oceanos: [],

        mares: [],

        continentes: [],

        islas: [],

        montañas: [],

        volcanes: [],

        rios: [],

        lagos: [],

        deltas: [],

        oasis: [],

        bosques: [],

        pantanos: [],

        desiertos: [],

        tundras: [],

        glaciares: [],

        recursos: [],

        /*
        ------------------------------------------------------
        Civilización
        ------------------------------------------------------
        */

        ciudades: [],

        aldeas: [],

        fortalezas: [],

        puertos: [],

        ruinas: [],

        caminos: [],

        rutasMaritimas: [],

        rutasComerciales: [],

        rutasMilitares: [],

        rutasMagicas: [],

        puentes: [],

        /*
        ------------------------------------------------------
        Política
        ------------------------------------------------------
        */

        naciones: [],

        provincias: [],

        regiones: [],

        culturas: [],

        religiones: [],

        idiomas: [],

        razas: [],

        facciones: [],

        guerras: [],

        alianzas: [],

        comercio: [],

        economia: [],

        /*
        ------------------------------------------------------
        Objetos personalizados
        ------------------------------------------------------
        */

        etiquetas: [],

        marcadores: [],

        objetos: [],

        notas: []

    };

}

/**
 * ==========================================================
 * Estado Global
 * ==========================================================
 */

export const estadoGlobal = {

    /*
    ----------------------------------------------------------
    Configuración de la aplicación
    ----------------------------------------------------------
    */

    aplicacion: {

        iniciada: false,

        version: CONFIG.proyecto.version

    },

    /*
    ----------------------------------------------------------
    Mundo actual
    ----------------------------------------------------------
    */

    mundo: crearMundo(),

    /*
    ----------------------------------------------------------
    Cámara
    ----------------------------------------------------------
    */

    camara: {

        x: 0,

        y: 0,

        zoom: CONFIG.camara.zoomInicial

    },

    /*
    ----------------------------------------------------------
    Selección actual
    ----------------------------------------------------------
    */

    seleccion: {

        herramienta: null,

        objeto: null,

        capa: null

    },

    /*
    ----------------------------------------------------------
    Editor
    ----------------------------------------------------------
    */

    editor: {

        modificando: false,

        pincel: {

            tamaño: 50,

            intensidad: 1

        }

    }

};

/**
 * ==========================================================
 * Reinicia completamente el mundo.
 * ==========================================================
 */

export function reiniciarMundo() {

    estadoGlobal.mundo = crearMundo();

}

/**
 * ==========================================================
 * Cambia la escala del mundo.
 * ==========================================================
 */

export function cambiarEscala(escalaNueva) {

    const escala = obtenerEscala(escalaNueva);

    estadoGlobal.mundo.escala = escalaNueva;

    estadoGlobal.mundo.ancho = escala.ancho;

    estadoGlobal.mundo.alto = escala.alto;

}

/**
 * ==========================================================
 * Cambia la semilla.
 * ==========================================================
 */

export function cambiarSemilla(semilla) {

    estadoGlobal.mundo.semilla = semilla;

}

/**
 * ==========================================================
 * Devuelve el mundo actual.
 * ==========================================================
 */

export function obtenerMundo() {

    return estadoGlobal.mundo;

}

/**
 * ==========================================================
 * Devuelve la cámara.
 * ==========================================================
 */

export function obtenerCamara() {

    return estadoGlobal.camara;

}