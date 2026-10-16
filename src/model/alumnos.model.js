/**
 * MODEL · Alumnos
 * Única fuente de verdad del grupo. No conoce el DOM.
 *  - El promedio SIEMPRE se deriva de las calificaciones (nunca se guarda a mano).
 *  - Cada alumno tiene un id estable: editar/borrar no depende del índice de la fila.
 *  - El estado se persiste para que las páginas de Gráficas y Asistencia vean los mismos datos.
 */
import { leer, escribir, borrar } from './storage.js';

export const CLAVE_ALUMNOS = 'ctrl-calificaciones:alumnos:v1';
export const NUM_PARCIALES = 3;
export const CALIF_MIN = 0;
export const CALIF_MAX = 100;

const SEMILLA = [
  ['ISRAEL', 'RIVAS', [99, 96, 28]],
  ['JESUI', 'PEREZ', [87, 57, 94]],
  ['MANUEL', 'PEREZ', [87, 56, 92]],
  ['PETER', 'JIMENEZ', [87, 54, 26]],
  ['SAMUEL', 'HENRIQUEZ', [74, 26, 96]],
  ['SOFIA', 'CASTANIO', [78, 56, 35]],
  ['MANUEL', 'HENRIQUEZ', [87, 76, 71]],
  ['ARON', 'ANASTIGA', [78, 56, 31]],
  ['JAVIER', 'CARA', [61, 59, 58]],
  ['ZACK', 'RIOS', [87, 64, 26]],
  ['SALOMON', 'RODRIGUEZ', [73, 62, 62]],
  ['MARISELA', 'MONTÉZ', [69, 73, 71]],
];

let alumnos = cargar();

/* ---------- utilidades internas ---------- */

function generarId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function crearSemilla() {
  return SEMILLA.map(([nombre, apellido, calificaciones]) => ({
    id: generarId(),
    nombre,
    apellido,
    calificaciones: [...calificaciones],
  }));
}

function esRegistroValido(a) {
  return (
    a &&
    typeof a.id === 'string' &&
    typeof a.nombre === 'string' &&
    typeof a.apellido === 'string' &&
    Array.isArray(a.calificaciones) &&
    a.calificaciones.length === NUM_PARCIALES &&
    a.calificaciones.every((c) => Number.isFinite(c))
  );
}

function cargar() {
  const guardados = leer(CLAVE_ALUMNOS, null);
  if (Array.isArray(guardados) && guardados.every(esRegistroValido)) return guardados;
  const semilla = crearSemilla();
  escribir(CLAVE_ALUMNOS, semilla);
  return semilla;
}

function persistir() {
  escribir(CLAVE_ALUMNOS, alumnos);
}

/** Quita espacios sobrantes y pasa a mayúsculas (formato del registro original). */
export function normalizarTexto(texto) {
  return String(texto ?? '').trim().replace(/\s+/g, ' ').toUpperCase();
}

/** Para comparar/buscar sin que importen acentos ni mayúsculas. */
function claveComparacion(texto) {
  return normalizarTexto(texto).normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function calcularPromedio(calificaciones) {
  if (!calificaciones.length) return 0;
  const suma = calificaciones.reduce((acc, c) => acc + c, 0);
  return suma / calificaciones.length;
}

function conPromedio(a) {
  return { ...a, calificaciones: [...a.calificaciones], promedio: calcularPromedio(a.calificaciones) };
}

/* ---------- reglas de negocio ---------- */

/**
 * Valida y normaliza la entrada cruda del formulario.
 * @returns {{ ok: boolean, errores: string[], datos?: {nombre, apellido, calificaciones} }}
 */
export function validarAlumno({ nombre, apellido, calificaciones }, { excluirId = null } = {}) {
  const errores = [];
  const nombreN = normalizarTexto(nombre);
  const apellidoN = normalizarTexto(apellido);

  if (!nombreN) errores.push('El nombre es obligatorio.');
  if (!apellidoN) errores.push('El apellido es obligatorio.');

  const crudas = Array.isArray(calificaciones) ? calificaciones : [];
  const califs = crudas.map((c) => (typeof c === 'string' ? c.trim() : c)).map((c) => (c === '' ? NaN : Number(c)));

  if (califs.length !== NUM_PARCIALES) {
    errores.push(`Se requieren ${NUM_PARCIALES} calificaciones.`);
  } else {
    califs.forEach((c, i) => {
      if (!Number.isFinite(c)) errores.push(`La calificación ${i + 1} debe ser un número.`);
      else if (c < CALIF_MIN || c > CALIF_MAX)
        errores.push(`La calificación ${i + 1} debe estar entre ${CALIF_MIN} y ${CALIF_MAX}.`);
    });
  }

  if (nombreN && apellidoN) {
    const clave = `${claveComparacion(nombreN)}|${claveComparacion(apellidoN)}`;
    const duplicado = alumnos.some(
      (a) => a.id !== excluirId && `${claveComparacion(a.nombre)}|${claveComparacion(a.apellido)}` === clave
    );
    if (duplicado) errores.push(`${nombreN} ${apellidoN} ya está registrado.`);
  }

  if (errores.length) return { ok: false, errores };
  return { ok: true, errores: [], datos: { nombre: nombreN, apellido: apellidoN, calificaciones: califs } };
}

/* ---------- API pública ---------- */

export function obtenerAlumnos() {
  return alumnos.map(conPromedio);
}

export function obtenerAlumno(id) {
  const a = alumnos.find((x) => x.id === id);
  return a ? conPromedio(a) : null;
}

export function agregarAlumno(entrada) {
  const resultado = validarAlumno(entrada);
  if (!resultado.ok) return resultado;
  const nuevo = { id: generarId(), ...resultado.datos };
  alumnos.push(nuevo);
  persistir();
  return { ok: true, errores: [], alumno: conPromedio(nuevo) };
}

export function actualizarAlumno(id, entrada) {
  const indice = alumnos.findIndex((a) => a.id === id);
  if (indice === -1) return { ok: false, errores: ['El alumno ya no existe.'] };
  const resultado = validarAlumno(entrada, { excluirId: id });
  if (!resultado.ok) return resultado;
  alumnos[indice] = { id, ...resultado.datos };
  persistir();
  return { ok: true, errores: [], alumno: conPromedio(alumnos[indice]) };
}

export function eliminarAlumno(id) {
  const indice = alumnos.findIndex((a) => a.id === id);
  if (indice === -1) return null;
  const [eliminado] = alumnos.splice(indice, 1); // exactamente 1 registro
  persistir();
  return conPromedio(eliminado);
}

/** Coincidencia parcial por nombre, apellido o nombre completo; ignora acentos y mayúsculas. */
export function buscarAlumnos(texto) {
  const q = claveComparacion(texto);
  if (!q) return [];
  return alumnos
    .filter((a) => claveComparacion(`${a.nombre} ${a.apellido}`).includes(q))
    .map(conPromedio);
}

/** Relee el almacén (otra pestaña o página pudo modificarlo, p. ej. al volver con "atrás"). */
export function sincronizarAlumnos() {
  alumnos = cargar();
  return obtenerAlumnos();
}

/** Vuelve a los datos de ejemplo. */
export function restablecerAlumnos() {
  borrar(CLAVE_ALUMNOS);
  alumnos = cargar();
  return obtenerAlumnos();
}
