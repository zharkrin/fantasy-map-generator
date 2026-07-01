/**
 * ==========================================================
 * Generador de Mapas Fantásticos
 * Archivo: frontend/js/core/config.js
 * ----------------------------------------------------------
 * Configuración global del proyecto.
 * Todas las constantes generales deben declararse aquí.
 * ==========================================================
 */

export const CONFIG = {

    /*
    |--------------------------------------------------------------------------
    | Información del proyecto
    |--------------------------------------------------------------------------
    */

    proyecto: {

        nombre: "Generador de Mapas Fantásticos",

        version: "0.1.0",

        autor: "Asmodeus"

    },

    /*
    |--------------------------------------------------------------------------
    | Mundo
    |--------------------------------------------------------------------------
    */

    mundo: {

        escalaMinima: 1,

        escalaMaxima: 10,

        escalaPorDefecto: 1,

        semillaMinima: 1,

        semillaMaxima: 999999999

    },

    /*
    |--------------------------------------------------------------------------
    | Canvas
    |--------------------------------------------------------------------------
    */

    canvas: {

        colorFondo: "#20242b",

        mostrarCuadricula: false,

        colorCuadricula: "#2d3138",

        tamañoCuadricula: 64

    },

    /*
    |--------------------------------------------------------------------------
    | Cámara
    |--------------------------------------------------------------------------
    */

    camara: {

        zoomMinimo: 0.25,

        zoomMaximo: 8,

        zoomInicial: 1,

        velocidadZoom: 0.1

    }

};

/**
 * ==========================================================
 * Configuración de cada escala mundial.
 * ==========================================================
 */

export const ESCALAS = {

    1: {

        nombre: "1x Tierra",

        ancho: 4096,

        alto: 2048,

        continentes: {

            minimo: 1,

            maximo: 3

        },

        islas: {

            minimo: 10,

            maximo: 30

        },

        rios: {

            minimo: 20,

            maximo: 80

        },

        naciones: {

            minimo: 5,

            maximo: 20

        }

    },

    2: {

        nombre: "2x Tierra",

        ancho: 8192,

        alto: 4096,

        continentes: {

            minimo: 2,

            maximo: 5

        },

        islas: {

            minimo: 20,

            maximo: 60

        },

        rios: {

            minimo: 50,

            maximo: 150

        },

        naciones: {

            minimo: 10,

            maximo: 40

        }

    },

    3: {

        nombre: "3x Tierra",

        ancho: 12288,

        alto: 6144,

        continentes: {

            minimo: 3,

            maximo: 7

        },

        islas: {

            minimo: 30,

            maximo: 90

        },

        rios: {

            minimo: 100,

            maximo: 250

        },

        naciones: {

            minimo: 20,

            maximo: 60

        }

    },

    4: {

        nombre: "4x Tierra",

        ancho: 16384,

        alto: 8192,

        continentes: {

            minimo: 4,

            maximo: 9

        },

        islas: {

            minimo: 40,

            maximo: 120

        },

        rios: {

            minimo: 150,

            maximo: 350

        },

        naciones: {

            minimo: 30,

            maximo: 80

        }

    },

    5: {

        nombre: "5x Tierra",

        ancho: 20480,

        alto: 10240,

        continentes: {

            minimo: 5,

            maximo: 12

        },

        islas: {

            minimo: 50,

            maximo: 150

        },

        rios: {

            minimo: 250,

            maximo: 500

        },

        naciones: {

            minimo: 40,

            maximo: 120

        }

    },

    6: {

        nombre: "6x Tierra",

        ancho: 24576,

        alto: 12288,

        continentes: {

            minimo: 6,

            maximo: 14

        },

        islas: {

            minimo: 70,

            maximo: 180

        },

        rios: {

            minimo: 350,

            maximo: 700

        },

        naciones: {

            minimo: 60,

            maximo: 160

        }

    },

    7: {

        nombre: "7x Tierra",

        ancho: 28672,

        alto: 14336,

        continentes: {

            minimo: 7,

            maximo: 16

        },

        islas: {

            minimo: 90,

            maximo: 220

        },

        rios: {

            minimo: 500,

            maximo: 900

        },

        naciones: {

            minimo: 80,

            maximo: 220

        }

    },

    8: {

        nombre: "8x Tierra",

        ancho: 32768,

        alto: 16384,

        continentes: {

            minimo: 8,

            maximo: 18

        },

        islas: {

            minimo: 110,

            maximo: 260

        },

        rios: {

            minimo: 700,

            maximo: 1100

        },

        naciones: {

            minimo: 120,

            maximo: 300

        }

    },

    9: {

        nombre: "9x Tierra",

        ancho: 36864,

        alto: 18432,

        continentes: {

            minimo: 9,

            maximo: 20

        },

        islas: {

            minimo: 130,

            maximo: 300

        },

        rios: {

            minimo: 900,

            maximo: 1400

        },

        naciones: {

            minimo: 160,

            maximo: 400

        }

    },

    10: {

        nombre: "10x Tierra",

        ancho: 40960,

        alto: 20480,

        continentes: {

            minimo: 10,

            maximo: 25

        },

        islas: {

            minimo: 150,

            maximo: 400

        },

        rios: {

            minimo: 1200,

            maximo: 1800

        },

        naciones: {

            minimo: 200,

            maximo: 500

        }

    }

};

/**
 * ==========================================================
 * Devuelve la configuración de una escala.
 * ==========================================================
 */

export function obtenerEscala(escala) {

    return ESCALAS[escala] ?? ESCALAS[1];

}