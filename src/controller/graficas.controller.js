/** CONTROLLER · Gráficas */
import { obtenerAlumnos, sincronizarAlumnos, CLAVE_ALUMNOS } from '../model/alumnos.model.js';
import { distribucionPorRango } from '../model/estadisticas.model.js';
import { obtener } from '../view/dom.js';
import { renderGrafica } from '../view/graficas.view.js';

export function iniciarGraficasController() {
  const canvas = obtener('grafico_promedios');
  const boton = obtener('get__score');
  const total = obtener('total_alumnos');

  const dibujar = () => {
    const alumnos = obtenerAlumnos(); // se relee: refleja altas/bajas hechas en la página principal
    total.textContent = `Alumnos considerados: ${alumnos.length}`;
    renderGrafica(canvas, distribucionPorRango(alumnos));
  };

  boton.addEventListener('click', dibujar);
  // Vuelta con el botón "atrás" (bfcache) o cambios hechos en otra pestaña
  window.addEventListener('pageshow', (e) => e.persisted && (sincronizarAlumnos(), dibujar()));
  window.addEventListener('storage', (e) => e.key === CLAVE_ALUMNOS && (sincronizarAlumnos(), dibujar()));
  document.addEventListener('tema:cambiado', dibujar);
  dibujar();
}
