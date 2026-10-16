/** MODEL · Preferencias de interfaz (tema claro/oscuro). */
import { leer, escribir } from './storage.js';

const CLAVE_TEMA = 'ctrl-calificaciones:tema';
export const TEMAS = Object.freeze({ CLARO: 'claro', OSCURO: 'oscuro' });

export function obtenerTema() {
  const tema = leer(CLAVE_TEMA, TEMAS.CLARO);
  return tema === TEMAS.OSCURO ? TEMAS.OSCURO : TEMAS.CLARO;
}

export function alternarTema() {
  const nuevo = obtenerTema() === TEMAS.CLARO ? TEMAS.OSCURO : TEMAS.CLARO;
  escribir(CLAVE_TEMA, nuevo);
  return nuevo;
}
