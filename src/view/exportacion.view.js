/**
 * VIEW · Salidas del concentrado (TXT, PDF, impresión).
 * Se generan desde los datos del Model, no raspando la tabla del DOM
 * (antes se colaban las columnas Editar/Borrar y la impresión salía vacía).
 */
import { formatear } from './dom.js';

const CABECERAS = ['Nombre', 'Apellido', 'Examen 1', 'Examen 2', 'Examen 3', 'Promedio'];

function filas(alumnos) {
  return alumnos.map((a) => [a.nombre, a.apellido, ...a.calificaciones.map(String), formatear(a.promedio)]);
}

function fechaHoy() {
  return new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Un solo archivo (antes se disparaba una descarga por cada alumno dentro del bucle). */
export function descargarTXT(alumnos, nombreArchivo = 'G01_calificaciones.txt') {
  const lineas = [CABECERAS.join('\t'), ...filas(alumnos).map((f) => f.join('\t'))];
  const blob = new Blob([lineas.join('\n') + '\n'], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const enlace = Object.assign(document.createElement('a'), { href: url, download: nombreArchivo });
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** jsPDF pesa ~400 KB: se descarga solo cuando el usuario pide el PDF. */
export async function crearPDF(alumnos, titulo = 'Concentrado de calificaciones · Grupo 01') {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(titulo, 14, 18); // firma correcta: text(texto, x, y)
  doc.setFontSize(10);
  doc.text(fechaHoy(), 14, 25);
  autoTable(doc, {
    startY: 30,
    head: [CABECERAS],
    body: filas(alumnos),
    headStyles: { fillColor: [0, 123, 255] },
  });
  return doc;
}

export async function descargarPDF(alumnos, nombreArchivo = 'concentrado-calificaciones.pdf') {
  (await crearPDF(alumnos)).save(nombreArchivo);
}

function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** @returns {boolean} false si el navegador bloqueó la ventana emergente. */
export function imprimir(alumnos) {
  const ventana = window.open('', 'impresion-concentrado', 'width=800,height=600');
  if (!ventana) return false;

  const thead = `<tr>${CABECERAS.map((c) => `<th>${c}</th>`).join('')}</tr>`;
  const tbody = filas(alumnos)
    .map((f) => `<tr>${f.map((c) => `<td>${escaparHTML(c)}</td>`).join('')}</tr>`)
    .join('');

  ventana.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8">
    <title>Impresión de calificaciones</title>
    <style>
      body{font-family:Arial,sans-serif;margin:24px;color:#111}
      h1{font-size:18px;margin:0 0 4px} p{margin:0 0 16px;color:#555;font-size:12px}
      table{width:100%;border-collapse:collapse;font-size:13px}
      th,td{border:1px solid #bbb;padding:6px 8px;text-align:left}
      th{background:#007bff;color:#fff} tr:nth-child(even) td{background:#f4f4f4}
      @media print{th{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
    </style></head><body>
    <h1>Concentrado de calificaciones · Grupo 01</h1><p>${escaparHTML(fechaHoy())}</p>
    <table><thead>${thead}</thead><tbody>${tbody}</tbody></table></body></html>`);
  ventana.document.close();
  ventana.addEventListener('afterprint', () => ventana.close());
  ventana.focus();
  ventana.print();
  return true;
}
