'use strict';

// ── PERSONALIZA TU REGALO AQUÍ ──────────────────────────────
const CONFIG = {
  nombre: 'Ari',
  mensaje: 'Estas flores amarillas son para ti, porque quería regalarte algo que pudiera transmitir un poquito de lo especial que eres para mí. 💛',
  nombreCancion: 'Una canción para ti',
  fraseInicial: '🌻 Tengo un pequeño regalo para ti...',
  // Archivo local: se reproduce al pulsar «Descubrir mi regalo».
  archivoCancion: 'cancion.mp3',
  // Volumen de fondo: 0 es silencio y 1 es el volumen máximo.
  volumenCancion: 0.05
};
// COLOR PRINCIPAL: variable --primary al inicio de style.css.

const $ = (id) => document.getElementById(id);
const audio = $('audio');
audio.volume = CONFIG.volumenCancion;
const play = $('play');
const progress = $('progress');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let opened = false;
let effectTimer;
let touchTimer;

$('recipient').textContent = CONFIG.nombre;
$('message').textContent = CONFIG.mensaje;
$('song-title').textContent = CONFIG.nombreCancion;
$('intro-title').textContent = CONFIG.fraseInicial;

// Ángulo, longitud del tallo y tamaño: nueve flores forman el ramo.
const arrangement = [
  [-30, 290, .82], [28, 303, .86], [-17, 351, .93],
  [12, 367, .9], [0, 407, .95], [-36, 230, .86],
  [35, 232, .86], [-13, 269, 1.03], [14, 278, 1.02]
];

function createBouquet() {
  arrangement.forEach(([angle, height, size], index) => {
    const flower = document.createElement('span');
    flower.className = 'flower';
    flower.setAttribute('aria-hidden', 'true');
    flower.style.cssText = `--angle:${angle}deg;--height:${height}px;--size:${size};--delay:${index * .12}s;--speed:${3.5 + index * .23}s;z-index:${index + 1}`;
    const sway = document.createElement('span');
    sway.className = 'flower-sway';
    for (const className of ['stem', 'leaf', 'leaf second']) {
      const part = document.createElement('span');
      part.className = className;
      sway.append(part);
    }
    const blossom = document.createElement('span');
    blossom.className = 'blossom';
    for (let p = 0; p < 24; p++) {
      const petal = document.createElement('span');
      petal.className = p < 12 ? 'petal' : 'petal inner';
      petal.style.setProperty('--rotation', `${(p % 12) * 30 + (p >= 12 ? 15 : 0)}deg`);
      blossom.append(petal);
    }
    const center = document.createElement('span');
    center.className = 'flower-center';
    blossom.append(center);
    sway.append(blossom);
    flower.append(sway);
    $('bouquet').append(flower);
  });
}

// Efectos limitados y retirados del DOM al terminar su animación.
function particle(type, x, y) {
  if (motion.matches || document.hidden || $('particles').childElementCount >= 45) return;
  const item = document.createElement('span');
  item.className = type;
  if (type === 'falling' || type === 'falling-star') {
    item.style.left = `${Math.random() * 100}%`;
    item.style.setProperty('--duration', `${7 + Math.random() * 6}s`);
    item.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
    if (type === 'falling-star') {
      // Estrellas de distintos tamaños con un brillo discreto.
      item.textContent = Math.random() < .5 ? '✦' : '★';
      item.style.fontSize = `${10 + Math.random() * 9}px`;
    }
  } else {
    item.textContent = type === 'heart' ? '♡' : '✧';
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
  }
  item.addEventListener('animationend', () => item.remove(), { once: true });
  $('particles').append(item);
}

function ambientEffects() {
  clearInterval(effectTimer);
  if (!opened || motion.matches || document.hidden) return;
  effectTimer = setInterval(() => {
    particle('falling');
    if (Math.random() < .65) particle('falling-star');
    const rect = $('bouquet').getBoundingClientRect();
    const x = rect.left + rect.width * (.15 + Math.random() * .7);
    const y = rect.top + rect.height * (.1 + Math.random() * .5);
    particle(Math.random() < .18 ? 'heart' : 'sparkle', x, y);
  }, 650);
}

function syncPlayback() {
  play.textContent = audio.paused ? '▶ Reproducir' : '⏸ Pausar';
}

async function startMusic() {
  try {
    await audio.play();
    $('music-status').textContent = 'Una melodía para acompañar tus flores.';
  } catch {
    $('music-status').textContent = audio.error
      ? 'No se pudo cargar la canción. Comprueba el archivo de audio.'
      : 'Pulsa Reproducir para comenzar la canción.';
  }
  syncPlayback();
}

$('discover').addEventListener('click', () => {
  if (opened) return;
  opened = true;
  $('discover').disabled = true;
  // Se llama desde el clic para conservar el permiso de audio del navegador.
  if (CONFIG.archivoCancion) {
    audio.src = CONFIG.archivoCancion;
    play.disabled = false;
    startMusic();
  }
  $('intro').classList.add('leaving');
  setTimeout(() => {
    $('intro').hidden = true;
    $('gift').hidden = false;
    createBouquet();
    $('gift-title').focus({ preventScroll: true });
    for (let i = 0; i < 10; i++) particle('falling');
    for (let i = 0; i < 5; i++) particle('falling-star');
    ambientEffects();
  }, motion.matches ? 0 : 600);
});

// Click también funciona con el dedo, Enter y la barra espaciadora.
$('bouquet').addEventListener('click', () => {
  const rect = $('bouquet').getBoundingClientRect();
  $('bouquet').classList.add('touched');
  clearTimeout(touchTimer);
  touchTimer = setTimeout(() => $('bouquet').classList.remove('touched'), 900);
  for (let i = 0; i < 8; i++) {
    particle('heart', rect.left + rect.width * (.2 + Math.random() * .6), rect.top + rect.height * (.2 + Math.random() * .4));
  }
});

play.addEventListener('click', () => {
  if (audio.paused) startMusic();
  else audio.pause();
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

function updateProgress() {
  const valid = Number.isFinite(audio.duration) && audio.duration > 0;
  progress.disabled = !valid;
  progress.value = valid ? audio.currentTime / audio.duration * 100 : 0;
  $('time').textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  progress.setAttribute('aria-valuetext', $('time').textContent);
}

progress.addEventListener('input', () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = Number(progress.value) / 100 * audio.duration;
    updateProgress();
  }
});
['loadedmetadata', 'durationchange', 'timeupdate', 'ended'].forEach(event => audio.addEventListener(event, updateProgress));
['play', 'pause', 'ended'].forEach(event => audio.addEventListener(event, syncPlayback));
audio.addEventListener('error', () => {
  $('music-status').textContent = 'No se pudo cargar la canción. Comprueba el nombre y formato del archivo.';
  progress.disabled = true;
  syncPlayback();
});

document.addEventListener('visibilitychange', ambientEffects);
motion.addEventListener('change', () => {
  $('particles').replaceChildren();
  ambientEffects();
});
