/**
 * CONTROLLER · Alumnos
 * Orquesta: escucha eventos de la View, llama al Model y vuelve a pintar.
 * No guarda datos propios ni contiene reglas de negocio (validación, promedios,
 * duplicados → Model). Su único estado es de interfaz: qué fila se edita y qué
 * paneles están visibles.
 */
import {
  obtenerAlumnos,
  agregarAlumno,
  actualizarAlumno,
  eliminarAlumno,
  obtenerAlumno,
  buscarAlumnos,
  restablecerAlumnos,
  sincronizarAlumnos,
  CLAVE_ALUMNOS,
} from '../model/alumnos.model.js';
import { resumenGrupo } from '../model/estadisticas.model.js';
import { obtener } from '../view/dom.js';
import {
  renderTablaAlumnos,
  leerFilaEdicion,
  enfocarFilaEdicion,
  renderResultados,
  renderEstadisticas,
  renderBusqueda,
} from '../view/alumnos.view.js';
import { mostrarMensaje } from '../view/feedback.view.js';
import { descargarTXT, descargarPDF, imprimir } from '../view/exportacion.view.js';

export function iniciarAlumnosController() {
  const ui = {
    form: obtener('estudiante_form'),
    feedback: obtener('form-feedback'),
    tbody: obtener('content__alumn-table'),
    btnMostrar: obtener('all_calif'),
    resultados: obtener('contenedor_calif'),
    btnEstadisticas: obtener('terminar'),
    tbodyEstadisticas: obtener('estadist_alumnos').tBodies[0],
    rangos: obtener('rangos_promedio'),
    inputBusqueda: obtener('tec__alumno'),
    btnBuscar: obtener('buscar--alum'),
    busqueda: obtener('container_search'),
    btnTxt: obtener('desc__calific'),
    btnPdf: obtener('desc__calif_Pdf'),
    btnImprimir: obtener('alums__pdfprint'),
    btnRestablecer: obtener('restablecer'),
    feedbackAcciones: obtener('acciones-feedback'),
  };

  const estadoUI = { editandoId: null, verResultados: false, verEstadisticas: false };

  function refrescar() {
    const alumnos = obtenerAlumnos();
    renderTablaAlumnos(ui.tbody, alumnos, { editandoId: estadoUI.editandoId });
    const resumen = resumenGrupo(alumnos);
    if (estadoUI.verResultados) renderResultados(ui.resultados, alumnos, resumen);
    if (estadoUI.verEstadisticas) renderEstadisticas(ui.tbodyEstadisticas, ui.rangos, alumnos, resumen.distribucion);
    if (ui.inputBusqueda.value.trim()) renderBusqueda(ui.busqueda, ui.inputBusqueda.value, buscarAlumnos(ui.inputBusqueda.value));
  }

  function hayAlumnos() {
    if (obtenerAlumnos().length) return true;
    mostrarMensaje(ui.feedbackAcciones, 'No hay alumnos para exportar.', 'warning');
    return false;
  }

  /* ---- Alta ---- */
  ui.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(ui.form);
    const resultado = agregarAlumno({
      nombre: fd.get('nombre'),
      apellido: fd.get('apellido'),
      calificaciones: [fd.get('calif1'), fd.get('calif2'), fd.get('calif3')],
    });

    if (!resultado.ok) {
      mostrarMensaje(ui.feedback, resultado.errores, 'danger', { duracion: 0 });
      return;
    }
    ui.form.reset();
    ui.form.elements.nombre.focus();
    mostrarMensaje(ui.feedback, `Alumno agregado: ${resultado.alumno.nombre} ${resultado.alumno.apellido}.`, 'success');
    refrescar();
  });

  /* ---- Edición / borrado (delegación sobre la tabla) ---- */
  function guardarEdicion(id) {
    const resultado = actualizarAlumno(id, leerFilaEdicion(ui.tbody, id));
    if (!resultado.ok) {
      mostrarMensaje(ui.feedback, resultado.errores, 'danger', { duracion: 0 });
      return;
    }
    estadoUI.editandoId = null;
    mostrarMensaje(ui.feedback, `Cambios guardados para ${resultado.alumno.nombre} ${resultado.alumno.apellido}.`, 'success');
    refrescar();
  }

  function cancelarEdicion() {
    estadoUI.editandoId = null;
    refrescar();
  }

  ui.tbody.addEventListener('click', (e) => {
    const boton = e.target.closest('button[data-accion]');
    if (!boton) return;
    const { accion, id } = boton.dataset;

    if (accion === 'editar') {
      estadoUI.editandoId = id;
      refrescar();
      enfocarFilaEdicion(ui.tbody, id);
    } else if (accion === 'guardar') {
      guardarEdicion(id);
    } else if (accion === 'cancelar') {
      cancelarEdicion();
    } else if (accion === 'borrar') {
      const alumno = obtenerAlumno(id);
      if (!alumno || !window.confirm(`¿Borrar a ${alumno.nombre} ${alumno.apellido}?`)) return;
      eliminarAlumno(id);
      if (estadoUI.editandoId === id) estadoUI.editandoId = null;
      mostrarMensaje(ui.feedback, `Se eliminó a ${alumno.nombre} ${alumno.apellido}.`, 'info');
      refrescar();
    }
  });

  ui.tbody.addEventListener('keydown', (e) => {
    if (!estadoUI.editandoId || e.target.tagName !== 'INPUT') return;
    if (e.key === 'Enter') {
      e.preventDefault();
      guardarEdicion(estadoUI.editandoId);
    } else if (e.key === 'Escape') {
      cancelarEdicion();
    }
  });

  /* ---- Paneles de resultados ---- */
  ui.btnMostrar.addEventListener('click', () => {
    estadoUI.verResultados = true;
    refrescar();
    ui.resultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  ui.btnEstadisticas.addEventListener('click', () => {
    estadoUI.verEstadisticas = true;
    refrescar();
  });

  /* ---- Búsqueda ---- */
  function buscar() {
    const texto = ui.inputBusqueda.value;
    renderBusqueda(ui.busqueda, texto, buscarAlumnos(texto));
  }
  ui.btnBuscar.addEventListener('click', buscar);
  ui.inputBusqueda.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buscar();
    }
  });

  /* ---- Exportación ---- */
  ui.btnTxt.addEventListener('click', () => hayAlumnos() && descargarTXT(obtenerAlumnos()));
  ui.btnPdf.addEventListener('click', async () => {
    if (!hayAlumnos()) return;
    ui.btnPdf.disabled = true;
    try {
      await descargarPDF(obtenerAlumnos());
    } catch (error) {
      console.error(error);
      mostrarMensaje(ui.feedbackAcciones, 'No se pudo generar el PDF. Intenta de nuevo.', 'danger');
    } finally {
      ui.btnPdf.disabled = false;
    }
  });
  ui.btnImprimir.addEventListener('click', () => {
    if (!hayAlumnos()) return;
    if (!imprimir(obtenerAlumnos())) {
      mostrarMensaje(ui.feedbackAcciones, 'El navegador bloqueó la ventana de impresión. Permite ventanas emergentes para este sitio.', 'warning', { duracion: 0 });
    }
  });

  ui.btnRestablecer.addEventListener('click', () => {
    if (!window.confirm('Esto reemplaza todos los registros por los datos de ejemplo. ¿Continuar?')) return;
    restablecerAlumnos();
    estadoUI.editandoId = null;
    mostrarMensaje(ui.feedbackAcciones, 'Datos de ejemplo restablecidos.', 'info');
    refrescar();
  });

  const recargar = () => {
    sincronizarAlumnos();
    estadoUI.editandoId = null;
    refrescar();
  };
  window.addEventListener('pageshow', (e) => e.persisted && recargar());
  window.addEventListener('storage', (e) => e.key === CLAVE_ALUMNOS && recargar());

  refrescar();
}
