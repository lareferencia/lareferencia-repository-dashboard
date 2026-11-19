# E3 · Diagnóstico de validación de AREANDINA #6

El 19 de noviembre de 2026 se probó el candidato React en Chrome con la cuenta `dashboard`, red autorizada 33, por el gateway Docker. La tabla, la ficha del registro y las frecuencias de Language coinciden con E0. También se compararon las exportaciones descargadas del navegador y se consultó una copia de la SQLite del snapshot. [Referencia Angular E0](../e0-areandina-6/README.md) · [Traza HTTP de React](http.tsv) · [Control SQLite](sqlite.json)

## Comparación funcional

| Caso | Resultado en React | Contraste con E0 |
|---|---|---|
| V01 · Resumen | 4.000 registros, 0 válidos globales, 0 transformados, 14 reglas. Language es opcional y su conformidad es 46,775 %. | Coinciden los contadores del snapshot y el porcentaje por regla. |
| V02 · Filtros de registros | Aprobar la regla 5 selecciona 1.871 registros. Fallarla selecciona 2.129. Exigir ambos resultados devuelve 0. Exigir que se aprueben las reglas 1 y 5 devuelve 1.871. | Se conservan los totales y la conjunción de filtros. El título indica el número de registros seleccionados. |
| V02 · Frecuencias de la regla 5 | 1.874 ocurrencias válidas en cuatro valores y 2.449 inválidas en cinco. `spa` aparece 1.869 veces, `es` aparece 2.274. El marcador histórico de ausencia tiene 169 apariciones y se muestra como «Campo ausente». | Coinciden todas las frecuencias con E0. El CSV conserva el valor original `no_occurrences_found`. |
| V02 · Alcance de las frecuencias | Con «aprueba regla 5» en la URL, el detalle de la regla 10 muestra 1.312 ocurrencias válidas y 8.659 inválidas. | Las 9.971 pertenecen al snapshot completo. La copia SQLite cuenta 7.623 dentro de la selección. React indica el alcance global en el diálogo. |
| V04 · Navegación | Segunda página, recarga, búsqueda parcial de `areandina/1000` con Enter y Atrás. La búsqueda devuelve una fila desde la primera página y Atrás recupera la segunda página filtrada. Cambiar el tamaño a 25 muestra 25 registros. | Angular conservaba los filtros en la pantalla. React los incluye en el favorito junto con la página y el tamaño. La antigua ruta `/invalid_rule/5` y el enlace de la tabla llevan a los mismos 2.129 fallos. |
| V04 · Estado global y transformación | Globalmente válido devuelve 0 e inválido devuelve 4.000. Dentro de los inválidos, transformado devuelve 0 y sin transformar devuelve 4.000. | La API recibe los valores `false` explícitos. Las tarjetas continúan mostrando las cifras globales. |
| V05 · Ficha y enlace OAI | La primera fila aprobada es `oai:digitk.areandina.edu.co:areandina/1000`. En los resultados aprobados, Language muestra `ONE_OR_MORE`, `spa` como ocurrencia válida y `es` como inválida. El enlace GetRecord contiene el identificador completo. | La ficha conserva ambos valores y agrupa los fallos obligatorios y opcionales. La prueba leyó la URL generada del proveedor. El servicio remoto del proveedor y el portal público quedaron fuera de la prueba. |

[Registros que fallan Language](fallos.png) · [Ficha con varias ocurrencias](ficha.png) · [Frecuencias de Language](frecuencias.png)

## Archivos descargados

| Exportación | Verificación realizada sobre el archivo |
|---|---|
| [Reglas obligatorias](reglas-obligatorias.csv) | Seis filas de datos, IDs 1, 7, 9, 10, 13 y 14. Coinciden con las seis reglas visibles. Angular exportaba 14 al seleccionar obligatorias. |
| [Aprueban la regla 5](registros-aprueban-5.csv) y [fallan la regla 5](registros-fallan-5.csv) | Diez filas por archivo. Se compararon con E0 el orden, ID interno, identificador OAI, validez y transformación. Las cuatro cabeceras corresponden a los cuatro campos. El CSV general de Angular declaraba tres. |
| [Valores válidos de Language](5-valid.csv) y [valores inválidos](5-invalid.csv) | Cuatro y cinco filas, respectivamente. Se compararon todos los valores y sus cantidades. |
| [Valores inválidos de la regla 10](10-invalid.csv) | 48 valores y suma de 8.659 ocurrencias. La primera página visual muestra diez. La exportación incluye el grupo completo. |

