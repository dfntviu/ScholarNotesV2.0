/**
 * CONTROLLER · Tema
 * Antes el listener del botón se registraba dentro de un DOMContentLoaded que
 * ya había ocurrido, así que el botón nunca respondía; y el modo guardado no se aplicaba.
 */
import { obtenerTema, alternarTema } from '../model/preferencias.model.js';
import { aplicarTema } from '../view/tema.view.js';

export function iniciarTemaController() {
  const boton = document.querySelector('.change-mode');
  aplicarTema(obtenerTema(), boton);
  boton?.addEventListener('click', () => {
    const tema = alternarTema();
    aplicarTema(tema, boton);
    document.dispatchEvent(new CustomEvent('tema:cambiado', { detail: { tema } })); // p. ej. la gráfica se repinta
  });
}
