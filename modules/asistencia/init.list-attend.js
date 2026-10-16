import { nombres,apellidos } from '../eventListeners.js';
import {contarDias, ayudaAsistenciaVisual, mostrarAsistencia } from './utils.list-attend.js';
  import obt_alums from './get.list-alums.js';

			// const obt_alums = document.getElementById('get-alums');	 //cambio
	      const conteo_dias = document.getElementById('days-w');  	 //cambio
	  const btn_asistencias =  document.getElementById('mrc-asistencia');//new, necesario p ver todo el status
	  	// Botones de guardado y visualizacion [actlzn]
	  		  const bn_guar_asistencia = document.getElementById('save-asistencia');
	  		   // const bn_ver_asistencia = document.getElementById('view-asistencia');
	  		  const bn_most_asistencia = document.getElementById('mostrar-asistencia');

	  		  // Ar. Vacio p/almacenar el control de Asistencia. Estab en 0 las 'asistencias'
	  		   let ctrl_Asistencia = [];

 	document.addEventListener('DOMContentLoaded', () => { 
	   /** Recomendacion
    	 * Ap: Los arreglos deberán de estar incializados desde el principal, ademas de
    	 * tener la misma longitud (deberá guardarse en utils o Init) 
    	 *     **/  
			contarDias();
			dinamizarFormatWeek();
			retornarAlumnos();
			initAsistenceEvents();	// nva funcion carga events

  	});

    /* * Se encarga de generar dinámicamente la estructura de días para un calendario
 	   * de asistencia de 6 meses. Cada mes se compone de 4 semanas laborales, y cada
 	   * semana incluye los días de lunes a viernes.
 	   * 
	   * La función limpia cualquier contenido previo en el `<thead>` y añade
	   * filas (`tr`) con los nombres de los días (`th`) para cada semana y mes.
    */
    export	function dinamizarFormatWeek(){			//change_Initial
		let dias = ['L','Ma','Mi','J','V'];

	    const sem_x_mes = 4;
	    const tot_Meses = 6;

	    // clean any garbage of l.storage
	    conteo_dias.innerHTML = '';

	    for (let mes =0; mes < tot_Meses; mes++) {
	    	  const fila = document.createElement('tr');
	    	for (let semana =0; semana < sem_x_mes; semana++) {
	    			dias.forEach(dia => {
	    				const colum = document.createElement('th');
	    				  colum.textContent = dia;
	    				  fila.appendChild(colum);
	    			});
	    	}
	    		conteo_dias.appendChild(fila);
	    }
	  }					//change_Ending

	  /***
	  	 *C/Fila creada se aniade y se compone de dos celdas, una para el nombre y otra 
	   	 * para el apellido, las cuales se aniaden al cuerpo de la tab. del DOM
	   	 * 
	   	 * El prop. es ejecutarse automáticamente, cuando la pág. ha terminado de 
	   	 * cargar, asegurando que los alumnos se desp. correctamente en la interfaz
	   */
	function retornarAlumnos(){ 
		 const tot_dias = conteo_dias.querySelectorAll('th').length;  //*


		nombres.forEach((nombre,ind_n)=>{
		   const fila_alum = document.createElement('tr');
		   
		   const nom_alum = document.createElement('td');
			 nom_alum.textContent = nombre;
			
		   const alum_ap1 = document.createElement('td');
			       alum_ap1.textContent = apellidos[ind_n];
		   
		     fila_alum.appendChild(nom_alum);
		     fila_alum.appendChild(alum_ap1);

		     	// Agregar celdas vacías para todo el mes
		     	for(let i=0; i<tot_dias;i++){
		     		const celda_vacia = document.createElement('td');
		     			  celda_vacia.textContent = '';
		     		  fila_alum.appendChild(celda_vacia);
		     	}   //cambio

		     obt_alums.appendChild(fila_alum);
		});
		// Llamar a la función para marcar la asistencia en la tabla
	}
		
		/**
		 *  Son alternadas las clases  asistencia y falta. Luego con 'Ayuda', se llama
		 *   para cambiar el color de fondo de la celda, segun sea la clase asignada. */
	function initAsistenceEvents(){
		/** Iniciar lógica de desición. */

	  				// Inicia el ev p/aplicar color del listado de la tab. alumnos 
			obt_alums.addEventListener('click',ev =>{ 
					// Logica remplazada de f(n) anterior
				const celda = ev.target;
					// Inicia la carga de prop de la celda 
				if(celda.tagName === 'TD'){
					// Alternar entre Falta y Asitencia, segun corresponda el evento
					if (celda.classList.contains('mrc-asistencia')) {
						celda.classList.remove('mrc-asistencia');
						celda.classList.add('mrc-falta');
     					  // console.log('Ud. Marcó FALTA');
					} else if(celda.classList.contains('mrc-falta')){
						celda.classList.remove('mrc-falta');
						celda.classList.add('mrc-asistencia');
	  					  // console.log('Ud. Marcó asistencia');
					}else{
						// Si-no tiene clase, se asume que: El estado 's asistencia
						celda.classList.add('mrc-asistencia');
					}
				}	
						// Calling of f(n) encargada d mostrar en la tabla su asistencia
					ayudaAsistenciaVisual();
			});

	  		 /** */
	}

			function guardarContAsistencia(){
				 console.log('El ctrl de Asistencias se está comenzando a guardar');
 						// Crear 1 arreglo vacio y que se guarden las celdas
 			 	// ->. Reinciar las Asistencias 
 			 	   ctrl_Asistencia = [];
 				
 				// ->. Asegurar el  guardado de toda la tabla(busq hacia [abajo])
 			 	  	const filas = obt_alums.querySelectorAll('tr');

 			 	  	filas.forEach((e_fila,in_fila)=>{
 			 	  	 // ->. guardar el control de asistencia
 			 	  	   const celdas = e_fila.querySelectorAll('td');
 			 	  	   	celdas.forEach((e_celda,in_celda) =>{	
 			 	  	   		if(e_celda.classList.contains('mrc-asistencia') || e_celda.classList.contains('mrc-falta') ){
 			 	  	   			// Guardar el Estado de Toda la tab. celda x celda ^ fila x fila,  agregar  al ar. de la 131
 			 	  	   			ctrl_Asistencia.push({
 			 	  	   				 e_fila: in_fila,
 			 	  	   				e_celda: in_celda,
 			 	  	   				clase: e_celda.classList.contains('mrc-asistencia') ? 'mrc-asistencia' : 'mrc-falta'
 			 	  	   			});
 			 	  	   			  console.log(ctrl_Asistencia);
 			 	  	   		}

 			 	  	   	});
 			 	  	});	

 			 	  	console.log	('El control de Asistencia fue guradado.');
			}
				
				// ->Con la f(n) auxiliar, que muestra lo que fue guardo previamente 

		/*	function mostrarAsistenciaGuardada(){
					console.log('El control de Asistencia está próximo a desplegarse');
					// limp. todas las clases(cuerpo de la tab)

				if(ctrl_Asistencia.length === 0){
						console.log('No haya asistencia');
							return;
				 }

				   	    const filas = obt_alums.querySelectorAll('tr');

				   filas.forEach(fila => {
				   	    const celdas  = fila.querySelectorAll('td');
				   	    celdas.	forEach(celda => {
				   	    	celda.classList.remove('mrc-asistencia','mrc-falta');
				   	    	celda.style.backgroundColor = '';  //restab. el color
				   	    });
				   });
				   
				 	// -> Aplicar el control guardado
				 ctrl_Asistencia.forEach(item => { 
				 		const fila = filas[item.fila];

		          if (!fila) {
		            console.error('Fila no encontrada para el índice:', item.fila);
		             return;
		      	  }
				 	      const celdas = fila.querySelectorAll('td')[item.celda];
        				const celda  = celdas[item.celda];

				      if (!celda) {
				          console.error('Celda no encontrada en la fila:', item.celda);
				          return;
				      }
				 	 
				 	 	celda.classList.add(item.clase);
				 	 ayudaAsistenciaVisual();  // actualizar la visualizacion
				 

				 });
				 			// const filas = obt_alums.querySelectorAll('tr')[item.fila];
			}*/
 				
 			// -> Disparar ev. para guaradar la asistencia
						bn_guar_asistencia.addEventListener('click', guardarContAsistencia);
			// -> Disparar ev. para mostrar(visualizr) la asistencia
					  bn_most_asistencia.addEventListener('click', mostrarAsistencia);
				
				/*obt_alums.addEventListener('click',(ev)=>{
					if(ev.target.tagName === 'ID'){
						 const celda = ev.target;
						 celda.classList.toogle(sAsistencia ? 'mrc-asistencia': 'mrc-falta');
			 		}
			    });*/
			
					  // if (typeof item.fila !== 'number' || item.fila < 0 || item.fila >= filas.length) {
					  //     console.error('Índice de fila inválido:', item.fila);
					  //     return;
					  // }
