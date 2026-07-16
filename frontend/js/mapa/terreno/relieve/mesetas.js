/*
==========================================================
Proyecto : Fantasy Map Generator
Archivo  : mesetas.js
Ruta     : frontend/js/mapa/terreno/relieve/
Licencia : MIT
==========================================================

Generador de mesetas.

Genera regiones terrestres elevadas con una cima
relativamente plana, bordes irregulares y altura variable.
Los tipos disponibles son: clasica, volcanica, altiplano,
mesa y tepuy.

No modifica el mapa recibido.
==========================================================
*/

const TIPOS_MESETA = new Set([
    "clasica",
    "volcanica",
    "altiplano",
    "mesa",
    "tepuy"
]);

/**
 * Genera mesetas sobre un mapa de elevación normalizado.
 *
 * @param {number[][]} mapaElevacion Mapa con valores entre 0 y 1.
 * @param {Object} opciones Configuración del generador.
 * @returns {number[][]} Nueva matriz de elevación.
 */
export function generarMesetas(mapaElevacion, opciones = {}) {

    validarMapaElevacion(mapaElevacion);

    const {
        semilla = 12345,
        nivelMar = 0.50,
        cantidadMesetas = 4,
        tipoMeseta = "clasica",
        alturaMinima = 0.58,
        alturaMeseta = 0.72,
        radioMinimo = 10,
        radioMaximo = 32,
        separacionMinima = 20,
        suavidadBorde = 0.30,
        variacionBorde = 4,
        variacionAltura = 0.05,
        frecuenciaRuido = 0.08
    } = opciones;

    validarOpciones({
        nivelMar,
        cantidadMesetas,
        tipoMeseta,
        alturaMinima,
        alturaMeseta,
        radioMinimo,
        radioMaximo,
        separacionMinima,
        suavidadBorde,
        variacionBorde,
        variacionAltura,
        frecuenciaRuido
    });

    const resultado = mapaElevacion.map((fila) => [...fila]);
    const candidatos = obtenerCandidatos(
        mapaElevacion,
        nivelMar,
        alturaMinima
    );

    if (candidatos.length === 0 || cantidadMesetas === 0) {
        return resultado;
    }

    const random = crearGeneradorPseudoaleatorio(semilla);
    const ruido = crearRuidoMesetas(semilla + 6000, frecuenciaRuido);
    const centros = seleccionarCentros(
        candidatos,
        cantidadMesetas,
        separacionMinima,
        random
    );

    for (const centro of centros) {
        const radio = enteroAleatorio(random, radioMinimo, radioMaximo);

        aplicarMeseta(
            resultado,
            centro.x,
            centro.y,
            radio,
            tipoMeseta,
            alturaMeseta,
            nivelMar,
            suavidadBorde,
            variacionBorde,
            variacionAltura,
            ruido
        );
    }

    return resultado;

}

/**
 * Comprueba que el mapa sea una matriz rectangular de números normalizados.
 *
 * @param {number[][]} mapaElevacion
 */
function validarMapaElevacion(mapaElevacion) {

    if (!Array.isArray(mapaElevacion) || mapaElevacion.length === 0) {
        throw new Error("El mapa de elevación no es válido.");
    }

    const ancho = mapaElevacion[0]?.length;

    if (!Number.isInteger(ancho) || ancho === 0) {
        throw new Error("El mapa de elevación debe contener filas no vacías.");
    }

    for (const fila of mapaElevacion) {
        if (!Array.isArray(fila) || fila.length !== ancho) {
            throw new Error("El mapa de elevación debe ser rectangular.");
        }

        for (const altura of fila) {
            if (!Number.isFinite(altura) || altura < 0 || altura > 1) {
                throw new Error(
                    "La elevación de cada celda debe estar entre 0 y 1."
                );
            }
        }
    }

}

/**
 * Valida las opciones públicas del generador.
 *
 * @param {Object} opciones
 */
