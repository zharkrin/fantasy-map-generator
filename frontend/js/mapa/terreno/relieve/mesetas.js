 M frontend/js/mapa/terreno/relieve/mesetas.js
warning: in the working copy of 'frontend/js/mapa/terreno/relieve/mesetas.js', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'frontend/js/mapa/terreno/relieve/mesetas.js', LF will be replaced by CRLF the next time Git touches it
diff --git a/frontend/js/mapa/terreno/relieve/mesetas.js b/frontend/js/mapa/terreno/relieve/mesetas.js
index 3d20cd4..bc437ed 100644
--- a/frontend/js/mapa/terreno/relieve/mesetas.js
+++ b/frontend/js/mapa/terreno/relieve/mesetas.js
@@ -48,6 +48,7 @@ export function generarMesetas(mapaElevacion, opciones = {}) {
         radioMaximo = 32,
         separacionMinima = 20,
         permitirSolapamiento = false,
+        separacionMinimaCentros = 2,
         suavidadBorde = 0.30,
         variacionBorde = 4,
         variacionAltura = 0.05,
@@ -64,6 +65,7 @@ export function generarMesetas(mapaElevacion, opciones = {}) {
         radioMaximo,
         separacionMinima,
         permitirSolapamiento,
+        separacionMinimaCentros,
         suavidadBorde,
         variacionBorde,
         variacionAltura,
@@ -96,6 +98,7 @@ export function generarMesetas(mapaElevacion, opciones = {}) {
         cantidadMesetas,
         separacionMinima,
         permitirSolapamiento,
+        separacionMinimaCentros,
         random
     );
 
@@ -188,6 +191,15 @@ function validarOpciones(opciones) {
         throw new Error("permitirSolapamiento debe ser verdadero o falso.");
     }
 
+    if (
+        !Number.isInteger(opciones.separacionMinimaCentros) ||
+        opciones.separacionMinimaCentros < 1
+    ) {
+        throw new Error(
+            "separacionMinimaCentros debe ser un entero mayor o igual que uno."
+        );
+    }
+
     if (!Number.isFinite(opciones.variacionBorde) || opciones.variacionBorde < 0) {
         throw new Error("variacionBorde debe ser un número igual o mayor que cero.");
     }
@@ -222,17 +234,21 @@ function seleccionarCentros(
     cantidadMesetas,
     separacionMinima,
     permitirSolapamiento,
+    separacionMinimaCentros,
     random
 ) {
 
     const disponibles = [...candidatos];
     const centros = [];
-    const distanciaMinimaAlCuadrado = separacionMinima ** 2;
+    const distanciaMinima = permitirSolapamiento
+        ? separacionMinimaCentros
+        : separacionMinima;
+    const distanciaMinimaAlCuadrado = distanciaMinima ** 2;
 
     while (disponibles.length > 0 && centros.length < cantidadMesetas) {
         const indice = enteroAleatorio(random, 0, disponibles.length - 1);
         const candidato = disponibles.splice(indice, 1)[0];
-        const estaSeparado = permitirSolapamiento || centros.every((centro) => {
+        const estaSeparado = centros.every((centro) => {
             const dx = candidato.x - centro.x;
             const dy = candidato.y - centro.y;
 
@@ -269,7 +285,10 @@ function aplicarMeseta(
     const ancho = mapa[0].length;
     const radioConMargen = Math.ceil(radio + variacionBorde);
     const alturaBase = limitar(
-        alturaMeseta + (ruido.obtener(centroX, centroY) * variacionAltura)
+        alturaMeseta + (
+            normalizarRuidoBipolar(ruido.obtener(centroX, centroY)) *
+            variacionAltura
+        )
     );
 
     for (let y = Math.max(0, centroY - radioConMargen); y <= Math.min(alto - 1, centroY + radioConMargen); y++) {
@@ -281,7 +300,10 @@ function aplicarMeseta(
             const distancia = Math.hypot(x - centroX, y - centroY);
             const radioLocal = Math.max(
                 1,
-                radio + (ruido.obtener(x, y) * variacionBorde)
+                radio + (
+                    normalizarRuidoBipolar(ruido.obtener(x, y)) *
+                    variacionBorde
+                )
             );
 
             if (distancia > radioLocal) {
@@ -330,6 +352,26 @@ function calcularInfluencia(distancia, radioNucleo, radioLocal) {
 
 }
 
+/**
+ * Limita un valor de ruido a la salida bipolar del contrato actual.
+ *
+ * crearRuido() usa Simplex y fBm, ambos con salida esperada en [-1, 1].
+ * Mantener esta protección evita deformaciones excesivas si un motor futuro
+ * devuelve valores ligeramente fuera de dicho rango.
+ *
+ * @param {number} valor
+ * @returns {number}
+ */
+function normalizarRuidoBipolar(valor) {
+
+    if (!Number.isFinite(valor)) {
+        throw new Error("El generador de ruido devolvió un valor no válido.");
+    }
+
+    return Math.min(1, Math.max(-1, valor));
+
+}
+
 /** @returns {Function} */
 function crearGeneradorPseudoaleatorio(semilla) {
 
