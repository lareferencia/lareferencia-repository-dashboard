# Comparación final de las validaciones de AREANDINA #6

El 19 de noviembre de 2026 se recorrieron las dos interfaces en Chrome contra el mismo harvester, PostgreSQL, SQLite y almacén de XML de la copia Docker de E5. El admin se abrió con `developer` y el dashboard con `dashboard`, lector de la red 33. Cada cuenta usó su propio contexto de navegador. Las capturas de escritorio tienen 1440 × 1000 píxeles, idioma español y zona Europe/Madrid. El par móvil tiene 390 × 844 píxeles. [Admin de la copia](http://admin.localhost:64065/admin/networks/33/diagnostics?snapshot=6) · [Dashboard de la copia](http://dashboard.localhost:64065/dashboard/es/AREANDINA/validation/6)

## Pantallas y estados comparados

| Estado | Resultado comprobado | Admin | Dashboard |
|---|---|---|---|
| Informe inicial | Misma fecha de cosecha, 4.000 registros, cero válidos y cero transformados. El orden visible es cabecera, snapshot, métricas, filtros y reglas. | [Captura](admin-informe.png) | [Captura](dashboard-informe.png) |
| Selector de snapshot abierto | La opción #6 muestra estado y hora local. El menú se abre desde el teclado y se puede cerrar con Escape. | [Captura](admin-snapshot.png) | [Captura](dashboard-snapshot.png) |
| Cumplimiento de reglas | Obligatorias primero. Language presenta 1.871 aprobaciones y 2.129 fallos. Los porcentajes se calculan sobre la selección y se muestran con un decimal. | [Captura](admin-reglas.png) | [Captura](dashboard-reglas.png) |
| Ocurrencias de Language | Dos tablas de valor y frecuencia. El valor inválido `es` aparece 2.274 veces. En el dashboard, el contexto de la regla y las descargas acompañan las tablas. | [Captura](admin-frecuencias.png) | [Captura](dashboard-frecuencias.png) |
| Filtro de fallos de Language | Ambas entradas, aplicadas desde el formulario, devuelven 2.129 registros. La fila de Language pasa a cero aprobaciones y 2.129 fallos. La cabecera identifica la cosecha completa. | [Captura](admin-filtro.png) | [Captura](dashboard-filtro.png) |
| Segunda página | La tabla carga 25 filas por defecto. Pasar a la página 2 cambia el primer identificador. Ambas capturas empiezan en `areandina/1026`. | [Captura](admin-pagina-2.png) | [Captura](dashboard-pagina-2.png) |
| Búsqueda por identificador | Desde la segunda página se buscó el identificador completo terminado en `/1000` con Enter. Quedó una fila con estado inválido y cinco reglas fallidas. | [Captura](admin-registros.png) | [Captura](dashboard-registros.png) |
| Ficha de validación | Coinciden identificador, estado, prefijo, ID interno, origen y 14 evaluaciones. La ficha ofrece acceso OAI y separa los valores válidos e inválidos de cada regla. | [Captura](admin-ficha.png) | [Captura](dashboard-ficha.png) |
| XML del mismo registro | Se abrió la segunda pestaña y se buscó `<field`. El visor colorea las etiquetas, resalta las coincidencias y deja copia y descarga al pie del diálogo. | [Captura](admin-xml.png) | [Captura](dashboard-xml.png) |
| Búsqueda sin resultados | La tabla conserva sus columnas y explica el resultado vacío. Las reglas muestran un guion cuando el denominador del porcentaje es cero. | [Captura](admin-vacio.png) | [Captura](dashboard-vacio.png) |
| Informe móvil | El dashboard mantiene los controles dentro del ancho de 390 px. En el admin el ancho medido del documento es 429 px. | [Captura](admin-movil.png) | [Captura](dashboard-movil.png) |

## Correcciones y decisiones

- **Hora histórica.** La comparación inicial mostró las 18:16 en el selector del dashboard y las 20:16 en el admin. El adaptador entrega el `LocalDateTime` de cosecha en UTC sin sufijo y la API nativa entrega el instante con zona. El informe React interpreta ambas formas y usa el idioma y zona del navegador. En Madrid la cabecera y el selector muestran el 4 de octubre de 2026 a las 20:16. Una prueba cubre los valores sin sufijo, con `Z` y con offset explícito.
- **Lectura del informe.** Las métricas preceden a los filtros. Los selectores de validación usan el menú Material, el restablecimiento tiene etiqueta accesible y la búsqueda por identificador tiene un botón con lupa. El número de fallos mantiene el acceso a los registros correspondientes. El CSV de reglas conserva hasta tres decimales.
- **Registros.** El encabezado, la exportación, las columnas y el estado vacío forman parte de la misma tarjeta. El tamaño inicial pasó de 10 a 25 filas por página. El lector puede elegir 10, 25, 50 o 100. Para la regresión frente a los CSV históricos de E0 se eligieron expresamente 10 filas.
- **Ficha y XML.** El estado inválido usa el mismo rojo que la tabla. El enlace OAI queda junto al origen y al ID interno. Las tarjetas identifican la obligatoriedad y traducen los cuantificadores. Cada valor conservado ocupa su propia línea. Las acciones del XML permanecen en el pie del diálogo mientras se desplaza el contenido.
- **Diferencias deliberadas.** El dashboard conserva los filtros múltiples de reglas, el filtro de obligatoriedad, la agrupación de fallos por obligatoriedad, los CSV y la navegación entre coincidencias de XML. La navegación lateral corresponde a los módulos autorizados de cada cuenta. Los resultados de ambos recorridos se compararon con filtros equivalentes.

## Pruebas y reproducción

Pasaron el chequeo TypeScript, las 26 pruebas de Vitest y el empaquetado Maven. El recorrido de regresión por el gateway verificó los CSV, los totales de resumen y registros, la exportación de las 6.314 ocurrencias inválidas de la regla 10 para quienes aprueban Language, y los controles 401/403/404. También verificó que la copia y la descarga del XML reproducen los 5.816 bytes históricos de `areandina/1000`. [Traza HTTP](http.tsv) · [Cifras de las cuatro selecciones](selecciones.tsv) · [Permisos](permisos.tsv)

La comprobación estructural del HTML renderizado de `main` con web-design-blueprint obtuvo 94/100 y veredicto `pass`. La herramienta compara encabezados, regiones y patrones del DOM. Los pares de capturas permiten revisar la disposición, los diálogos y las diferencias visibles que esa comprobación no mide.

El gateway de E5 ya tenía configurado el host `admin.localhost`. Para servir su referencia se montó una copia del bundle de `lareferencia-lrharvester-admin-web/dist` en Nginx dentro de la red de E5, con el alias `admin-web-dev` y puerto interno 5173. El gateway encaminó las llamadas de ambas interfaces al harvester de la copia. Se instaló el ZIP React en el directorio estático de E5 conservando las configuraciones por idioma.

Con la copia en ejecución, desde el repositorio del dashboard y con Chrome y Playwright para Python instalados, ejecutar lo siguiente. Los scripts solicitan las contraseñas por terminal.

```sh
evidencia=$(mktemp -d)
python3 web/tests/gateway/compare_diagnostics.py 64065 "$evidencia/pares"
python3 web/tests/gateway/validation.py http://dashboard.localhost:64065 "$evidencia/regresion"
```

El ZIP React probado tiene SHA-256 `2f3be29347918cd99e7c644bac79917ebdf0cef47d66f4c4273573e87316bc96`. El JavaScript de referencia del admin es `index-B64jt-fa.js`, SHA-256 `df2f18a36a3a7075c33a250a57d1137d0f91a04d77af39eda973e12a51a2b1c4`. La instalación habitual de 8190 seguía sirviendo el `main.js` Angular registrado en E0. [Preparación de E5](../e5-react/README.md) · [Control independiente de SQLite y XML](../diagnostico-v5/README.md)
