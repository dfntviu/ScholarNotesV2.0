/** VIEW · Tema claro / oscuro (solo aplica clases; la preferencia la guarda el Model). */
export function aplicarTema(tema, boton) {
  const oscuro = tema === 'oscuro';
  document.body.classList.toggle('modo-oscuro', oscuro);
  document.body.classList.toggle('modo-claro', !oscuro);
  document.documentElement.dataset.bsTheme = oscuro ? 'dark' : 'light'; // alertas/selects de Bootstrap
  if (boton) {
    boton.textContent = oscuro ? 'Modo claro' : 'Modo oscuro';
    boton.setAttribute('aria-pressed', String(oscuro));
  }
}
