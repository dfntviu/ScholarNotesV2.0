import {nombres,apellidos,calificaciones,promedios} from './eventListeners.js';  //agregar calif's
import {mostrarHistorialAlumns} from './notes.history.js';

   // Prop: Busca a los Alumnos, despues de agregarlos y obener sus promedios
export  const  busquedaAlumno = (txt_alumno)=>{
		    let container_search = document.getElementById('container_search');
		    	container_search.innerHTML = '';
			     
			 let bande_busq = false;
			 let b;
    			 
		for (b = 0; b < nombres.length; b++) {
			if(txt_alumno ===  nombres[b]){   	
				bande_busq = true;
					/**  mostrar el resultado de busq. en el DOM **/
					      // a. crear elemento
						const alum_bus = document.createElement('div');
					     // b. aniadir al elemen de la lista
						alum_bus.classList.add('alum_bus')
							// c. acomodar elemento en la estrut DOM
						alum_bus.innerHTML= ` <p>El Alumno: "${txt_alumno}" Se Encontró con ÉXITO</p>
											  <div class="nm_enc-1">${nombres[b]}  <div/>
											  <div class="nm_enc-2">${apellidos[b]}<div/>
											  <div class="nm_enc-3">${promedios[b].toFixed(2)}<div/>`;
						// d aniadir elemento a la etiq padre
						container_search.appendChild(alum_bus);
				break;
			}			  
    	}
	}

    	 // Actualiza el campo trab. en conjunto med. la f(n) 'edicionPorCelda'
export	function actualizarEstudiantes(indice,columna,nuevo_valor){  // alu[i],

		switch(columna){	

			case 0:
					nombres[indice] = nuevo_valor;
				break;	

			case 1:
				  apellidos[indice] = nuevo_valor;
			    break;
				
			case 2: 
				  	calificaciones[indice][0] = nuevo_valor;
				  	 mostrarHistorialAlumns();				  	 
				break;

			case 3:
				    calificaciones[indice][1] = nuevo_valor;
				     mostrarHistorialAlumns();
				  break;

			case 4:
				   calificaciones[indice][2] = nuevo_valor;
				  	 mostrarHistorialAlumns();
			    break;
		} 
	}