import { CONFIG_ESCALAS } from "../core/config.js";
import { estadoGlobal } from "../core/estadoGlobal.js";

const slider =
document.getElementById("sliderEscala");

const input =
document.getElementById("inputEscala");

const texto =
document.getElementById("textoEscala");

const info =
document.getElementById("infoEscala");

function actualizar(valor){

    valor = Number(valor);

    slider.value = valor;
    input.value = valor;

    const config = CONFIG_ESCALAS[valor];

    texto.textContent =
        `Escala: ${valor}x Tierra`;

    info.innerHTML = `
        <div>Ancho: ${config.ancho}</div>
        <div>Alto: ${config.alto}</div>
        <div>Continentes: ${config.continentes}</div>
        <div>Islas: ${config.islas}</div>
        <div>Ríos: ${config.rios}</div>
        <div>Naciones: ${config.naciones}</div>
    `;
}

slider.addEventListener("input", () => {
    actualizar(slider.value);
});

input.addEventListener("input", () => {

    let valor = Number(input.value);

    if(valor < 1) valor = 1;
    if(valor > 10) valor = 10;

    actualizar(valor);
});

document
.getElementById("btnCrearMundo")
.addEventListener("click", () => {

    const escala = Number(slider.value);

    const config = CONFIG_ESCALAS[escala];

    estadoGlobal.mundo.escalaMundo = escala;
    estadoGlobal.mundo.ancho = config.ancho;
    estadoGlobal.mundo.alto = config.alto;

    console.log("Mundo creado", estadoGlobal.mundo);

});

actualizar(1);