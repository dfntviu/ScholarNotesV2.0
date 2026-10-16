import { describe, it, expect, beforeEach } from 'vitest';
import {
  obtenerAlumnos,
  agregarAlumno,
  actualizarAlumno,
  eliminarAlumno,
  buscarAlumnos,
  restablecerAlumnos,
  calcularPromedio,
  validarAlumno,
} from '../src/model/alumnos.model.js';
import {
  promedioGrupal,
  mediana,
  mejorPromedio,
  peorPromedio,
  distribucionPorRango,
  rangoDe,
} from '../src/model/estadisticas.model.js';
import { ciclarEstado, resumenMes, obtenerEstado, ESTADO, DIAS_POR_MES, limpiarMes } from '../src/model/asistencia.model.js';

const alumno = (promedio) => ({ promedio });

describe('alumnos.model', () => {
  beforeEach(() => restablecerAlumnos());

  it('carga 12 alumnos semilla con promedio derivado de sus calificaciones', () => {
    const alumnos = obtenerAlumnos();
    expect(alumnos).toHaveLength(12);
    // antes: JESUI tenía promedio fijo 78.67, pero (87+57+94)/3 = 79.33
    const jesui = alumnos.find((a) => a.nombre === 'JESUI');
    expect(jesui.promedio).toBeCloseTo(79.333, 2);
    alumnos.forEach((a) => expect(a.promedio).toBeCloseTo(calcularPromedio(a.calificaciones), 10));
  });

  it('agrega un alumno normalizado y calcula su promedio', () => {
    const r = agregarAlumno({ nombre: '  ana  maría ', apellido: 'lópez', calificaciones: ['90', '80', '70'] });
    expect(r.ok).toBe(true);
    expect(r.alumno).toMatchObject({ nombre: 'ANA MARÍA', apellido: 'LÓPEZ', calificaciones: [90, 80, 70], promedio: 80 });
    expect(obtenerAlumnos()).toHaveLength(13);
  });

  it('rechaza vacíos, NaN, negativos y > 100 (antes solo se revisaba > 100)', () => {
    const r = agregarAlumno({ nombre: '', apellido: 'X', calificaciones: ['', 'abc', '-5'] });
    expect(r.ok).toBe(false);
    expect(r.errores).toEqual(
      expect.arrayContaining([
        'El nombre es obligatorio.',
        'La calificación 1 debe ser un número.',
        'La calificación 2 debe ser un número.',
        'La calificación 3 debe estar entre 0 y 100.',
      ])
    );
    expect(validarAlumno({ nombre: 'A', apellido: 'B', calificaciones: [101, 0, 100] }).ok).toBe(false);
    expect(validarAlumno({ nombre: 'A', apellido: 'B', calificaciones: [0, 0, 100] }).ok).toBe(true);
    expect(obtenerAlumnos()).toHaveLength(12);
  });

  it('detecta duplicados sin importar mayúsculas, espacios ni acentos', () => {
    const r = agregarAlumno({ nombre: 'marisela', apellido: ' montez ', calificaciones: [1, 2, 3] });
    expect(r.ok).toBe(false);
    expect(r.errores[0]).toMatch(/ya está registrado/);
  });

  it('elimina exactamente un registro (antes splice(i-1) borraba desde i-1 hasta el final)', () => {
    const antes = obtenerAlumnos();
    const objetivo = antes[5];
    const eliminado = eliminarAlumno(objetivo.id);
    expect(eliminado.id).toBe(objetivo.id);
    const despues = obtenerAlumnos();
    expect(despues).toHaveLength(11);
    expect(despues.map((a) => a.id)).toEqual(antes.filter((a) => a.id !== objetivo.id).map((a) => a.id));
    expect(eliminarAlumno('no-existe')).toBeNull();
  });

  it('actualiza y recalcula el promedio; guarda números, no strings', () => {
    const { id } = obtenerAlumnos()[0];
    const r = actualizarAlumno(id, { nombre: 'israel', apellido: 'rivas', calificaciones: ['100', '100', '100'] });
    expect(r.ok).toBe(true);
    expect(r.alumno.calificaciones).toEqual([100, 100, 100]);
    expect(r.alumno.promedio).toBe(100);
  });

  it('al editar no se marca a sí mismo como duplicado, pero sí choca con otro', () => {
    const [a, b] = obtenerAlumnos();
    expect(actualizarAlumno(a.id, { nombre: a.nombre, apellido: a.apellido, calificaciones: a.calificaciones }).ok).toBe(true);
    expect(actualizarAlumno(a.id, { nombre: b.nombre, apellido: b.apellido, calificaciones: a.calificaciones }).ok).toBe(false);
  });

  it('busca por coincidencia parcial en nombre o apellido', () => {
    expect(buscarAlumnos('manuel').map((a) => a.apellido).sort()).toEqual(['HENRIQUEZ', 'PEREZ']);
    expect(buscarAlumnos('henriq')).toHaveLength(2);
    expect(buscarAlumnos('montez')).toHaveLength(1);
    expect(buscarAlumnos('zzz')).toHaveLength(0);
    expect(buscarAlumnos('   ')).toHaveLength(0);
  });
});

