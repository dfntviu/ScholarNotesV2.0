/**
 * MODEL · Persistencia
 * Envoltorio seguro sobre localStorage. Si el navegador lo bloquea (modo privado,
 * cuota llena, entorno sin DOM) la app sigue funcionando con estado en memoria.
 */
export function leer(clave, porDefecto) {
  try {
    const crudo = globalThis.localStorage?.getItem(clave);
    return crudo ? JSON.parse(crudo) : porDefecto;
  } catch {
    return porDefecto;
  }
}

export function escribir(clave, valor) {
  try {
    globalThis.localStorage?.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function borrar(clave) {
  try {
    globalThis.localStorage?.removeItem(clave);
  } catch {
    /* sin almacenamiento disponible: no hay nada que borrar */
  }
}