function validarOpciones(opciones) {

    const valoresNormalizados = [
        opciones.nivelMar,
        opciones.alturaMinima,
        opciones.alturaMeseta,
        opciones.suavidadBorde,
        opciones.variacionAltura
    ];

    if (valoresNormalizados.some((valor) => !Number.isFinite(valor) || valor < 0 || valor > 1)) {
        throw new Error(
            "nivelMar, alturaMinima, alturaMeseta, suavidadBorde y variacionAltura deben estar entre 0 y 1."
        );
    }

    if (!TIPOS_MESETA.has(opciones.tipoMeseta)) {
        throw new Error(`Tipo de meseta no soportado: ${opciones.tipoMeseta}.`);
    }

    if (!Number.isInteger(opciones.cantidadMesetas) || opciones.cantidadMesetas < 0) {
        throw new Error("cantidadMesetas debe ser un entero igual o mayor que cero.");
    }

    if (
        !Number.isInteger(opciones.radioMinimo) ||
        !Number.isInteger(opciones.radioMaximo) ||
        opciones.radioMinimo < 1 ||
        opciones.radioMaximo < opciones.radioMinimo
    ) {
        throw new Error("Los radios de las mesetas no son válidos.");
    }

    if (!Number.isFinite(opciones.separacionMinima) || opciones.separacionMinima < 0) {
        throw new Error("separacionMinima debe ser un número igual o mayor que cero.");
    }

    if (!Number.isFinite(opciones.variacionBorde) || opciones.variacionBorde < 0) {
        throw new Error("variacionBorde debe ser un número igual o mayor que cero.");
    }

    if (!Number.isFinite(opciones.frecuenciaRuido) || opciones.frecuenciaRuido <= 0) {
        throw new Error("frecuenciaRuido debe ser un número mayor que cero.");
    }

}

/**
 * Obtiene celdas terrestres aptas para situar el centro de una meseta.
 *
 * @param {number[][]} mapaElevacion
 * @param {number} nivelMar
 * @param {number} alturaMinima
 * @returns {{x: number, y: number}[]}
 */
function obtenerCandidatos(mapaElevacion, nivelMar, alturaMinima) {

    const candidatos = [];
    const alturaRequerida = Math.max(nivelMar, alturaMinima);

    for (let y = 0; y < mapaElevacion.length; y++) {
        for (let x = 0; x < mapaElevacion[y].length; x++) {
            if (mapaElevacion[y][x] >= alturaRequerida) {
                candidatos.push({ x, y });
            }
        }
    }

    return candidatos;

}

/**
 * Selecciona centros separados para reducir solapamientos entre mesetas.
 *
 * @param {{x: number, y: number}[]} candidatos
 * @param {number} cantidadMesetas
 * @param {number} separacionMinima
 * @param {Function} random
 * @returns {{x: number, y: number}[]}
 */
function seleccionarCentros(
    candidatos,
    cantidadMesetas,
    separacionMinima,
    random
) {

    const disponibles = [...candidatos];
    const centros = [];
    const distanciaMinimaAlCuadrado = separacionMinima ** 2;

    while (disponibles.length > 0 && centros.length < cantidadMesetas) {
        const indice = enteroAleatorio(random, 0, disponibles.length - 1);
        const candidato = disponibles.splice(indice, 1)[0];

        const estaSeparado = centros.every((centro) => {
            const dx = candidato.x - centro.x;
            const dy = candidato.y - centro.y;

            return (dx * dx) + (dy * dy) >= distanciaMinimaAlCuadrado;
        });

        if (estaSeparado) {
            centros.push(candidato);
        }
    }

    return centros;

}

/**
 * Aplana una región con borde irregular y una altura objetivo dependiente del tipo.
 *
 * @param {number[][]} mapa
 * @param {number} centroX
 * @param {number} centroY
 * @param {number} radio
 * @param {string} tipoMeseta
 * @param {number} alturaMeseta
 * @param {number} nivelMar
 * @param {number} suavidadBorde
 * @param {number} variacionBorde
 * @param {number} variacionAltura
 * @param {{obtener: Function}} ruido
 */
function aplicarMeseta(
    mapa,
    centroX,
    centroY,
    radio,
    tipoMeseta,
    alturaMeseta,
    nivelMar,
    suavidadBorde,
    variacionBorde,
    variacionAltura,
    ruido
) {

    const alto = mapa.length;
    const ancho = mapa[0].length;
    const radioConMargen = Math.ceil(radio + variacionBorde);
    const ruidoCentro = ruido.obtener(centroX, centroY);
    const alturaBase = limitar(
        alturaMeseta + (ruidoCentro * variacionAltura)
    );

    for (let y = Math.max(0, centroY - radioConMargen); y <= Math.min(alto - 1, centroY + radioConMargen); y++) {
        for (let x = Math.max(0, centroX - radioConMargen); x <= Math.min(ancho - 1, centroX + radioConMargen); x++) {
            if (mapa[y][x] <= nivelMar) {
                continue;
            }

            const dx = x - centroX;
            const dy = y - centroY;
            const distancia = Math.hypot(dx, dy);
            const radioLocal = Math.max(
                1,
                radio + (ruido.obtener(x, y) * variacionBorde)
            );

            if (distancia > radioLocal) {
                continue;
            }

            const radioNucleo = radioLocal * (1 - suavidadBorde);
            const influencia = calcularInfluencia(
                distancia,
                radioNucleo,
                radioLocal
            );

            const alturaObjetivo = obtenerAlturaObjetivo(
                tipoMeseta,
                alturaBase,
                mapa[y][x]
            );

            mapa[y][x] = limitar(
                mapa[y][x] + ((alturaObjetivo - mapa[y][x]) * influencia)
            );
        }
    }

}

