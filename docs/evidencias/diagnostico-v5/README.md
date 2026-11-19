# Diagnóstico filtrado y XML histórico de AREANDINA #6

El 19 de noviembre de 2026 se probó el paquete React por el gateway de la copia Docker de E5. Chrome inició sesión como `dashboard`. La respuesta de `/api/v5/me` confirmó el rol DASHBOARD y la red asignada 33 (AREANDINA). [Abrir el informe en la copia](http://dashboard.localhost:64065/dashboard/es/AREANDINA/validation/6)

## Selección de registros

Los filtros de validez, transformación, reglas aprobadas/fallidas e identificador se envían al servidor para calcular las tarjetas, el cumplimiento por regla, la tabla y las dos distribuciones de ocurrencias. El paginado solo modifica la tabla. Los indicadores H/V/T de la cabecera describen la cosecha completa. El enlace desde el número de fallos añade la regla a la selección existente. El favorito histórico `/invalid_rule/5` abre los 2.129 fallos de Language.

| Selección sobre la regla 5 | Resumen y registros | Registros que aprueban / fallan la regla 10 | Ocurrencias válidas / inválidas de la regla 10 |
|---|---:|---:|---:|
| Todo el snapshot | 4.000 | 1.312 / 2.688 | 1.312 / 8.659 |
| Aprueban Language | 1.871 | 1.309 / 562 | 1.309 / 6.314 |
| Fallan Language | 2.129 | 3 / 2.126 | 3 / 2.345 |
| Aprueban y fallan Language | 0 | 0 / 0 | 0 / 0 |

El test consultó resumen, registros y ambos grupos de frecuencias por el gateway para las cuatro selecciones. En la interfaz comprobó los valores de Language, combinó reglas, buscó un identificador, paginó, recargó la URL y exportó las ocurrencias de la regla 10 desde la segunda página de registros. Los 41 pares valor/frecuencia del CSV de inválidas coincidieron individualmente con SQLite. Un registro puede aportar varias ocurrencias. [Resultados HTTP por selección](selecciones.tsv) · [Traza del navegador](http.tsv) · [Informe filtrado](seleccion.png) · [Detalle de la regla 10](frecuencias-seleccion.png) · [CSV descargado](10-invalid.csv)

## XML y permisos

En el detalle de `oai:digitk.areandina.edu.co:areandina/1000`, la pestaña **XML histórico** solicitó el documento conservado bajo el hash de publicación `48B461B29669DD2D`. La búsqueda literal de `<FIELD` resaltó 42 coincidencias y permitió avanzar y retroceder. La búsqueda de `[.*]` devolvió cero. Chrome comparó el texto visible y el portapapeles con la respuesta de la API, y los bytes de la descarga con ese texto codificado en UTF-8. El archivo comprimido de la copia, una vez descomprimido, tenía los mismos 5.816 bytes y SHA-256 `bce42125240154c1e75a8a06f584ae7352cf14a81767765f791cf598d31a8b43`. [Visor y controles](xml.png)

| Petición por el host dashboard | HTTP |
|---|---:|
| XML con identificador completo en AREANDINA #6 | 200 |
| Resumen, ambos grupos de frecuencias y XML en PA #4 | 403 |
| XML del snapshot permitido #6 con acrónimo PA | 404 |
| XML solicitado con solo el prefijo de un identificador existente | 404 |
| XML solicitado con identificador vacío | 400 |
| Ruta nativa del admin desde el gateway dashboard | 404 |
| XML en AREANDINA #6 después de cerrar sesión | 401 |

La prueba de Spring con SQLite temporal cubre además diferencias de mayúsculas, identificador omitido, registro eliminado con hash conservado y registro activo sin hash. React cubre la carga al abrir la pestaña, el reintento de una lectura fallida y el aviso para XML histórico ausente. La exposición de logs por red sigue pendiente de una decisión independiente. [Controles de acceso](permisos.tsv)

## Reproducción

Desde el repositorio del dashboard, con la copia E5 levantada, Chrome y Playwright para Python instalados, ejecutar el recorrido. El script solicita la contraseña por terminal y guarda capturas, descargas CSV y trazas de rutas y estados HTTP.

```sh
python3 web/tests/gateway/validation.py http://dashboard.localhost:64065 "$(mktemp -d)"
```

Para contrastar el CSV en una copia estática de `AREANDINA/snapshots/snapshot_6/validation/validation.db`, agrupar las filas activas con la misma selección.

```sql
SELECT o.occurrence_value, COUNT(*) AS frecuencia
FROM record_validation r JOIN rule_occurrences o USING (identifier_hash)
WHERE r.deleted = 0 AND r.rule_5 = 1 AND o.rule_id = 10 AND o.is_valid = 0
GROUP BY o.occurrence_value ORDER BY frecuencia DESC, o.occurrence_value;
```

Para contrastar la descarga desde la raíz de datos copiados, consultar primero el hash en SQLite y calcular el SHA-256 del documento descomprimido.

```sql
SELECT published_metadata_hash FROM record_validation
WHERE deleted = 0 AND identifier = 'oai:digitk.areandina.edu.co:areandina/1000';
```

```sh
gzip -cd AREANDINA/metadata/4/8/B/48B461B29669DD2D.xml.gz | shasum -a 256
```

Maven empaquetó el harvester y el ZIP con el perfil `dashboard-react` en el reactor de la copia. Se ejecutaron 54 pruebas `ApiV5*Test`, incluidas las de SQLite real y la de etiquetas sobre un PostgreSQL 14 desechable. Pasaron las 54, el chequeo de TypeScript y las 25 pruebas de Vitest. El gateway de la copia sirvió los artefactos siguientes.

| Artefacto | SHA-256 |
|---|---|
| JAR harvester | `15e6f7bd2a9b12657039d7537a203f767a1f85d4c06e58f1d8c582d65503717f` |
| ZIP React | `43efc044ca81f06b943998d56c0a7445fd53da0fb0fbb142e102d3bf147d2188` |

La instalación habitual en 8190 siguió sirviendo el `main.js` Angular de E0 y E5, con SHA-256 `1ef70d67f8de04dd0641c3467be5ba9701b2459983213a69feea4368841fcb15`. [Preparación de la copia y reversión](../e5-react/README.md) · [Prueba de navegador](../../../web/tests/gateway/validation.py)
