import {nombres,apellidos,calificaciones} from './eventListeners.js';

 let document_Pdf;
 let print_Id;

     // let document_Pdf  = document.getElementById('desc__calif_Pdf');

export function guardarPDF(document_Pdf){
  		       const { jsPDF } = window.jspdf.js;

	  	       const documento = new jsPDF();
	  	         let access_doc = document.getElementById('historial_calif');

  	 			const cabeceras = [];

  	 			// Obtencion por cabeceras
		  	   const celdaCabeceras = access_doc.querySelectorAll('thead th');
		  	   console.log('cell ',celdaCabeceras);
		  	    celdaCabeceras.forEach(celdaCabecera => {
		  	   	    cabeceras.push(celdaCabecera.innerText.trim());
		  	   	  	// console.log('Cabec -',val);
		  	    });
		  	    	
		   // Obtencion de las filas
		     const cuerpo = [];
		      const filas = access_doc.querySelectorAll('tbody tr');

  	    	filas.forEach(fila =>{
  	   	   const datosFila = [];
  	   	      const celdas = fila.querySelectorAll('td');
  	   	      console.log('cont: ',celdas);
  	   		     celdas.forEach(celda => {   //falto la E por la e
  	   			   datosFila.push(celda.innerText.trim());
  	   		   });
  	   			 cuerpo.push(datosFila);
  	   	    });
  	    	let conta = 0;
  	    	 conta+=1;
  	    	 let ans = conta;
  	   	    documento.text(21,21,'Calificaciones Grupo 0-',ans);

  	   	    documento.autoTable({
  	   	       empezar_y: 30,
  	   	    	head: [cabeceras],
  	   	    	body: cuerpo
  	   	    });

  	       documento.save('concent-calificaciones.pdf');
      } 

 
export   const imprimirAlumnosPDF = (print_Id)=>{
  	   let band = true;
  		console.log('El documento concentrado será enviado a la cola de imprensión');

  		let tabla_calif = document.getElementById(print_Id).cloneNode(band);
  			tabla_calif.innerHTML = '';

  		let vent_impresion = window.open('','','height=600','width=550','Impresión-Concentrado');
  		vent_impresion.document.write('<html><head><title>Impresión de Calificaciónes</title>');
  		vent_impresion.document.write("<link rel='stylesheet' href='./style/califs.style.css'>");
  		vent_impresion.document.write('</head><body>');
  		vent_impresion.document.write(tabla_calif.outerHTML);
  		vent_impresion.document.write('</body></html>');
  		// vent_impresion.document.close();
  		// console.log('una ', tabla_calif.outerHTML);
  		vent_impresion.document.close();
  		vent_impresion.focus();
  		vent_impresion.print();
  		// control del tiempo de impresion
  		setTimeout(()=>{
  			vent_impresion.close();
  		}, 7000);

    }