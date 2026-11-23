# Uruguay · Estadísticas de uso

El 21 de noviembre de 2026, el dashboard React `6dd2b30` mostró las mismas vistas y descargas que el proveedor para Nodo Uruguay. La comparación usa las tarjetas de la pestaña **General**, con **Eventos totales** seleccionado y el período **diciembre de 2025 – junio de 2026**. [Captura del widget](widget.png) · [Respuesta de la consulta independiente](proveedor.json)

| Indicador | Widget | Proveedor | Diferencia |
| --- | ---: | ---: | ---: |
| Vistas | 532.454 | 532.454 | 0 |
| Descargas | 84.344 | 84.344 | 0 |

## Cómo se comprobó

1. Se abrió `http://dashboard.localhost:53190/dashboard/es/UY/statistics` en Chrome, con idioma español, zona `Europe/Madrid` y una sesión de administrador en la copia Docker. La API v5 de la copia devolvió `acronym=UY` y `attributes.stats_source_id=SITEID::58`. Como el módulo estaba desactivado, se cambió solo `statistics_module.active` en la configuración recibida por ese navegador. Tanto los datos de la fuente como las consultas de LRHW 1.1.6 fueron reales.
2. Se seleccionaron los meses inicial y final, se pulsó actualizar y se leyeron las dos tarjetas tras recibir la respuesta. La petición del widget usó los límites UTC que figuran abajo. El extremo final corresponde a las **00:00 del 30 de junio** en Madrid. Una consulta de control hasta las 23:59:59.999 de ese día devolvió los mismos dos totales.
3. Desde otra conexión, sin sesión del dashboard, se consultó directamente al proveedor con los parámetros observados. Respondió HTTP 200. Se compararon las tarjetas con `views.value` y `downloads.value`. Como control de ámbito, la suma de los niveles L, N y R también dio los dos totales. El nivel R por sí solo tenía 118.589 vistas y 84.295 descargas.

Para repetir la lectura del proveedor con los límites exactos del widget:

```sh
curl -q -fsS --get 'https://stats.lareferencia.info/api/usage_stats/v2/report/repositoryWidget' \
  --data-urlencode 'source_id=SITEID::58' \
  --data-urlencode 'start_date=2025-11-30T23:00:00.000Z' \
  --data-urlencode 'end_date=2026-06-29T22:00:00.000Z' \
  --data-urlencode 'time_unit=day' \
  --data-urlencode 'limit=10' |
  jq '{vistas: .views.value, descargas: .downloads.value}'
```
