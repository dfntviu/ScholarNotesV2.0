/**
 * VIEW · Gráfica de distribución de promedios.
 * Reutiliza la instancia: antes cada clic hacía `new Chart` sobre el mismo canvas
 * y Chart.js lanzaba "Canvas is already in use".
 */
import Chart from 'chart.js/auto';

const COLORES = [
  ['rgba(220, 53, 69, 0.35)', 'rgb(220, 53, 69)'],
  ['rgba(255, 159, 64, 0.35)', 'rgb(255, 159, 64)'],
  ['rgba(255, 205, 86, 0.35)', 'rgb(214, 170, 40)'],
  ['rgba(54, 162, 235, 0.35)', 'rgb(54, 162, 235)'],
  ['rgba(75, 192, 192, 0.35)', 'rgb(40, 160, 160)'],
];

let grafica = null;

/** Colores de ejes/leyenda tomados de los tokens CSS del tema activo. */
function coloresTema() {
  const css = getComputedStyle(document.body);
  return { texto: css.getPropertyValue('--text').trim() || '#1b1b1b', rejilla: css.getPropertyValue('--border').trim() || '#ddd' };
}

function aplicarColores(g) {
  const { texto, rejilla } = coloresTema();
  g.options.color = texto;
  ['x', 'y'].forEach((eje) => {
    g.options.scales[eje].ticks.color = texto;
    g.options.scales[eje].title.color = texto;
    g.options.scales[eje].grid.color = rejilla;
  });
}

export function renderGrafica(canvas, distribucion) {
  const etiquetas = distribucion.map((r) => r.etiqueta);
  const datos = distribucion.map((r) => r.cantidad); // Chart.js necesita un arreglo, no un objeto

  if (grafica) {
    grafica.data.labels = etiquetas;
    grafica.data.datasets[0].data = datos;
    aplicarColores(grafica);
    grafica.update();
    return grafica;
  }

  grafica = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [
        {
          label: 'Alumnos por rango de promedio',
          data: datos,
          backgroundColor: COLORES.map((c) => c[0]),
          borderColor: COLORES.map((c) => c[1]),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 }, grid: {}, title: { display: true, text: 'Alumnos' } },
        x: { ticks: {}, grid: {}, title: { display: true, text: 'Rango de promedio' } },
      },
    },
  });
  aplicarColores(grafica);
  grafica.update();
  return grafica;
}
