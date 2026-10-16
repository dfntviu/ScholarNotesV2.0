import {promedios} from '../eventListeners.js';   //nec. agregar los nuevos promedios, mod al hacer scope de promedios
import {countRankProm} from  '../Statistics.js';

      const bn_graph = document.getElementById('get__score');
   const canvs_proms = document.getElementById('grafico_promedios');

   /* Disp. el evento Graficar Promedios */
  bn_graph.addEventListener('click',()=>{
  		const values_prom = countRankProm(promedios);
  		graficar(values_prom);
  });
  		/** Recibir y acomodar  promedios grupal, Instanciando el modulo de Estadisticas.
  		    Con el prop. de visualizarlo en una gráfica de Barras **/

	const graficar = (data)=>{
		console.log('Iniciando la funcion');
		  		// Se Creó un objeto Chart para recibir como atributo canvas 
		const my_bar_graph = new Chart(canvs_proms.getContext('2d'),{
		   type: 'bar',
		      data: {  //categ. y/o rangos de promedios
		         labels: ['60-69', '70-79', '80-89', '90-99'],   
		         datasets: [{
		             label: 'Cantidad de Promedios',
		             data: data,    //se dinamizarán los promedios seg. correspondan
		            backgroundColor: [
		                 'rgba(255, 99, 132, 0.2)',
		                 'rgba(54, 162, 235, 0.2)',
		                 'rgba(255, 206, 86, 0.2)',
		                 'rgba(75, 192, 192, 0.2)'
		            ],
		            
		            borderColor: [
		                 'rgba(255, 99, 132, 1)',
		                 'rgba(54, 162, 235, 1)',
		                 'rgba(255, 206, 86, 1)',
		                 'rgba(75, 192, 192, 1)'
		            ],
		             borderWidth: 1
		         }]
		      },
		      options: {
		         scales: {  //cambiar por cantidad de Alumnos en dicho nivel
		            y: {
		               beginAtZero: true
		            }
		         }
		      }
		});
         console.log('Grafico de Barras culminado con éxito');
	};