import { busquedaAlumno } from './alumns.js';
import {nombres,apellidos,calificaciones} from './eventListeners.js';
import {calc_promedioGrupal,promedioMayorInd,promedioMenorInd,calificacionesOrd,medianaGrupo} from './Statistics.js';

  let txt_archivo;
   export const guardarCalificaciones =(descripcion,nombre)=>{
   			             	const anc_des = document.createElement('a');
					       txt_archivo = new Blob([descripcion], {type: 'text/plain'});

							const ruta = URL.createObjectURL(txt_archivo);

							anc_des.href = ruta;
							anc_des.download = nombre;
							anc_des.click();
			    }

	  // Mostrar los resultados individuales y grupales del alumno y grupo (calificación parcial) [btn_calificaciones]
export function mostrarResultadosAlumnos(){
			let contenedor_calif = document.getElementById('contenedor_calif');
			contenedor_calif.innerHTML = '';

			for (let i = 0; i < nombres.length; i++) {
				const fila = document.createElement('div');
				fila.classList.add('fila');
					// Muest.  calificaciones en el DOM
				fila.innerHTML = ` 
					<div id="cont_tab_calif">
						<div id="c_nomb">${nombres[i]}</div>
						<div id="c_lname">${apellidos[i]}</div>
						<div id="califs">${calificaciones[i].join(', ')}</div>
					</div>`;
				contenedor_calif.appendChild(fila);

			}

		let prome_grupal = calc_promedioGrupal();
		let { masAlto, nombAlumMasAlto } = promedioMayorInd();
		let { masBajo, aprom_menor } = promedioMenorInd();
		    let ordenCal = calificacionesOrd();
	    let media_grupal =  medianaGrupo();


		  // Impresión del rendimiento y control Académico del grupo (debbug)
		console.log(`El promedio GRUPAL es: ${prome_grupal}`);
		console.log(`El promedio más ALTO es: ${masAlto}, alcanzado por: ${nombAlumMasAlto}`);
		console.log(`El promedio más BAJO es: ${masBajo}, obtenido por: ${aprom_menor}`);
		console.log('Ordenando todas las calificaciones...');
		console.log(`Calificaciones Ordenadas: ${ordenCal}\n`);
		console.log(`La Media de Calificaciones es: ${media_grupal}\n`);
	}

	     // Busqueda de Alumnos por medio de caja_Txt 
	   let buscar_alumno  = document.getElementById('buscar--alum');
    
 /*buscar_alumno.addEventListener('click',()=>{
    		
    	  const txt_alumno = document.getElementById('tec__alumno').value.toUpperCase();
    	    busquedaAlumno(txt_alumno);
    	
    	  if (buscar) {
    	    	console.log('Elemento Encontrado.');
    	 }else{
    	     	console.log('Elemento NO Encontrado');
    	    }  
	});*/	