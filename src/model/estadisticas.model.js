/**
 * MODEL · Estadísticas
 * Funciones puras: reciben la lista de alumnos (con promedio) y devuelven datos.
 * Todas toleran el grupo vacío (antes: Math.max([]) = -Infinity y promedio = NaN).
 */

/** Rangos semiabiertos [min, max); el último incluye el 100. */
export const RANGOS = [
  { min: 0, max: 60, etiqueta: '0-59' },
  { min: 60, max: 70, etiqueta: '60-69' },
  { min: 70, max: 80, etiqueta: '70-79' },
  { min: 80, max: 90, etiqueta: '80-89' },
  { min: 90, max: 100, etiqueta: '90-100', incluyeMax: true },
];

export function promedioGrupal(alumnos) {
  if (!alumnos.length) return null;
  return alumnos.reduce((acc, a) => acc + a.promedio, 0) / alumnos.length;
}

export function mejorPromedio(alumnos) {
  if (!alumnos.length) return null;
  return alumnos.reduce((mejor, a) => (a.promedio > mejor.promedio ? a : mejor));
}

export function peorPromedio(alumnos) {
  if (!alumnos.length) return null;
  return alumnos.reduce((peor, a) => (a.promedio < peor.promedio ? a : peor));
}

export function promediosOrdenados(alumnos) {
  return alumnos.map((a) => a.promedio).sort((x, y) => x - y);
}

/** Mediana numérica (antes devolvía string en n impar y number en n par). */
export function mediana(alumnos) {
  const orden = promediosOrdenados(alumnos);
  const n = orden.length;
  if (!n) return null;
  const mitad = Math.floor(n / 2);
  return n % 2 === 1 ? orden[mitad] : (orden[mitad - 1] + orden[mitad]) / 2;
}

export function rangoDe(promedio) {
  return RANGOS.find((r) => promedio >= r.min && (promedio < r.max || (r.incluyeMax && promedio <= r.max))) ?? null;
}

/** Conteo por rango, en el mismo orden que RANGOS. */
export function distribucionPorRango(alumnos) {
  const conteo = RANGOS.map((r) => ({ etiqueta: r.etiqueta, cantidad: 0 }));
  alumnos.forEach((a) => {
    const i = RANGOS.indexOf(rangoDe(a.promedio));
    if (i !== -1) conteo[i].cantidad++;
  });
  return conteo;
}

export function resumenGrupo(alumnos) {
  return {
    total: alumnos.length,
    promedioGrupal: promedioGrupal(alumnos),
    mejor: mejorPromedio(alumnos),
    peor: peorPromedio(alumnos),
    mediana: mediana(alumnos),
    distribucion: distribucionPorRango(alumnos),
  };
}
