import {initEventListeners} from './modules/eventListeners.js';
import {mostrarHistorialAlumns} from './modules/notes.history.js'
import {mostrarEstadisticas} from './modules/Statistics.js';
import {guardarCalificaciones,mostrarResultadosAlumnos} from './modules/save.notes.js';
import {imprimirAlumnosPDF} from './modules/generation.pdf.js';
 // import {notificarAgregadoAlumno} from './modules/utils.js';

document.addEventListener('DOMContentLoaded',()=>{ 
	initEventListeners();
	mostrarHistorialAlumns();
});