## Reproducción

Se utilizó el contenedor candidato preparado en E2. Sirve `web/dist` y reenvía la API al Nginx de Compose, preservando el host `dashboard.localhost`. En esta ejecución el puerto React fue 62241 y Angular siguió en el gateway 8188. El SHA-256 de `/dashboard/es/main.js` de Angular coincide con E0 y E2, `1ef70d67f8de04dd0641c3467be5ba9701b2459983213a69feea4368841fcb15`. [Montaje Docker reproducible](../e2-react/README.md)

Desde la raíz del dashboard, con Python Playwright y Google Chrome disponibles, ejecutar los siguientes comandos. El script solicita la contraseña por terminal y escribe capturas, CSV y una traza de método, ruta y estado en el directorio elegido.

```sh
(cd web && npm ci && npm test && npm run build)
puerto=$(docker port lr-e2-dashboard-candidato 8080/tcp | cut -d: -f2)
python3 web/tests/gateway/validation.py "http://dashboard.localhost:$puerto" /tmp/lr-e3-evidencias
```

Pasaron los 16 casos de Vitest y los recorridos Playwright de E2 y E3. Entre los casos con respuestas controladas están un 503 de registros con reintento conservando el resumen, una respuesta anterior que llega después de cambiar el filtro, una regla sin definición ni valores guardados y la recuperación de un grupo de frecuencias sin perder el otro. La prueba de CSV incluye acentos, comillas, separador y salto de línea en una celda. La compilación TypeScript/Vite generó las tres entradas de idioma. Vite emitió su aviso de tamaño para el archivo principal, de 216 kB gzip. La prueba de navegador usó la interfaz en español. [Recorrido por gateway](../../../web/tests/gateway/validation.py) · [Regresiones de componentes](../../../web/tests/bootstrap.test.tsx) · [Pruebas de CSV, filtros y GetRecord](../../../web/tests/validation.test.ts)

Para el control SQL se copió `data/AREANDINA/snapshots/snapshot_6/validation/validation.db` a un directorio temporal. En la ejecución el snapshot carecía de WAL. `PRAGMA integrity_check` devolvió `ok`. Para reproducir los totales sobre la copia se ejecutaron estas consultas:

```sql
SELECT COUNT(*), SUM(is_valid), SUM(is_transformed), SUM(rule_5=1), SUM(rule_5=0)
FROM record_validation WHERE deleted=0;

SELECT o.rule_id, o.is_valid, COUNT(*), COUNT(DISTINCT occurrence_value)
FROM rule_occurrences o JOIN record_validation r USING(identifier_hash)
WHERE r.deleted=0 AND rule_id IN (5,10)
GROUP BY o.rule_id, o.is_valid ORDER BY o.rule_id, o.is_valid;

SELECT COUNT(*) FROM rule_occurrences o JOIN record_validation r USING(identifier_hash)
WHERE r.deleted=0 AND rule_5=1 AND rule_id=10;
```

## Organización del código

El cliente v5 concentra las lecturas autorizadas. Los componentes del informe comparten la normalización de filtros y el escritor CSV. La ficha recibe la fila ya cargada. El diálogo de frecuencias solicita cada grupo al abrirse. Se tomó como referencia el tratamiento de resultados históricos del admin en `5dacfdb`. La API de lectura del dashboard determina el alcance de cada consulta. [Código del diagnóstico React](../../../web/src/features/validation/) · [Referencia del admin](https://github.com/lareferencia/lareferencia-lrharvester-admin-web/blob/5dacfdb94b4dbc2a1fb37c1a988f2ee14b114bf8/src/features/diagnostics/DiagnosticsPage.tsx)
