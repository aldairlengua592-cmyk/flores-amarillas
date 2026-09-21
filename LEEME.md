# Flores amarillas

Abre `index.html` con doble clic. Funciona sin instalaciones, frameworks ni conexión a internet.

Mantén estos cuatro archivos juntos:

```
regalo-flores/
├── index.html
├── style.css
├── script.js
└── cancion.mp3
```

## Personalización

Al inicio de `script.js`, edita `CONFIG`:

- `nombre`: nombre de la persona.
- `mensaje`: texto de la tarjeta.
- `nombreCancion`: título mostrado en el reproductor.
- `fraseInicial`: texto de bienvenida.

Al inicio de `style.css`, cambia `--primary` para ajustar el color principal.

## Música

El audio recibido está incluido como `cancion.mp3` y configurado en `script.js`.

Para cambiar la música:

1. Sustituye `cancion.mp3` por el nuevo audio, conservando ese nombre.
2. Si usas otro nombre, actualiza `archivoCancion` en `script.js`.
3. Vuelve a abrir la página y pulsa «Descubrir mi regalo».

El audio intentará comenzar desde ese clic. Si el navegador requiere otro gesto, pulsa «Reproducir». El reproductor permite pausar y avanzar por la canción.

Las flores se generan con HTML y CSS. El regalo respeta la preferencia de movimiento reducido del dispositivo; los efectos decorativos se detienen cuando la pestaña está oculta.
