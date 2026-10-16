/**
 * VIEW · Lista de asistencia.
 * Antes: 120 columnas (6 meses en una sola fila de cabecera), <td> anidados dentro de <td>,
 * colores invertidos y la tabla de resultados oculta dentro del contenedor que se escondía.
 */
import { el, formatear } from './dom.js';
import { DIAS_SEMANA, SEMANAS_POR_MES, ESTADO } from '../model/asistencia.model.js';

const CLASE = { [ESTADO.ASISTENCIA]: 'mrc-asistencia', [ESTADO.FALTA]: 'mrc-falta', [ESTADO.VACIO]: '' };
const TEXTO = { [ESTADO.ASISTENCIA]: '✓', [ESTADO.FALTA]: '✗', [ESTADO.VACIO]: '' };
const ETIQUETA = { [ESTADO.ASISTENCIA]: 'asistencia', [ESTADO.FALTA]: 'falta', [ESTADO.VACIO]: 'sin registro' };

export function renderSelectorMes(select, totalMeses, mesActual) {
  select.replaceChildren(
    ...Array.from({ length: totalMeses }, (_, i) => {
      const opcion = el('option', { texto: `Mes ${i + 1}`, attrs: { value: i + 1 } });
      if (i + 1 === mesActual) opcion.selected = true;
      return opcion;
    })
  );
}

export function renderTablaAsistencia(tabla, alumnos, obtenerEstado) {
  const filaSemanas = el('tr', {}, [el('th', { attrs: { rowspan: 2, scope: 'col' }, texto: 'Nombre' }), el('th', { attrs: { rowspan: 2, scope: 'col' }, texto: 'Apellido' })]);
  const filaDias = el('tr');
  for (let s = 0; s < SEMANAS_POR_MES; s++) {
    filaSemanas.append(el('th', { attrs: { colspan: DIAS_SEMANA.length, scope: 'colgroup' }, texto: `Semana ${s + 1}`, clase: 'semana' }));
    DIAS_SEMANA.forEach((d) => filaDias.append(el('th', { texto: d, attrs: { scope: 'col' }, clase: 'dia' })));
  }

  const tbody = el('tbody');
  if (!alumnos.length) {
    tbody.append(el('tr', {}, [el('td', { texto: 'No hay alumnos registrados.', attrs: { colspan: 2 + SEMANAS_POR_MES * DIAS_SEMANA.length }, clase: 'vacio' })]));
  }
  alumnos.forEach((a) => {
    const fila = el('tr', {}, [el('th', { texto: a.nombre, attrs: { scope: 'row' } }), el('td', { texto: a.apellido })]);
    for (let dia = 0; dia < SEMANAS_POR_MES * DIAS_SEMANA.length; dia++) {
      const celda = el('td', { clase: 'celda-dia', dataset: { alumno: a.id, dia } }, [
        el('button', { attrs: { type: 'button' }, clase: 'btn-dia' }),
      ]);
      pintarCelda(celda, obtenerEstado(a.id, dia), a, dia);
      fila.append(celda);
    }
    tbody.append(fila);
  });

  tabla.replaceChildren(el('thead', {}, [filaSemanas, filaDias]), tbody);
}

export function pintarCelda(celda, estado, alumno, dia) {
  celda.classList.remove('mrc-asistencia', 'mrc-falta');
  if (CLASE[estado]) celda.classList.add(CLASE[estado]);
  const boton = celda.querySelector('button');
  boton.textContent = TEXTO[estado];
  const semana = Math.floor(dia / DIAS_SEMANA.length) + 1;
  const nombreDia = DIAS_SEMANA[dia % DIAS_SEMANA.length];
  boton.setAttribute('aria-label', `${alumno.nombre} ${alumno.apellido}, semana ${semana} ${nombreDia}: ${ETIQUETA[estado]}`);
}

export function renderResumen(tabla, resumen) {
  const thead = el('thead', {}, [
    el('tr', {}, ['Nombre', 'Apellido', 'Asistencias', 'Faltas', 'Sin registro', '% asistencia'].map((t) => el('th', { texto: t }))),
  ]);
  const tbody = el(
    'tbody',
    {},
    resumen.map((r) =>
      el('tr', {}, [
        el('td', { texto: r.nombre }),
        el('td', { texto: r.apellido }),
        el('td', { texto: r.asistencias, clase: 'num' }),
        el('td', { texto: r.faltas, clase: 'num' }),
        el('td', { texto: r.sinRegistro, clase: 'num' }),
        el('td', { texto: r.porcentaje === null ? '—' : `${formatear(r.porcentaje, 1)} %`, clase: 'num' }),
      ])
    )
  );
  tabla.replaceChildren(thead, tbody);
}
