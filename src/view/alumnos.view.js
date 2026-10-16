/**
 * VIEW · Alumnos
 * Pinta tablas y resultados. No modifica datos: expone data-accion/data-id
 * para que el Controller decida qué hacer (delegación de eventos).
 */
import { el, formatear } from './dom.js';
import { CALIF_MIN, CALIF_MAX } from '../model/alumnos.model.js';

function botonAccion(texto, accion, id, clase) {
  return el('button', { clase: `btn btn-sm ${clase}`, texto, attrs: { type: 'button' }, dataset: { accion, id } });
}

function inputEdicion(valor, campo, etiqueta, esNumero = false) {
  const attrs = { 'aria-label': etiqueta, 'data-campo': campo };
  if (esNumero) Object.assign(attrs, { type: 'number', min: CALIF_MIN, max: CALIF_MAX, step: 'any', inputmode: 'decimal' });
  else attrs.type = 'text';
  const input = el('input', { clase: 'input-celda', attrs });
  input.value = valor;
  return input;
}

/** Tabla principal (historial). Si editandoId coincide, la fila se pinta en modo edición. */
export function renderTablaAlumnos(tbody, alumnos, { editandoId = null } = {}) {
  tbody.replaceChildren();

  if (!alumnos.length) {
    tbody.append(el('tr', {}, [el('td', { texto: 'No hay alumnos registrados.', attrs: { colspan: 7 }, clase: 'vacio' })]));
    return;
  }

  alumnos.forEach((a) => {
    const fila = el('tr', { dataset: { id: a.id } });

    if (a.id === editandoId) {
      fila.classList.add('editando');
      fila.append(
        el('td', {}, [inputEdicion(a.nombre, 'nombre', 'Nombre')]),
        el('td', {}, [inputEdicion(a.apellido, 'apellido', 'Apellido')]),
        ...a.calificaciones.map((c, i) => el('td', {}, [inputEdicion(c, `calif${i}`, `Examen ${i + 1}`, true)])),
        el('td', {}, [botonAccion('Guardar', 'guardar', a.id, 'btn-success')]),
        el('td', {}, [botonAccion('Cancelar', 'cancelar', a.id, 'btn-secondary')])
      );
    } else {
      fila.append(
        el('td', { texto: a.nombre }),
        el('td', { texto: a.apellido }),
        ...a.calificaciones.map((c) => el('td', { texto: c })),
        el('td', {}, [botonAccion('Editar', 'editar', a.id, 'btn-warning')]),
        el('td', {}, [botonAccion('Borrar', 'borrar', a.id, 'btn-danger')])
      );
    }
    tbody.append(fila);
  });
}

/** Lee los valores crudos de la fila en edición (la validación la hace el Model). */
export function leerFilaEdicion(tbody, id) {
  const fila = tbody.querySelector(`tr[data-id="${CSS.escape(id)}"]`);
  if (!fila) return null;
  const valor = (campo) => fila.querySelector(`[data-campo="${campo}"]`)?.value ?? '';
  return {
    nombre: valor('nombre'),
    apellido: valor('apellido'),
    calificaciones: [valor('calif0'), valor('calif1'), valor('calif2')],
  };
}

export function enfocarFilaEdicion(tbody, id) {
  tbody.querySelector(`tr[data-id="${CSS.escape(id)}"] input`)?.focus();
}

/** Bloque "Mostrar Calificaciones": lista por alumno + resumen del grupo (antes solo iba a consola). */
export function renderResultados(contenedor, alumnos, resumen) {
  contenedor.replaceChildren();

  const lista = el('div', { clase: 'resultados-lista' });
  lista.append(
    el('div', { clase: 'fila fila-cabecera' }, [
      el('div', { texto: 'Nombre' }),
      el('div', { texto: 'Apellido' }),
      el('div', { texto: 'Calificaciones' }),
      el('div', { texto: 'Promedio' }),
    ])
  );
  alumnos.forEach((a) =>
    lista.append(
      el('div', { clase: 'fila' }, [
        el('div', { texto: a.nombre }),
        el('div', { texto: a.apellido }),
        el('div', { texto: a.calificaciones.join(', ') }),
        el('div', { texto: formatear(a.promedio) }),
      ])
    )
  );

  const tarjetas = el('div', { clase: 'resumen-grupo' }, [
    tarjeta('Promedio grupal', formatear(resumen.promedioGrupal)),
    tarjeta('Mediana', formatear(resumen.mediana)),
    tarjeta(
      'Promedio más alto',
      resumen.mejor ? `${formatear(resumen.mejor.promedio)} · ${resumen.mejor.nombre} ${resumen.mejor.apellido}` : '—'
    ),
    tarjeta(
      'Promedio más bajo',
      resumen.peor ? `${formatear(resumen.peor.promedio)} · ${resumen.peor.nombre} ${resumen.peor.apellido}` : '—'
    ),
  ]);

  contenedor.append(tarjetas, lista);
}

function tarjeta(titulo, valor) {
  return el('div', { clase: 'tarjeta' }, [el('span', { clase: 'tarjeta-titulo', texto: titulo }), el('strong', { texto: valor })]);
}

/** Tabla de estadísticas: promedio por alumno + distribución por rango. */
export function renderEstadisticas(tbody, contenedorRangos, alumnos, distribucion) {
  tbody.replaceChildren();
  if (!alumnos.length) {
    tbody.append(el('tr', {}, [el('td', { texto: 'Sin datos.', attrs: { colspan: 3 }, clase: 'vacio' })]));
  }
  alumnos.forEach((a) =>
    tbody.append(
      el('tr', {}, [el('td', { texto: a.nombre }), el('td', { texto: a.apellido }), el('td', { texto: formatear(a.promedio) })])
    )
  );

  contenedorRangos.replaceChildren(
    el('p', { clase: 'rangos-titulo', texto: `Total de alumnos: ${alumnos.length}` }),
    el(
      'ul',
      { clase: 'rangos' },
      distribucion.map((r) => el('li', {}, [el('span', { texto: r.etiqueta }), el('strong', { texto: r.cantidad })]))
    )
  );
}

export function renderBusqueda(contenedor, texto, resultados) {
  contenedor.replaceChildren();
  if (!texto.trim()) {
    contenedor.append(el('p', { clase: 'advice', texto: 'Escribe un nombre o apellido para buscar.' }));
    return;
  }
  if (!resultados.length) {
    contenedor.append(el('p', { clase: 'advice', texto: `No se encontró ningún alumno con “${texto.trim()}”.` }));
    return;
  }
  contenedor.append(
    el('p', { clase: 'advice', texto: `${resultados.length} resultado(s) para “${texto.trim()}”:` }),
    ...resultados.map((a) =>
      el('div', { clase: 'alum_bus' }, [
        el('div', { clase: 'nm_enc-1', texto: a.nombre }),
        el('div', { clase: 'nm_enc-2', texto: a.apellido }),
        el('div', { clase: 'nm_enc-3', texto: formatear(a.promedio) }),
      ])
    )
  );
}
