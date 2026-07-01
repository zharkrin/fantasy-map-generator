/**
 * ==========================================================
 * Generador de Mapas Fantásticos
 * Estado del Terreno
 * ==========================================================
 */

export const terreno = {

    /*
    ==========================================
    Datos principales
    ==========================================
    */

    altura: [],

    pendientes: [],

    erosion: [],

    humedad: [],

    temperatura: [],

    /*
    ==========================================
    Formaciones
    ==========================================
    */

    continentes: [],

    islas: [],

    montañas: [],

    cordilleras: [],

    colinas: [],

    volcanes: [],

    cañones: [],

    acantilados: [],

    playas: []

};

/*
==============================================
Funciones
==============================================
*/

export function limpiarTerreno(){

    terreno.altura = [];

    terreno.pendientes = [];

    terreno.erosion = [];

    terreno.humedad = [];

    terreno.temperatura = [];

    terreno.continentes = [];

    terreno.islas = [];

    terreno.montañas = [];

    terreno.cordilleras = [];

    terreno.colinas = [];

    terreno.volcanes = [];

    terreno.cañones = [];

    terreno.acantilados = [];

    terreno.playas = [];

}