describe('estadisticas.model', () => {
  it('tolera grupo vacío', () => {
    expect(promedioGrupal([])).toBeNull();
    expect(mediana([])).toBeNull();
    expect(mejorPromedio([])).toBeNull();
    expect(peorPromedio([])).toBeNull();
  });

  it('mediana devuelve número en n par e impar', () => {
    expect(mediana([alumno(70), alumno(90), alumno(80)])).toBe(80);
    expect(mediana([alumno(70), alumno(90), alumno(80), alumno(60)])).toBe(75);
  });

  it('clasifica bordes correctamente (antes 69.5 y los 90s caían en el rango equivocado)', () => {
    expect(rangoDe(59.99).etiqueta).toBe('0-59');
    expect(rangoDe(60).etiqueta).toBe('60-69');
    expect(rangoDe(69.5).etiqueta).toBe('60-69');
    expect(rangoDe(79.9).etiqueta).toBe('70-79');
    expect(rangoDe(89.99).etiqueta).toBe('80-89');
    expect(rangoDe(95).etiqueta).toBe('90-100');
    expect(rangoDe(100).etiqueta).toBe('90-100');
  });

  it('la distribución cuenta a todos los alumnos (antes los < 60 se ignoraban)', () => {
    restablecerAlumnos();
    const alumnos = obtenerAlumnos();
    const total = distribucionPorRango(alumnos).reduce((acc, r) => acc + r.cantidad, 0);
    expect(total).toBe(alumnos.length);
  });
});

describe('asistencia.model', () => {
  beforeEach(() => limpiarMes(1));

  it('cicla vacío → asistencia → falta → vacío', () => {
    expect(obtenerEstado(1, 'x', 0)).toBe(ESTADO.VACIO);
    expect(ciclarEstado(1, 'x', 0)).toBe(ESTADO.ASISTENCIA);
    expect(ciclarEstado(1, 'x', 0)).toBe(ESTADO.FALTA);
    expect(ciclarEstado(1, 'x', 0)).toBe(ESTADO.VACIO);
  });

  it('resume asistencias, faltas y porcentaje', () => {
    ciclarEstado(1, 'x', 0); // A
    ciclarEstado(1, 'x', 1); // A
    ciclarEstado(1, 'x', 2);
    ciclarEstado(1, 'x', 2); // F
    const [r] = resumenMes(1, [{ id: 'x', nombre: 'N', apellido: 'A' }]);
    expect(r).toMatchObject({ asistencias: 2, faltas: 1, sinRegistro: DIAS_POR_MES - 3 });
    expect(r.porcentaje).toBeCloseTo(66.67, 1);
  });

  it('rechaza mes o día fuera de rango', () => {
    expect(() => ciclarEstado(0, 'x', 0)).toThrow(RangeError);
    expect(() => ciclarEstado(1, 'x', DIAS_POR_MES)).toThrow(RangeError);
  });
});
