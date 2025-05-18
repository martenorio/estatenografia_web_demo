# 🕵️‍♂️ Esteganografía en Imágenes PNG (Web)

Este proyecto es una herramienta web que permite **ocultar mensajes dentro de imágenes PNG** usando esteganografía por modificación de los bits menos significativos (LSB) en los canales R, G y B de cada píxel.

---

## ✨ Funcionalidades

- ✅ Ocultar texto en una imagen PNG.
- ✅ Extraer el mensaje oculto desde una imagen modificada.
- ✅ Validación automática del tamaño máximo permitido según la resolución.
- ✅ Contador en tiempo real de bytes escritos en el mensaje.
- ✅ Soporte para texto UTF-8 (acentos, emojis, etc.).

---

## 🛠️ ¿Cómo funciona?

- Se insertan los bits del mensaje en el orden: R → G → B de cada píxel.
- Los primeros **4 bytes (32 bits)** de la imagen codifican la **longitud del mensaje** (formato little-endian).
- La imagen modificada luce igual visualmente, pero contiene el mensaje oculto.

---

## 📦 Uso

1. Carga una imagen PNG desde tu equipo.
2. Escribe un mensaje en el cuadro de texto.
3. Verifica que el mensaje **no exceda el límite permitido**.
4. Presiona el botón para generar y descargar la imagen con el mensaje oculto.
5. Para leer un mensaje, carga la imagen modificada y presiona **"Extraer mensaje"**.

---

## 📏 Límites Técnicos

- Capacidad máxima del mensaje:
  
  (Ancho × Alto × 3) / 8 - 4 bytes
  
  Ejemplo: una imagen 1920x1080 puede ocultar aprox. 759 KB de texto

## ⚠️ Recomendaciones
- Usa imágenes PNG originales o sin compresión adicional.

- No edites la imagen después de ocultar el mensaje.

- Para mensajes largos, usa imágenes de alta resolución.


## 🌐 Demo

[Live demo](https://martenorio.github.io/estatenografia_web_demo/)