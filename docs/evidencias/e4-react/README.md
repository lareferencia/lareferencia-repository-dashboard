# E4 · Cosechas y estadísticas de uso

El 19 de noviembre de 2026 la cuenta `dashboard` abrió el historial de AREANDINA por el gateway Docker. El gráfico, la tabla y el CSV de React coinciden con la referencia Angular para el snapshot **6**. Se abrió su informe desde la barra del gráfico y desde el ID de la tabla. Al volver con Atrás se recuperaron el intervalo, el orden y el tamaño de página. [Referencia Angular E0](../e0-areandina-6/README.md) · [Gráfico React](grafico.png) · [Tabla React](tabla.png)

## AREANDINA en la instalación real

| Medida | Angular E0 | React por el gateway |
|---|---|---|
| Snapshots en el historial | Una fila, #6 | Una fila, #6 |
| Cosechados / válidos / inválidos / transformados | 4.000 / 0 / 4.000 / 0 | 4.000 / 0 / 4.000 / 0 |
| Inicio y fin | 4 de octubre de 2026, 18:01 a 18:16 | Mismo día y horas. El CSV conserva la precisión original de la API. |
| Primera consulta del gráfico | Últimos dos años, ocho por página | Del 19 de noviembre de 2024 al 19 de noviembre de 2026, ocho por página |
| Estadísticas | Módulo desactivado. El enlace directo vuelve a la portada. | Misma navegación. El menú omite estadísticas y el navegador no monta el widget. |

El filtro consulta los días de **fin de cosecha** con ambos extremos incluidos. El intervalo del 4 al 4 de octubre devolvió #6 y el del 5 al 5 devolvió cero filas. La API entrega horas locales sin desplazamiento y se probaron en Chrome con zona Europe/Madrid. La tabla inicial abarca todo el historial. Admitió ordenar «Cosechados» mediante la propiedad de servidor `size` y cambiar de diez a 25 filas. «Inválidos» se calcula como cosechados menos válidos. El CSV de la página contiene las siete cabeceras, en orden, con fechas y contadores cotejados campo por campo contra la respuesta v5. [Respuesta de la API](snapshot.json) · [CSV descargado](historial.csv) · [Traza de la consulta real, la navegación y los estados HTTP](http.tsv)

En el candidato local React se monta bajo el puerto 62241. Sus llamadas pasan por el host dashboard de Nginx. Angular continuó servido por el gateway en 8188 y por Spring en 8190. La huella SHA-256 de su `/dashboard/es/main.js` siguió coincidiendo con E0: `1ef70d67f8de04dd0641c3467be5ba9701b2459983213a69feea4368841fcb15`.

## Casos que requieren datos de prueba

AREANDINA tiene un solo snapshot en esta instalación y carece de `attributes.stats_source_id`. Para comprobar los casos siguientes se variaron las respuestas dentro de un contexto de navegador de prueba. La base de Docker y la configuración servida a otros navegadores conservaron sus valores.

| Caso | Comprobación |
|---|---|
| Paginación del gráfico | Con nueve cosechas sintéticas, React pidió ocho por página. La primera tabla accesible mostró #2 a #9 en orden cronológico y la segunda, #1. Se representaron válidos e inválidos apilados y transformados como línea independiente. [Gráfico con las tres series](grafico-simulado.png) |
| Servicios habilitados por instalación | Con estadísticas activas, historial y validación desactivados, la cuenta recorrió la interfaz en portugués. La portada y el menú ofrecieron los servicios habilitados. La URL directa del historial volvió a Inicio. |
| Configuración o ID ausente | Sin URL, la pantalla explicó que faltaba la configuración. Con URL y el DTO real de AREANDINA, explicó que faltaba el ID estadístico. En ambos casos se evitó cargar el proveedor. |
| Fallo, reintento y cambio de fuente | Un servidor local devolvió 503 al primer intento y sirvió después un script compatible con LRHW. El reintento mostró `test-33`; tras recargar y seleccionar otra fuente se mostró `test-99`. Se comprobó una carga por montaje, una sola instancia en pantalla y su retirada al salir. |
| LRHW publicado y etiquetas de ámbito | Se ejecutó en Chrome el JavaScript publicado de **LRHW 1.1.6**, servido desde una copia local. Se verificaron el selector «Instituto - Teste», el idioma portugués y los parámetros de agregador nacional. También se comprobó el ámbito de repositorio con el proveedor de prueba. [Widget con fuente de prueba](widget-prueba.png) |
| Evidencia de uso externo | El script publicado se probó con un ID sintético y el host de estadísticas desconectado en Chrome. Se verificó el arranque de su interfaz. La validación de descargas, vistas y enlaces de AREANDINA requiere una fuente real asignada por el proveedor. |

El iframe tiene su propio documento y se destruye al cambiar de fuente o salir. LRHW 1.1.6 consulta `document.cookie` durante el arranque; ese documento le ofrece un valor en memoria para el idioma. La sesión del gateway permanece en la aplicación. [Integración React](../../../web/src/features/Statistics.tsx) · [Contrato usado por Angular](../../../angular/src/app/statistics/pages/main.component.ts)

## Reproducir

Usar el candidato de E2 y el Docker de desarrollo activos, con Node y npm de las versiones de E1, Python Playwright y Chrome. Ejecutar desde la raíz del dashboard. La prueba pide la contraseña en el terminal. El directorio de salida recibe las capturas, la traza, el snapshot y el CSV. [Preparación del candidato Docker](../e2-react/README.md) · [Recorrido Playwright](../../../web/tests/gateway/history.py)

```sh
(cd web && npm ci && npm test && npm run build)
curl -fsSL https://cdn.jsdelivr.net/gh/lareferencia/lrhw@1.1.6/dist/assets/chunks/historic-widget.js -o /tmp/lrhw-1.1.6.js
puerto=$(docker port lr-e2-dashboard-candidato 8080/tcp | cut -d: -f2)
python3 web/tests/gateway/history.py "http://dashboard.localhost:$puerto" /tmp/lr-e4-evidencias --provider-script /tmp/lrhw-1.1.6.js
```

Huella SHA-256 del script LRHW probado: `a86f78a229b5f9edc3f325c92a86f670ff9054492157ebd7caefea5435a2a6f3`. Al omitir `--provider-script` se ejecutan el historial y los escenarios controlados del widget.

Pasaron las **24 pruebas Vitest**, la compilación TypeScript/Vite y los recorridos E2, E3 y E4 en Chrome. Las regresiones incluyen el límite de año, el 29 de febrero, intervalos inválidos, contadores desconocidos, snapshot eliminado, red ajena, reintento de la misma página y enlaces OAI/portal con configuración opcional. Chart.js se carga al abrir la pestaña del gráfico. El build emitió el aviso previo de Vite para el archivo principal (221 kB gzip); el gráfico ocupa otros 58 kB gzip. [Pruebas de historial](../../../web/tests/history.test.ts) · [Pruebas de la pantalla de cosechas](../../../web/tests/harvestHistory.test.tsx) · [Pruebas de estadísticas](../../../web/tests/statistics.test.tsx)
