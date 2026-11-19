# Comparar la evolución de las cosechas

Pruebas de aceptación en la copia Docker, 19 de noviembre de 2026. Se comprobó el historial de AREANDINA con la cuenta `dashboard` y el de PA con la cuenta `developer`. [Abrir AREANDINA](http://dashboard.localhost:64065/dashboard/es/AREANDINA/harvesting) · [Abrir PA](http://dashboard.localhost:64065/dashboard/es/PA/harvesting?from=2026-10-03&to=2026-10-04)

## Cómo leer la vista

En **Evolución**, la cosecha más reciente de la página se compara inicialmente con la anterior. **Referencia** y **Comparar con** permiten elegir otro par. Cada indicador muestra el valor de la segunda cosecha, su diferencia con la primera y el valor de referencia. La diferencia entre tasas se expresa en puntos porcentuales. Si falta un dato o el denominador es cero, se muestra un guion.

El gráfico permite alternar entre volumen, tasa de validez y duración en minutos. En volumen, las barras apilan válidos e inválidos. La línea de transformados se representa por separado porque esas transformaciones pueden corresponder a registros ya contabilizados. Cada página del gráfico contiene hasta ocho cosechas en orden cronológico. Al visitar otra página, sus cosechas quedan disponibles en los selectores del mismo repositorio e intervalo. Cambiar el intervalo reinicia la comparación.

## AREANDINA con datos de la copia

| Comprobación en Chrome | Resultado |
| --- | --- |
| Filtrar desde el 4 de octubre de 2026 hasta ese mismo día | La API devuelve únicamente la cosecha **#6**. La pantalla presenta la distribución de esa ejecución. |
| Contrastar indicadores y tabla con el JSON | 4000 cosechados, 0 válidos, 4000 inválidos por diferencia y 0 transformados. Tasa de validez del 0 %. |
| Contrastar fechas y duración | De 18:01:30.585652 a 18:16:07.433160 UTC. En el navegador configurado en Madrid se muestran las 20:01 y las 20:16. La duración redondeada al segundo es de 14 min 37 s. |
| Abrir el diagnóstico y volver | Se abre el informe #6 con la regla #5 Language. Al volver se conserva el intervalo. |
| Consultar el 5 de octubre y restablecer | Se muestra el estado vacío y se recupera el historial al restablecer el intervalo. |
| Ordenar la tabla y descargar CSV | La API recibe la ordenación por volumen. El CSV contiene las siete columnas históricas y las cifras y fechas originales de #6. |
| Abrir en móvil a 390 px de ancho | Los indicadores se distribuyen en dos columnas. El intervalo se puede desplegar y la tabla admite desplazamiento horizontal dentro de su panel. |

[Antes del cambio](antes.png) · [Evolución con #6](grafico.png) · [Móvil](movil.png) · [Tabla](tabla.png) · [Respuesta de la API](snapshot.json) · [Consultas HTTP reales](http.tsv) · [CSV descargado](historial.csv)

## PA con tres cosechas reales

En Chrome se abrió **PA · Nodo Panama** por el gateway de la copia y se filtró del 3 al 4 de octubre de 2026, ambos inclusive. Se utilizó la cuenta `developer` con su rol ADMIN existente. La asignación de la cuenta `dashboard` cubre únicamente AREANDINA. El dashboard consultó el historial real y recibió las cosechas #4, #3 y #1. El gráfico y la tabla de Evolución las presentaron de la más antigua a la más reciente.

Se eligió **#1** en **Referencia** con **#4** en **Comparar con**. La prueba recalculó las cuatro diferencias a partir de la respuesta HTTP y comprobó el valor de destino, el de referencia y su diferencia en cada tarjeta. También cotejó la fila de cada ejecución con los totales de la API. La lectura independiente de PostgreSQL confirmó tamaños y marcas de tiempo de las tres. [Respuesta JSON](pa/historial-api.json) · [Texto de las tarjetas y diferencias calculadas](pa/comparacion.tsv) · [Consulta a PostgreSQL](pa/postgres.tsv)

| Indicador | #1 · 3 oct | #4 · 4 oct | Diferencia #4 − #1 |
| --- | ---: | ---: | ---: |
| Cosechados | 25.400 | 3444 | −21.956 |
| Válidos | 25.400 | 3444 | −21.956 |
| Tasa de validez | 100 % | 100 % | 0 puntos porcentuales |
| Transformados | 0 | 0 | 0 |
| Duración, redondeada al segundo | 4 min 24 s | 1 h 29 min 40 s | +1 h 25 min 16 s |

La pantalla muestra horas y minutos para duraciones de al menos una hora. Por eso la tarjeta de #4 muestra **1 h 29 min** y la diferencia **+1 h 25 min**. El gráfico también permite distinguir las ejecuciones #3 y #4: ambas tienen 3444 registros válidos, pero #3 duró 14 h 9 min 42 s. [Captura de volumen](pa/volumen.png) · [Captura de duración](pa/duracion.png)

La solicitud de la interfaz obtuvo HTTP 200. Se puede repetir con Chrome y Playwright desde `web/`. El script solicita la contraseña por terminal y guarda la respuesta real, los resultados de las aserciones y ambas capturas en el directorio indicado. [Prueba de aceptación](../../../web/tests/gateway/history_pa.py)

```sh
python3 tests/gateway/history_pa.py /tmp/prueba-historial-pa
```

```http
GET /api/v5/dashboard/harvesting/source/PA/history/2026-10-03/2026-10-04?page=0&size=8&sort=endTime%2Cdesc&sort=id%2Cdesc
```

## Comparación entre páginas con datos simulados

AREANDINA contiene una sola cosecha visible. Para verificar tendencias y paginación, Playwright sustituyó únicamente la respuesta de historial en ese navegador por nueve ejecuciones identificadas del #1 al #9. El acceso fue por el mismo gateway. La base de la copia conservó sus datos.

- En la primera página se muestran cronológicamente las cosechas #2 a #9. Al elegir #2 como referencia y #9 como destino, la tasa pasa del 20 % al 90 % y muestra **+70 puntos porcentuales**.
- El selector de indicador cambia entre el volumen con transformados, la tasa y la duración. En la segunda página, cambiar el destino a #1 mantiene la referencia #2 y muestra **−10 puntos porcentuales**. La selección explícita se conserva al alternar entre Tabla y Evolución.

[Volumen con datos simulados](grafico-simulado.png) · [Comparación #2 y #9 con datos simulados](comparacion-simulada.png)

## Reproducción

Con la copia Docker sirviendo el paquete Maven del dashboard React y Chrome disponible, ejecutar desde el directorio `web/` con Node 22 y el módulo Python `playwright` instalado. La prueba solicita la contraseña de la cuenta por terminal.

```sh
npm run typecheck
TZ=Europe/Madrid npm test
python3 tests/gateway/history.py http://dashboard.localhost:64065 /tmp/prueba-historial
```

El perfil Maven empleado para el paquete fue `dashboard-react`. La instalación habitual en el puerto 8190 sirve el bundle Angular cuyo SHA-256 verificado es `1ef70d67f8de04dd0641c3467be5ba9701b2459983213a69feea4368841fcb15`.
