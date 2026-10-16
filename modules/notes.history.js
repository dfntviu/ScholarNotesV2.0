import  {edicionPorCelda,eliminar_registro} from './utils.js';
import {nombres,apellidos,calificaciones} from './eventListeners.js';
	
export  function  mostrarHistorialAlumns(){
    	 let historial_cal = document.getElementById('historial_calif').getElementsByTagName('tbody')[0];
    	  historial_cal.innerHTML = '';	

    	 for(let i =0; i<nombres.length; i++){
    	 	   let fila = historial_cal.insertRow();
	   		  
	   		  let nombCelda = fila.insertCell(0);
	   		let	apellCelda	= fila.insertCell(1);
	   		let	celdaCalif1	= fila.insertCell(2);
	   		let	celdaCalif2	= fila.insertCell(3);
	   		let	celdaCalif3	= fila.insertCell(4);

	   			 nombCelda.textContent =  nombres[i];
	   			apellCelda.textContent =  apellidos[i];
	   		   celdaCalif1.textContent  = calificaciones[i][0];
	   		   celdaCalif2.textContent  = calificaciones[i][1];
	   		   celdaCalif3.textContent  = calificaciones[i][2];
				// Edicion
	   		   let cellEdit = fila.insertCell(5);
	   		   let editButton = document.createElement('button');
	   		        editButton.textContent = 'Editar';
	   		    editButton.classList.add('btn','btn-warning');

	   		    editButton.addEventListener('click', function() {
	   		    	edicionPorCelda(fila,i);
	   		    });
 				  cellEdit.appendChild(editButton);

 				 let cellDel = fila.insertCell(6);
 				 let boton_delete = document.createElement('button');
 				 boton_delete.textContent = 'Borrar';
 				 boton_delete.classList.add('btn','btn-danger');

 				 boton_delete.addEventListener('click', function(){
 				 	eliminar_registro(i);
 				 });

    	    cellDel.appendChild(boton_delete);
     	 }
    }