/**
 * MODEL · Asistencia
 * Registro por mes → alumno (id) → día de clase. Se persiste en cada cambio
 * (antes se guardaba en un arreglo en memoria que se perdía al recargar).
 */
import { leer, escribir } from './storage.js';

export const CLAVE_ASISTENCIA = 'ctrl-calificaciones:asistencia:v1';
export const TOTAL_MESES = 6;
export const SEMANAS_POR_MES = 4;
export const DIAS_SEMANA = ['L', 'Ma', 'Mi', 'J', 'V'];
export const DIAS_POR_MES = SEMANAS_POR_MES * DIAS_SEMANA.length;

export const ESTADO = Object.freeze({ VACIO: '', ASISTENCIA: 'A', FALTA: 'F' });
const CICLO = [ESTADO.VACIO, ESTADO.ASISTENCIA, ESTADO.FALTA];

let registro = leer(CLAVE_ASISTENCIA, {});
if (typeof registro !== 'object' || registro === null || Array.isArray(registro)) registro = {};

function validarMes(mes) {
  if (!Number.isInteger(mes) || mes < 1 || mes > TOTAL_MESES) throw new RangeError(`Mes fuera de rango: ${mes}`);
}

function validarDia(dia) {
  if (!Number.isInteger(dia) || dia < 0 || dia >= DIAS_POR_MES) throw new RangeError(`Día fuera de rango: ${dia}`);
}

export function obtenerEstado(mes, alumnoId, dia) {
  return registro[mes]?.[alumnoId]?.[dia] ?? ESTADO.VACIO;
}

/** vacío → asistencia → falta → vacío. Devuelve el nuevo estado. */
export function ciclarEstado(mes, alumnoId, dia) {
  validarMes(mes);
  validarDia(dia);
  const actual = obtenerEstado(mes, alumnoId, dia);
  const siguiente = CICLO[(CICLO.indexOf(actual) + 1) % CICLO.length];

  registro[mes] ??= {};
  registro[mes][alumnoId] ??= {};
  if (siguiente === ESTADO.VACIO) delete registro[mes][alumnoId][dia];
  else registro[mes][alumnoId][dia] = siguiente;

  escribir(CLAVE_ASISTENCIA, registro);
  return siguiente;
}

export function resumenMes(mes, alumnos) {
  validarMes(mes);
  return alumnos.map((a) => {
    const dias = Object.values(registro[mes]?.[a.id] ?? {});
    const asistencias = dias.filter((e) => e === ESTADO.ASISTENCIA).length;
    const faltas = dias.filter((e) => e === ESTADO.FALTA).length;
    const registrados = asistencias + faltas;
    return {
      id: a.id,
      nombre: a.nombre,
      apellido: a.apellido,
      asistencias,
      faltas,
      sinRegistro: DIAS_POR_MES - registrados,
      porcentaje: registrados ? (asistencias / registrados) * 100 : null,
    };
  });
}

export function limpiarMes(mes) {
  validarMes(mes);
  delete registro[mes];
  escribir(CLAVE_ASISTENCIA, registro);
}
