 // import {Chart} from '../lib/chart.min.js';

console.log('accedi');
const ctx = document.getElementById('miGrafico').getContext('2d');
const miGrafico = new Chart(ctx, {
  type: 'bar', // Tipo de gráfico
  data: {
    labels: ['Rojo', 'Azul', 'Amarillo', 'Verde', 'Púrpura', 'Naranja'],
    datasets: [{
      label: 'Número de votos',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
 /**
  * import {Color} from './color.wrapper.js';
 import {Chart,registrables} from "../node_modules/chart.js/dist/chart.js"; 
  Chart.register(...registrables);*/
