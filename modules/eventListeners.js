import {mostrarHistorialAlumns } from './notes.history.js';
import {mostrarEstadisticas } from './Statistics.js';
import {guardarCalificaciones,mostrarResultadosAlumnos} from './save.notes.js';
import {imprimirAlumnosPDF,guardarPDF} from './generation.pdf.js';
import {notRepeticionAlumno, transformateMayus, calificacionMax, ordenPDataAlumns,modo_dark, notificarAgregadoAlum} from './utils.js';

 export let   nombres = ['ISRAEL','JESUI','MANUEL','PETER','SAMUEL',
           'SOFIA','MANUEL','ARON','JAVIER','ZACK',
           'SALOMON', 'MARISELA'];

  export let apellidos = ['RIVAS','PEREZ','PEREZ','JIMENEZ','HENRIQUEZ',
           'CASTANIO','HENRIQUEZ','ANASTIGA','CARA','RIOS',
           'RODRIGUEZ', 'MONTÉZ'];

 export let calificaciones = [[99,96,28],[87,57,94],[87,56,92],[87,54,26],
              [74,26,96],[78,56,35],[87,76,71],[78,56,31],
              [61,59,58],[87,64,26],[73,62,62],[69,73,71]];

  export let promedios = [74.33, 78.67, 78.33, 65.33,
            56.33, 78.00, 59.33, 59.00,
            65.67, 55.67, 55.00, 71.00 ];

  export function initEventListeners(){
  	  let formulario_Alum = document.getElementById('estudiante_form');
  	
     let boton_Results = document.getElementById('terminar');
  	  let btn_descarga = document.getElementById('desc__calific');
        let bot_califs = document.getElementById('all_calif');  //estadist
  	    let butt_print = document.getElementById('alums__pdfprint');
  	    let  dowldPDF  = document.getElementById('desc__calif_Pdf');
  	    // let etiqEnlace = document.getElementById('enlace');

  	   formulario_Alum.addEventListener('submit',(e)=>{ 
  	   		e.preventDefault();

  	   		     const name = document.getElementById('nombre').value;
  	   	    const last_name = document.getElementById('apellido').value;
  	   		const calif1 = parseFloat(document.getElementById('calif1').value);
  	   		const calif2 = parseFloat(document.getElementById('calif2').value);
  	        const calif3 =  parseFloat(document.getElementById('calif3').value);

            // Calculo del promedio
          const calc_calificaciones = [calif1,calif2,calif3];
             const  numerador =  calc_calificaciones.reduce((a,b) => a+b,0);
             let promedio = numerador/calc_calificaciones.length;

              // Determinar el rango de calificacionnes
            if(!calificacionMax(calif1,calif2,calif3)){
               return;
            }
              // Evitar la duplicidad de alumnos
            if(notRepeticionAlumno(name,last_name)){
               return;
            }
              // Orden alfabetido de las Entradas
              ordenPDataAlumns(nombres, apellidos);
                
            // Transformar a caráct's Capitalizadadas
            const  {capitalName, capitalLName} = transformateMayus(name,last_name);

            // Aniade los registros a los arrays de los estudiantes
                nombres.push(capitalName);
              apellidos.push(capitalLName);
              calificaciones.push(calc_calificaciones);
              promedios.push(promedio);

                // Limpiar el formulario
              formulario_Alum.reset();
              notificarAgregadoAlum(capitalName,capitalLName);

                // Inicializar la historia de Alumnos
              mostrarHistorialAlumns();
              console.log(':c ',calif1,':c2 ',calif2,':c3',calif3);
  	   });


        let tam_promedio = mostrarResultadosAlumnos;  
  	   boton_Results.addEventListener('click', mostrarEstadisticas);
       bot_califs.addEventListener('click', tam_promedio);

       btn_descarga.addEventListener('click', ()=>{
        let descrip = '';
         for (let i = 0; i < nombres.length; i++) {
            descrip += `${nombres[i]} ${apellidos[i]} ${calificaciones[i].join(',')}\n`;
  	   		guardarCalificaciones(descrip,'G01_calificaciones.txt');
          }
  	   });

  	   butt_print.addEventListener('click', ()=>{
  	   	   imprimirAlumnosPDF('historial_calif');
  	   });

  	   dowldPDF.addEventListener('click', ()=>{
  	   		 guardarPDF('desc__calif_Pdf'); 
  	   });
  	   
       // etiqEnlace.addEvenlistener('click', ()=>{
  	   // 		confirmSalidas();
  	   // });
       
        const tgeBtn = document.querySelector('.change-mode');
      window.addEventListener('DOMContentLoaded',()=>{
          const guarda_modo = localStorage.getItem('modo') || 'claro'; 
           tgeBtn.addEventListener('click',()=>{
            modo_dark('change-mode');
         }); 
      });
  }