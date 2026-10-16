  import { actualizarEstudiantes } from './alumns.js';
  import {nombres,apellidos,calificaciones,promedios} from './eventListeners.js';
  import {mostrarHistorialAlumns} from './notes.history.js';

       // Validar que se eviten entradas duplicadas
 export    function notRepeticionAlumno(name, last_name) {
        for (let i = 0; i < nombres.length; i++) {
          if(name.toUpperCase() === nombres[i] && last_name.toUpperCase() === apellidos[i]) {
            console.log('Error, ya haz registrado el Nombre: ', name, ' y el Apellido ', last_name, ' previamente');
           return true;
          }
        }
      return false;
    }

       // Validación del rango de calificaciones [se omitio el anadidamiento]
export  function calificacionMax(calif1, calif2, calif3) {
            const CMAX = 100;
            if(calif1 > CMAX || calif2 > CMAX || calif3 > CMAX) {
               console.log('ERROR: Alguna de los parciales excede su valor máximo.');
              return false;
            }
              return true;
        }

        // Convertir las entradas en formato MAYÚSCULAS
 export function transformateMayus(name, last_name) {
            let capitalName = name.toUpperCase();
            let capitalLName = last_name.toUpperCase();
       
            console.log('Transformado a Mayúsculas - ', capitalName, '- ', capitalLName);
                return { capitalName, capitalLName };
        }

     // Ordenar Nombres & Apellidos de los Estudiantes 
export  const  ordenPDataAlumns =(nombres,apellidos)=>{
             let orderNombres =  nombres.slice().sort();
              let orderApells =  apellidos.slice().sort();
                     // console.log('FBack: ',orderNombres, orderApells);
                  return {orderApells,orderApells};
       }
             // Adicional por discap visual, relajar vista
          // const tgeBtn = document.querySelector('.change-mode');
  export    const modo_dark = (tgeBtn)=>{
                 const all_page = document.body;
                 const mode_actual =  all_page.classList.contains('modo-claro') ? 'claro' : 'oscuro'; 
                  console.log('Listo para relajarte.\nEn un momento, será Iniciado el modo Dark.')
                if(mode_actual === 'claro'){
                     document.body.classList.remove('modo-claro');
                     document.body.classList.add('modo-oscuro');
                     localStorage.setItem('modo', 'oscuro');
                }else{  
                    document.body.classList.remove('modo-oscuro');
                    document.body.classList.add('modo-claro');
                    localStorage.setItem('modo', 'claro');
                }
            }

             // Notificación para cada estudiante agregado (modificacion alums1)
    export function notificarAgregadoAlum(name, last_name) {
        console.log('ALUMNO AGREGADO: ', name, ' ', last_name);
    }



     export   function edicionPorCelda(fila,indice){
      let entradas_ed = [];

       for(let j=0; j<fila.cells.length-1; j++){
          let celda = fila.cells[j];
          let valor_origin = celda.textContent;
           celda.innerHTML = '';

            let input_edit = document.createElement('input');
            input_edit.type = 'text';
            input_edit.value = valor_origin;

            console.log('#',valor_origin);

            celda.appendChild(input_edit);
            entradas_ed.push(input_edit );
       }
         
        entradas_ed.forEach((input_edit,j)=>{    //cambie el tipado de each a Each
            input_edit.addEventListener('blur', function(){
              fila.cells[j].textContent = input_edit.value;
                  actualizarEstudiantes(indice,j,input_edit.value);
            });
        });   

          entradas_ed[0].focus();
    }

 export const  eliminar_registro = (indice)=>{
        if(indice>=0 && indice<nombres.length){
          // Eliminar cada una de las celdas de los alumnos
             let  del_nombre  =  nombres.splice(indice-1);    
             let del_apellido  =  apellidos.splice(indice-1);
          let del_calificacion  =  calificaciones.splice(indice-1);

         console.log('El alumno ',del_nombre[0],'se elimino Exitosamente');

            mostrarHistorialAlumns();
  }else{
           console.log('Error: El alumno no fue encontrado', del_nombre)
              return true;
        }
    }