# E0 · Referencia Angular de AREANDINA, snapshot 6

El 19 de noviembre de 2026 se recorrió el dashboard Angular en Chrome por `http://dashboard.localhost:8188/dashboard/es/`, con el usuario humano `dashboard`, rol DASHBOARD y red autorizada 33. **El snapshot tiene 4.000 registros activos, ninguno válido globalmente y ninguno transformado. La regla opcional 5, Language, la aprueban 1.871 y la fallan 2.129.** Son referencias para aceptar la migración a React. La ficha y los valores de la regla muestran por qué una aprobación individual puede coexistir con un registro inválido.

## Procedencia y reproducción

Se utilizó la instalación local en ejecución, proyecto Compose `lareferencia-dev`, modo isolated. Se navegó en español con un contexto nuevo y viewport de 1440 × 1000. Se consultaron datos y se descargaron CSV sin editar registros ni reglas. El control independiente de cifras se ejecutó sobre una copia temporal de la SQLite del snapshot y su WAL cuando estaba presente.

Checkout durante la prueba: plataforma `6f84b51`, dashboard `13abe1b`, harvester `d919a07`, core `0c52e97`. Huella SHA-256 del JavaScript servido en `/dashboard/es/main.js`: `1ef70d67f8de04dd0641c3467be5ba9701b2459983213a69feea4368841fcb15`. La huella identifica el bundle realmente probado. Las revisiones corresponden al disco del equipo.

Para repetir, ejecutar el sondeo del skill `lareferencia-docker-dev`, entrar por la URL completa del gateway y seguir las filas de la tabla. La [traza del navegador](http-angular.tsv) conserva método, ruta y estado en orden de recepción. Se excluyeron cookies, cabeceras, cuerpos de sesión y contraseñas. Los [controles de API](controles.json) se solicitaron con la misma sesión mediante Playwright, independientemente de las peticiones generadas por la interfaz. Incluyen las 14 reglas. En las claves de filtros, los tres números son estado HTTP, total y tamaño de la página recibida.

## Recorrido visible y llamadas

Las rutas de pantalla son relativas a `/dashboard/es/`. Para las consultas, H equivale a `/api/v5/dashboard/harvesting/source/AREANDINA` y V a `/api/v5/dashboard/validation/source/AREANDINA/6`.

| Pantalla y acción en Chrome | Resultado observado | Evidencia |
|---|---|---|
| Abrir la raíz sin sesión, iniciar sesión | GET me → 401. GET auth/csrf → 200 y POST auth/login → 200. Portada con la fuente «Repositorio Institucional Fundación Universitaria del Área Andina» y servicios de cosecha y validación. | [Login vacío](01-login.png) · [Portada](02-portada.png) |
| Abrir Cuenta | La ruta termina en `user/profile`. Muestra usuario dashboard, rol DASHBOARD y repositorio 33. La consulta autenticada a la lista devuelve una sola fuente. | [Perfil](03-perfil.png) |
| Abrir `AREANDINA/harvesting` y pulsar Tabla | El gráfico pide H/history/{desde}/{hasta} con `size=8` para dos años; el texto de ayuda habla de grupos de diez. La tabla muestra una fila, ID 6, cosechados 4.000, válidos 0, inválidos 4.000 y transformados 0. Inicio y fin mostrados: 4/10/26 18:01 y 18:16. | [Gráfico](04-historial.png) · [Tabla](04b-tabla.png) |
| Abrir `AREANDINA/validation/6` | GET V → 200. Tarjetas 4.000 / 0 / 4.000. La tabla separa conformidad, aprobaciones y acceso al detalle. Language indica «No» en obligatoriedad y 46,775 % de conformidad. La regla 1, Publication Date (M), aprueba los 4.000. | [Informe](05-informe.png) |
| Pulsar Detalles en Language | GET V/valid_occrs/5 y V/invalid_occrs/5 → 200. Se muestran dos tablas con valores y cantidades. El diálogo muestra literalmente el marcador histórico `no_occurrences_found`. | [Frecuencias](06-ocurrencias.png) |
| Abrir Registros y seleccionar Language en reglas aprobadas | Se emite GET V/records con `valid_rules=5&pageNumber=0&pageSize=10`. El paginador muestra 188 páginas; las tarjetas siguen en 4.000 / 0 / 4.000. La URL de la pantalla permanece idéntica. | [Antes](07-registros.png) · [Después](07b-filtro.png) |
| Abrir Detalles en la primera fila filtrada | La ficha de `oai:digitk.areandina.edu.co:areandina/1000` presenta fallos obligatorios, fallos opcionales y reglas válidas. Language contiene «es» y «spa»; la regla ONE_OR_MORE figura aprobada. La traza permite comprobar que la ficha se compone con los datos de la fila. | [Ficha](08-ficha.png) |
| Abrir el enlace profundo `AREANDINA/validation/6/invalid_rule/5` | GET V y GET V/records con `invalid_rules=5` → 200. La tabla muestra 213 páginas de diez y permite descargar la página actual. | [Fallos por regla](09-fallos.png) |
| Abrir `statistics` | La configuración tiene `historic_module` y `validation_module` activos y `statistics_module` desactivado. La navegación directa regresa a portada. | [Destino observado](10-estadisticas.png) |

