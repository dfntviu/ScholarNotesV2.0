/** VIEW · Utilidades de DOM compartidas por las vistas. */

/** Crea un elemento. Todo el texto entra por textContent (sin riesgo de inyección HTML). */
export function el(tag, { clase, texto, attrs, dataset } = {}, hijos = []) {
  const nodo = document.createElement(tag);
  if (clase) nodo.className = clase;
  if (texto !== undefined && texto !== null) nodo.textContent = String(texto);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => nodo.setAttribute(k, v));
  if (dataset) Object.assign(nodo.dataset, dataset);
  hijos.forEach((h) => h && nodo.append(h));
  return nodo;
}

export function formatear(numero, decimales = 2) {
  return numero === null || numero === undefined || Number.isNaN(numero) ? '—' : Number(numero).toFixed(decimales);
}

export function obtener(id) {
  const nodo = document.getElementById(id);
  if (!nodo) throw new Error(`No se encontró el elemento #${id} en la página.`);
  return nodo;
}
