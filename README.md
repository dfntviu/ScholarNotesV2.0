# Control de Calificaciones · v2 (MVC)

Aplicación en **HTML, CSS y JavaScript vanilla** para registrar alumnos y sus tres parciales, ver estadísticas del grupo, graficar la distribución de promedios y llevar la asistencia. Pieza de portafolio.

## Uso

```bash
npm install
npm run dev       # servidor de desarrollo
npm test          # pruebas del Model (Vitest)
npm run build     # genera dist/ (rutas relativas: sirve en GitHub Pages, Netlify o una subcarpeta)
npm run preview   # sirve dist/ localmente
```

> Los módulos ES no funcionan abriendo `index.html` con doble clic (`file://`). Usa `npm run dev`, `npm run preview` o cualquier servidor estático sobre `dist/`.

## Arquitectura: MVC mínimo

Se eligió **MVC** (no SSV ni Hexagonal): el dominio es delgado (CRUD + estadísticas) y no hay estado reactivo compartido entre componentes que justifique un Store. Subir de nivel sería sobre‑ingeniería.

```
src/
├── model/                    ← datos + reglas. Sin DOM.
│   ├── storage.js            persistencia segura (localStorage)
│   ├── alumnos.model.js      CRUD, validación, duplicados, promedio derivado, búsqueda
│   ├── estadisticas.model.js funciones puras: promedio grupal, mediana, extremos, rangos
│   ├── asistencia.model.js   registro mes → alumno → día
│   └── preferencias.model.js tema claro/oscuro
├── view/                     ← solo pinta y lee el DOM. Sin reglas de negocio.
│   ├── alumnos.view.js · asistencia.view.js · graficas.view.js
│   ├── exportacion.view.js   TXT, PDF (jsPDF con carga diferida) e impresión
│   └── feedback.view.js · tema.view.js · dom.js
├── controller/               ← delgado: evento → Model → View
│   └── alumnos · asistencia · graficas · tema
└── pages/                    ← punto de entrada de cada HTML
```

**Dirección de dependencias:** `Controller → Model` y `Controller → View`. El Model no importa nada de View ni Controller.

## Errores corregidos

### Model (antes vivía dentro de `eventListeners.js`, el Controller)
| Error | Efecto | Corrección |
|---|---|---|
| Los arreglos de datos se exportaban desde el Controller y todos los módulos los importaban de ahí | Importaciones circulares; Model acoplado a eventos | Model propio en `src/model/` |
| `promedios` escrito a mano, desincronizado de `calificaciones` | Ej. JESUI mostraba 78.67 en vez de 79.33 | El promedio siempre se deriva |
| Estado solo en memoria | Las páginas Gráficas y Asistencia nunca veían los alumnos agregados | Persistencia en `localStorage` + resincronización (`pageshow`, `storage`) |
| `countRankProm`: `< 69`, `< 79`, `80 <= x < 99` | 69.5 no contaba; los 90s caían en 80‑89; los < 60 se ignoraban | Rangos semiabiertos `[min, max)` incluyendo 0‑59 y 90‑100 |
| `medianaGrupo` devolvía string (impar) o number (par) | Tipos inconsistentes | Siempre número |
| Grupo vacío | `Math.max()` = ‑Infinity, promedio NaN | Devuelve `null`, la vista muestra “—” |
| `ordenPDataAlumns` devolvía `{orderApells, orderApells}` y ordenaba nombres y apellidos por separado | Código muerto; habría roto la correspondencia | Eliminado |

### Controller
| Error | Efecto | Corrección |
|---|---|---|
| `eliminar_registro`: `splice(indice - 1)` sin cantidad | Borraba desde el alumno anterior **hasta el final**; `promedios` no se tocaba | Borrado por id, exactamente 1 registro |
| `del_nombre` usado en el `else` sin declarar | `ReferenceError` | Eliminado |
| Edición: el bucle convertía también la celda del botón “Editar” en input; cada `blur` repintaba la tabla | Edición rota; valores guardados como string sin recalcular promedio | Fila en modo edición con Guardar/Cancelar (Enter/Esc), validación del Model |
| Validación solo `> 100` | Aceptaba vacíos (NaN), negativos y texto | Validación completa con mensajes en pantalla |
| Descarga TXT dentro del `for` | Una descarga por alumno | Un solo archivo |
| Modo oscuro registrado en un `DOMContentLoaded` que ya había ocurrido | El botón nunca funcionaba; el modo guardado no se aplicaba | Controller de tema; persiste entre páginas |
| Búsqueda comentada y con HTML mal formado (`<div/>`) | El botón Buscar no hacía nada | Búsqueda parcial sin acentos ni mayúsculas, con aviso si no hay resultados |
| “Mostrar calificaciones” solo hacía `console.log` | El usuario no veía las estadísticas | Panel con promedio grupal, mediana, más alto y más bajo |

### View / runtime
- **PDF:** `window.jspdf.js` no existe (TypeError), `text()` con argumentos invertidos, `empezar_y` en vez de `startY`, y se raspaban del DOM las columnas Editar/Borrar. Ahora se genera desde el Model.
- **Impresión:** se clonaba la tabla y se vaciaba (`innerHTML = ''`) → hoja en blanco; `window.open` con argumentos mal formados. Corregido, con aviso si el navegador bloquea la ventana.
- **Gráfica:** `new Chart` en cada clic (“Canvas is already in use”) y se le pasaba un objeto en lugar de un arreglo. Ahora reutiliza la instancia y respeta el tema.
- **Asistencia:** `<td>` anidados en `<td>`, 120 columnas en una sola fila, colores invertidos (falta = verde), CSS inválido (`backgroundColor`), la tabla de resultados estaba dentro del contenedor que se ocultaba y la asistencia se perdía al recargar. Rediseñada: selector de mes, 4 semanas × L‑V, guardado automático y resumen con porcentaje.
- **XSS:** nombres insertados con `innerHTML`. Todo el texto entra ahora por `textContent`.
- **HTML:** `<ul>` dentro de `<li>`, ids duplicados, enlace a `login.html` inexistente (404), `lang` ausente.
- **CSS:** llave `}` suelta que invalidaba reglas, `transition: scale()` inválido, selectores que no coincidían (`#estadist_alumns`, `.container__head`), modo oscuro que solo cambiaba el fondo del `body`.
- **Dependencias:** jsPDF 2.x tenía vulnerabilidades (DOMPurify). Ahora jsPDF 4 / autotable 5 desde npm, cargados solo al exportar. `npm audit`: 0 vulnerabilidades.

## Pruebas
- `tests/model.test.js`: 15 pruebas del Model, incluidos los casos exactos de los errores anteriores.
- Verificado en Chromium sobre el build: alta, validación, duplicados, edición, borrado, búsqueda, estadísticas, TXT, PDF, impresión, gráfica, asistencia con persistencia, tema entre páginas y vista móvil sin scroll horizontal, sin errores de consola.
"#ScholarNotesV2.0" 
