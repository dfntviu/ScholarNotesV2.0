/** CONTROLLER · Asistencia */
import { sincronizarAlumnos, CLAVE_ALUMNOS } from '../model/alumnos.model.js';
import { TOTAL_MESES, obtenerEstado, ciclarEstado, resumenMes, limpiarMes } from '../model/asistencia.model.js';
import { obtener } from '../view/dom.js';
import { renderSelectorMes, renderTablaAsistencia, pintarCelda, renderResumen } from '../view/asistencia.view.js';
import { mostrarMensaje } from '../view/feedback.view.js';

export function iniciarAsistenciaController() {
  const ui = {
    selectMes: obtener('mes'),
    titulo: obtener('Title'),
    tabla: obtener('tabla-asistencia'),
    btnResumen: obtener('mostrar-asistencia'),
    btnLimpiar: obtener('limpiar-asistencia'),
    panelResumen: obtener('panel-resumen'),
    tablaResumen: obtener('tab-resultado'),
    feedback: obtener('asistencia-feedback'),
  };

  let mes = 1;
  let alumnos = sincronizarAlumnos();

  function pintarTabla() {
    ui.titulo.textContent = `Control de asistencia · Mes ${mes}`;
    renderTablaAsistencia(ui.tabla, alumnos, (alumnoId, dia) => obtenerEstado(mes, alumnoId, dia));
    if (!ui.panelResumen.hidden) renderResumen(ui.tablaResumen, resumenMes(mes, alumnos));
  }

  renderSelectorMes(ui.selectMes, TOTAL_MESES, mes);

  ui.selectMes.addEventListener('change', () => {
    mes = Number(ui.selectMes.value);
    pintarTabla();
  });

  ui.tabla.addEventListener('click', (e) => {
    const celda = e.target.closest('td.celda-dia');
    if (!celda) return; // las columnas de nombre/apellido ya no se marcan
    const { alumno: alumnoId } = celda.dataset;
    const dia = Number(celda.dataset.dia);
    const alumno = alumnos.find((a) => a.id === alumnoId);
    pintarCelda(celda, ciclarEstado(mes, alumnoId, dia), alumno, dia);
    if (!ui.panelResumen.hidden) renderResumen(ui.tablaResumen, resumenMes(mes, alumnos));
  });

  ui.btnResumen.addEventListener('click', () => {
    ui.panelResumen.hidden = !ui.panelResumen.hidden;
    ui.btnResumen.textContent = ui.panelResumen.hidden ? 'Ver resumen' : 'Ocultar resumen';
    if (!ui.panelResumen.hidden) renderResumen(ui.tablaResumen, resumenMes(mes, alumnos));
  });

  ui.btnLimpiar.addEventListener('click', () => {
    if (!window.confirm(`¿Borrar toda la asistencia del mes ${mes}?`)) return;
    limpiarMes(mes);
    pintarTabla();
    mostrarMensaje(ui.feedback, `Asistencia del mes ${mes} borrada.`, 'info');
  });

  const recargar = () => {
    alumnos = sincronizarAlumnos();
    pintarTabla();
  };
  window.addEventListener('pageshow', (e) => e.persisted && recargar());
  window.addEventListener('storage', (e) => e.key === CLAVE_ALUMNOS && recargar());

  pintarTabla();
}
