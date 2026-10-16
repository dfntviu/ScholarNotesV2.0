import obt_alums from './get.list-alums.js';
 // const bn_guar_asistencia = document.getElementById('guradar-asistencia');

export  function contarDias(){

	      const dias_head = document.getElementById('contar'); 
		    for (var i = 1; i <= 30; i++) {
		 	  const  columna = document.createElement('td');
		 	       columna.textContent = i;
		 	       dias_head.appendChild(columna);
		    }
		}

		/**
		 *  Asegura que las celdas que tienen las clases de marcado asistencia
		 * sean actualizados a los colores correspondientes. Se invocará post
		 * a cada clic escuchado. **/
 export	function ayudaAsistenciaVisual(){
	    	 		// const obt_alums = document.getElementById('get-alums');
			const filas = obt_alums.querySelectorAll('tr');

				filas.forEach(fila=>{
					  const celdas = fila.querySelectorAll('td');
					    celdas.forEach((celda,in_celda)=>{
					    	if(in_celda>1){
					    	 if(celda.classList.contains('mrc-falta'))
					    	 	celda.style.backgroundColor = 'green';   //Llam'o a estilo, un clic eq. a falta
					       else if(celda.classList.contains('mrc-asistencia'))
					    	 	celda.style.backgroundColor = 'red';	//Llam'o a estilo, 2 clics eq. a asistenia
					    	}
					    });
				});
	    } 

	    /**
	     *  Son disparados al ejecutarse la escucha de ClasList
	     * e inmediatamente se aplicarán el cod. de color correspondiente   **/
	    // Variable auxiliar a 'ayudaAsistenciaVisual' cambia el color de las celdas
	 	const style = document.createElement('style');
	    	style.innerHTML = `
	    		td {
	    			border: 0.8px solid black;
	    			padding: 5px;
	    		}

	    		.mrc-asistencia {
	    			backgroundColor: green;
	    		}

	    		.mrc-falta {
	    			backgroundColor: red;
	    		}
	    	`;
	    	document.head.appendChild(style);

export	function mostrarAsistencia(){
		// bn_guar_asistencia.addEventListener('click', function() {
			document.getElementById('tab--asistencia').style.display = 'none';

			const tablaResultado = document.getElementById('tab-resultado');
			tablaResultado.style.display = 'table';
				// Limpiar lo que tenga la tabla anterior
			tablaResultado.innerHTML = '';
				// Recorrer la tabla original y obtener los datos
			const tabAsistencia	= document.getElementById('tab--asistencia');
			const filas = tabAsistencia.getElementsByTagName('tr');

			// Crear la nueva tabla dina'te desde la prop.Child[Rows,Cols]
				for (let i = 0; i < filas.length; i++) {
					const nueva_fila = document.createElement('tr');
					const celdas 	 = filas[i].getElementsByTagName('td');

					//Efect.la misma creacion dinamica p/celdas
					 for (let j = 0; j < celdas.length; j++){
					 	const nueva_celda = document.createElement('td');
					 		nueva_celda.textContent = celdas[j].textContent;
								// Verifica la(bandera control)
					 		 if(celdas[j].classList.contains('mrc-asistencia'))
					 		 	nueva_celda.style.backgroundColor = 'green';
					 		 else if(celdas[j].classList.contains('mrc-falta')){
					 		 	nueva_celda.style.backgroundColor = 'red';
					 		 }

					 		 nueva_fila.appendChild(nueva_celda);
					 		 console.log('Elements. guardados.', nueva_fila);
					 }

					 
					tablaResultado.appendChild(nueva_fila);
				}
	}
					 		 // celdas[j].textContent.toLowerCase()=== 'presente'

	    
 /* contarDias();
 dinamizarFormat(); 
 retornarAlumnos();*/