/**
 * Determina la altura de una meseta según su formación geológica.
 *
 * @param {string} tipoMeseta
 * @param {number} alturaMeseta
 * @param {number} alturaActual
 * @returns {number}
 */
function obtenerAlturaObjetivo(tipoMeseta, alturaMeseta, alturaActual) {

    switch (tipoMeseta) {
        case "volcanica":
            return Math.max(alturaActual, alturaMeseta + 0.08);

        case "altiplano":
            return Math.max(alturaActual, alturaMeseta - 0.03);

        case "mesa":
            return Math.max(alturaActual, alturaMeseta + 0.02);

        case "tepuy":
            return Math.max(alturaActual, alturaMeseta + 0.12);

        case "clasica":
        default:
            return Math.max(alturaActual, alturaMeseta);
    }

}

/**
 * Devuelve una influencia total en el núcleo y una transición suave en el borde.
 *
 * @param {number} distancia
 * @param {number} radioNucleo
 * @param {number} radioLocal
 * @returns {number}
 */
function calcularInfluencia(distancia, radioNucleo, radioLocal) {

    if (distancia <= radioNucleo || radioNucleo >= radioLocal) {
        return 1;
    }

    const progreso = (distancia - radioNucleo) / (radioLocal - radioNucleo);

    return 1 - (progreso * progreso * (3 - (2 * progreso)));

}

/**
 * Crea un ruido de valor suave y determinista con salida entre -1 y 1.
 *
 * @param {number} semilla
 * @param {number} frecuencia
 * @returns {{obtener: (x: number, y: number) => number}}
 */
function crearRuidoMesetas(semilla, frecuencia) {

    return {
        obtener(x, y) {
            const muestraX = x * frecuencia;
            const muestraY = y * frecuencia;
            const xBase = Math.floor(muestraX);
            const yBase = Math.floor(muestraY);
            const fraccionX = muestraX - xBase;
            const fraccionY = muestraY - yBase;

            const esquina00 = valorHash(xBase, yBase, semilla);
            const esquina10 = valorHash(xBase + 1, yBase, semilla);
            const esquina01 = valorHash(xBase, yBase + 1, semilla);
            const esquina11 = valorHash(xBase + 1, yBase + 1, semilla);
            const suaveX = suavizar(fraccionX);
            const suaveY = suavizar(fraccionY);
            const inferior = interpolar(esquina00, esquina10, suaveX);
            const superior = interpolar(esquina01, esquina11, suaveX);

            return interpolar(inferior, superior, suaveY);
        }
    };

}

/**
 * Obtiene un valor estable entre -1 y 1 para una coordenada entera.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} semilla
 * @returns {number}
 */
function valorHash(x, y, semilla) {

    let valor = (x * 374761393) + (y * 668265263) + (semilla * 69069);

    valor = Math.imul(valor ^ (valor >>> 13), 1274126177);

    return (((valor ^ (valor >>> 16)) >>> 0) / 2147483647.5) - 1;

}

/**
 * Interpolación cúbica suave.
 *
 * @param {number} valor
 * @returns {number}
 */
function suavizar(valor) {

    return valor * valor * (3 - (2 * valor));

}

/**
 * Interpola dos valores.
 *
 * @param {number} inicio
 * @param {number} final
 * @param {number} progreso
 * @returns {number}
 */
function interpolar(inicio, final, progreso) {

    return inicio + ((final - inicio) * progreso);

}

/**
 * Crea un generador Mulberry32 determinista.
 *
 * @param {number} semilla
 * @returns {Function}
 */
function crearGeneradorPseudoaleatorio(semilla) {

    let estado = Number(semilla) >>> 0;

    return () => {
        estado += 0x6D2B79F5;

        let temporal = estado;

        temporal = Math.imul(temporal ^ (temporal >>> 15), temporal | 1);
        temporal ^= temporal + Math.imul(temporal ^ (temporal >>> 7), temporal | 61);

        return ((temporal ^ (temporal >>> 14)) >>> 0) / 4294967296;
    };

}

/**
 * Devuelve un entero inclusivo a partir de un generador pseudoaleatorio.
 *
 * @param {Function} random
 * @param {number} minimo
 * @param {number} maximo
 * @returns {number}
 */
function enteroAleatorio(random, minimo, maximo) {

    return Math.floor(random() * ((maximo - minimo) + 1)) + minimo;

}

/**
 * Limita un valor al rango normalizado del mapa.
 *
 * @param {number} valor
 * @returns {number}
 */
function limitar(valor) {

    return Math.min(1, Math.max(0, valor));

}
