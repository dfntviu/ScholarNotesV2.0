 import {nombres,apellidos,promedios} from './eventListeners.js'; 
 import {actualizarEstudiantes} from './alumns.js'; 
 
 const note_ranges = [
		{min: 60, max: 69, label: '60-69', count:0 },
		{min: 70, max: 79, label: '70-79', count:0 },
  		{min: 80, max: 89, label: '80-89', count:0 },
		{min: 90, max: 99, label: '90-99', count:0 }
 	];

 
 export function mostrarEstadisticas(){
 	let historia_estado_rep =  document.getElementById('estadist_alumnos').getElementsByTagName('tbody')[0];
	 	 historia_estado_rep.innerHTML = '';  

	 	for(let c = 0; c<promedios.length; c++){
	 	 	let reng_promedio  = historia_estado_rep.insertRow();
	 	 	         let celda_name = reng_promedio.insertCell(0);
	 	 	    let  celda_apellido = reng_promedio.insertCell(1);
	 	 	    let celda_promedio  = reng_promedio.insertCell(2);
					//prom por alumno
	 	 	     celda_name.textContent = nombres[c];
	 	 	 celda_apellido.textContent = apellidos[c];
	 	 	  celda_promedio.textContent = promedios[c].toFixed(2);		 	 	  	 
	 	 	   	// categorizeAndGraph(promedios[c]);
		}		
				let tam_promedio = promedios.length;

	 	 	   console.log('Total de Alummos:',tam_promedio);

	 	 	   	const { rank_60, rank_70,rank_80,rank_90_100 } = countRankProm(promedios);
	 	 	   console.log(`Contando Nivel Promedio(s) [60: 69] ${rank_60}`);
	 	 	   console.log(`Contando Nivel Promedio(s) [70: 89] ${rank_70}`);
	 	 	   console.log(`Contando Nivel Promedio(s) [80: 89] ${rank_80}`);
	 	 	   console.log(`Contando Nivel Promedio(s) [90: 100] ${rank_90_100}`);

	 	 	 return tam_promedio;
	 	 	  
	 }
	  /** Fue posible crear un fichero calculation.js, pero fue necesario refactorizar **/

      // Determinar el promedio mayor en el concentrado de calificaciones
export function promedioMayorInd() {
		let masAlto = Math.max(...promedios);
		let index = promedios.indexOf(masAlto);
		let nombAlumMasAlto = `${nombres[index]} ${apellidos[index]}`;

		return { masAlto, nombAlumMasAlto };
	}

	   // Determinar el promedio menor en el concentrado de calificaciones
export	function promedioMenorInd() {
		let masBajo = Math.min(...promedios);
		let ind_menor = promedios.indexOf(masBajo);
		let aprom_menor = `${nombres[ind_menor]} ${apellidos[ind_menor]}`;

		return { masBajo, aprom_menor };
	}

	   // Determinar el promedio total del grupo
export	function calc_promedioGrupal() {
		let sumaPromedios = promedios.reduce((a, b) => a + b, 0);
		let prom_grupal = (sumaPromedios / promedios.length).toFixed(2);
		return prom_grupal;
	}

		// Ordenamiento de los todos los promedios en el grupo
export	function calificacionesOrd() {
		 let ordenarAsc = promedios.slice().sort((a, b) => a - b);

		   return ordenarAsc;
	    }

 	   // Se obtiene la mediana de calificaciones en el grupo [Med = X:sb_m(n+1/2)]
export function medianaGrupo(){
		  let orden = calificacionesOrd();  // console.log('Values Calif -',orden)
			 console.log(orden);
			let n = orden.length; // *necesario identificar el tamanio -> console.log('Long Calif - ',n);

		   if(n==0){
			   return null;    // En caso de que no haya calificaciones [no contemple la opcion]
		    }

	  	    if(n%2==1){  	// total de calificaciones [n] es impar
		     	return orden[Math.floor(n/2)].toFixed(2);
       }else{
		  		// El num. de calif es par, => Es el promedio de las calif de la mitad [n1+n2+...+n_sbmtd-1+n_sb_mtd-2..+n_sb-n]
	 	   	  let medio1 = orden[n/2 -1];
	 		  let medio2 = orden[n/2];
	 		    return (medio1 + medio2) / 2;
		    }
	  }

	   /** Mét, tradicional agrupar en medio de un ranking, poco optimizando y  **/
export	const countRankProm = (promedios)=>{
			console.log("\nEsperé, Categorizando y/o clasificando los promedios 'anteriores' ");
				// Inicializacion de Indice del rango
			  let rk_p;
			  // Inicializacion de rangos 
			  let rank_60 = 0;
			  let rank_70 = 0;
			  let rank_80 = 0;
			  let rank_90_100 = 0;

			  // sus respectiva validacion en el rango, según le corresponda
			  for (rk_p = 0; rk_p < promedios.length; rk_p++) {
			  	  let promedio = promedios[rk_p];
			  	  if(promedio>= 60 && promedio<69){
			  	  	rank_60++;
			  	  	console.log('60-69 = [ ',rank_60 ,']');
			  	  }else if(promedio>= 70  && promedio<79){
			  	  	rank_70++;
			  	  	console.log('70-69 = [ ',rank_70 ,']');
			  	  }else if(promedio>= 80 &&  promedio<99){
			  	  	rank_80++;
			  	  	console.log('80-69 = [ ',rank_80 ,']');
			  	  }else if(promedio>= 90 &&  promedio<=100){
			  	  	rank_90_100++;
			  	  	console.log('90-100 = [ ',rank_90_100 ,']');
			  	  }
			  }

			  	return {rank_60,rank_70,rank_80,rank_90_100 };
	    }
	   
	
	/**
	 * Det. el rango apropiado para c/grado y llama a una f(n) externa
	   	  para realizar la graficación respectiva; mét refactorizado y
	   	  optimo 
	     const categorizeAndGraph = (barra_prom)=>{
	     	console.log('ingrese a la f(n)');
	     	for(let rango  of note_ranges){
	     		if(barra_prom >=  rango.min && barra_prom <= rango.max){
	     			rango.count++;
	     			console.log(`Total de calificaciones en: ${rango.label}: ${rango.count}`);
	     			addGraphBarNotes(rango.label,rango.count);
	     				break;
	     		}
	     	}
	     } 	 **/
		
		/*	   		trasing
	    actualizarEstudiantes(c,'columna',null); */