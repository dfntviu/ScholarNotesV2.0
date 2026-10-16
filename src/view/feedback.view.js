/** VIEW · Mensajes al usuario (región aria-live). Antes los errores solo iban a la consola. */
import { el } from './dom.js';

const temporizadores = new WeakMap();

export function mostrarMensaje(contenedor, mensajes, tipo = 'info', { duracion = 4500 } = {}) {
  const lista = Array.isArray(mensajes) ? mensajes : [mensajes];
  clearTimeout(temporizadores.get(contenedor));

  contenedor.replaceChildren(
    el('div', { clase: `alert alert-${tipo} mb-0`, attrs: { role: tipo === 'danger' ? 'alert' : 'status' } },
      lista.length === 1 ? [document.createTextNode(lista[0])] : [el('ul', { clase: 'mb-0' }, lista.map((m) => el('li', { texto: m })))]
    )
  );

  if (duracion) temporizadores.set(contenedor, setTimeout(() => contenedor.replaceChildren(), duracion));
}