Además, la sesión DASHBOARD obtuvo 403 al consultar la fuente PA. Después de pulsar Logout, la lectura de me devolvió 401.

## Cifras que React debe poder explicar

| Consulta de control | Resultado en la copia |
|---|---:|
| Registros que aprueban / fallan la regla 5 | 1.871 / 2.129 |
| Globalmente válidos / inválidos | 0 / 4.000 |
| Transformados; simultáneamente aprueba y falla la regla 5 | 0 en ambas consultas |
| Ocurrencias válidas de Language | 1.874 en cuatro valores: spa × 1.869, eng × 3, por × 1, ita × 1 |
| Ocurrencias inválidas de Language | 2.449 en cinco valores: es × 2.274, marcador de ausencia × 169, en × 4, de × 1, Spanish × 1 |
| Ocurrencias globales de regla 10 | 1.312 válidas + 8.659 inválidas = 9.971 |
| Ocurrencias de regla 10 solo en quienes aprueban la regla 5 | 7.623, calculadas por SQL. Las lecturas Angular de frecuencias son globales. |

El control SQLite devolvió `ok` en `PRAGMA integrity_check`. Para reproducir las dos comparaciones principales:

```sql
SELECT COUNT(*), SUM(is_valid), SUM(is_transformed),
       SUM(rule_5 = 1), SUM(rule_5 = 0)
FROM record_validation WHERE deleted = 0;

SELECT COUNT(*)
FROM rule_occurrences o JOIN record_validation v USING (identifier_hash)
WHERE v.deleted = 0 AND v.rule_5 = 1 AND o.rule_id = 10;
```

## Exportación y criterios de paridad

- **Reglas obligatorias.** Al seleccionar «Mandatory» quedaron seis reglas visibles. El [CSV descargado](reglas-obligatorias.csv) contiene las 14, incluidas las opcionales. Seleccionar la opción en español también dejó visible la etiqueta inglesa. [Pantalla filtrada](11-reglas.png)
- **Tabla general filtrada.** El [CSV de aprobados](registros-aprueban-5.csv) contiene las diez filas de la página; su cabecera declara tres campos y cada fila tiene cuatro. React debe anunciar el alcance y exportar una cabecera por columna.
- **Ruta de fallos.** El [CSV de fallos](registros-fallan-5.csv) contiene diez filas y cuatro cabeceras, incluida Transformed. Comparar los identificadores de cada página además del total.
- **Alcance de filtros.** Para reproducir Angular, etiquetar por separado total del snapshot y registros seleccionados. Si se aprueba resumen o frecuencia filtrada, la comparación de referencia para la regla 10 es 7.623 dentro de la selección y 9.971 en el snapshot.
- **Detalle histórico.** La API informa captura desconocida para Language y devuelve valores reales. Conservar los valores existentes y explicar el marcador de ausencia. Los números de ocurrencias pueden superar los de registros.

Esta evidencia cubre la sesión DASHBOARD en español, el informe #6 con detalle disponible y la instalación con widget desactivado. Para cerrar la etapa E0 general quedan la fuente sin cosecha válida, el histórico con evidencia parcial y la configuración representativa del widget y del portal. Las decisiones sobre indicadores filtrados y descargas de toda la selección siguen abiertas. [Plan de migración](../../../PLAN_MIGRACION_REACT.md)
