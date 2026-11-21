# E2 · Login, repositorios e informe de AREANDINA en React

El 19 de noviembre de 2026 se probó en Chrome la aplicación React de producción con la cuenta local `dashboard`. El selector ofreció únicamente AREANDINA. Desde **Validaciones** se abrió el último snapshot válido, el 6, y desde su tabla la regla **#5 Language**. La recarga del favorito y los botones Atrás y Adelante conservaron el comportamiento esperado. [Selector](selector.png) · [Detalle de la regla tras recargar](regla-5.png) · [Solicitudes y estados HTTP](http.tsv)

## Resultado frente al control Angular

| Medida | Angular E0 | React por el gateway |
|---|---:|---:|
| Red autorizada / snapshot | 33 / 6 | 33 / 6 |
| Registros | 4.000 | 4.000 |
| Válidos globales / transformados | 0 / 0 | 0 / 0 |
| Reglas del informe | 14 | 14 |
| Aprueban la regla 5 | 1.871 | 1.871 |
| Fallan la regla 5 | 2.129 | 2.129 |

La regla 5 evalúa `dc:language`, figura como opcional y tiene cuantificador `ONE_OR_MORE`. Las dos cifras de la regla suman los 4.000 registros del snapshot. La referencia Angular incluye el contraste previo con una copia de SQLite. En E2 se contrastó la respuesta HTTP de la instalación con esa referencia y se leyeron ambas cifras en la interfaz React. [Resultados de E0](../e0-areandina-6/README.md) · [Control de las 14 reglas](../e0-areandina-6/controles.json)

## Recorrido y permisos

Se utilizó un contexto de Chrome nuevo, idioma español y ventana de 1440 × 1000. El contenedor candidato sirve los archivos de React bajo `/dashboard/` y envía todas las peticiones `/api/v5/` al gateway del proyecto Compose `lareferencia-dev`, con el host `dashboard.localhost`. El log de ese gateway registró la lectura del informe. El puerto del candidato en esta ejecución fue 62241 y el de Angular por el gateway, 8188. La huella SHA-256 del JavaScript Angular servido siguió coincidiendo con E0: `1ef70d67f8de04dd0641c3467be5ba9701b2459983213a69feea4368841fcb15`. [Configuración del candidato](../../../web/tests/gateway/candidate.conf)

| Acción | Resultado comprobado |
|---|---|
| Entrar sin sesión y enviar el formulario | `GET /me` devolvió 401. La obtención de CSRF y el login devolvieron 200. |
| Consultar identidad y abrir el selector | La sesión indicó rol DASHBOARD y red legible 33. La lista paginada y el detalle de AREANDINA devolvieron 200. |
| Entrar en Validaciones | La consulta `/lkg` resolvió el snapshot 6. Su informe respondió 200. |
| Abrir la regla y recargar | El favorito termina en `/dashboard/es/AREANDINA/validation/6?rule=5`. React restauró la sesión y abrió la misma regla. Atrás volvió a la tabla y Adelante reabrió el detalle. |
| Consultar PA y la ruta administrativa con la misma sesión | El detalle de la fuente PA respondió 403. El host de dashboard respondió 404 a `/api/v5/networks`. |
| Cerrar sesión | La petición de logout con CSRF respondió 204. React mostró el formulario y un GET posterior a `/me` devolvió 401. |

La [traza](http.tsv) incluye las solicitudes de la página y los controles explícitos de Playwright con sus cookies de sesión compartidas. El archivo conserva método, ruta y estado. El listado se solicitó con `page=0&size=100`.

## Repetir la prueba

Con el Docker de desarrollo activo, ejecutar desde la raíz del repositorio del dashboard. El nombre de contenedor del ejemplo es nuevo y Docker asigna un puerto de loopback disponible. Los únicos directorios de la aplicación montados en el candidato son los estáticos compilados y su configuración Nginx, en modo lectura.

```sh
(cd web && npm ci && npm test && npm run build)
docker run -d --rm --name lr-e2-repeticion --network lareferencia-dev-network \
  -p 127.0.0.1::8080 \
  -v "$PWD/web/dist:/usr/share/nginx/html/dashboard:ro" \
  -v "$PWD/web/tests/gateway/candidate.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:stable-alpine
puerto=$(docker port lr-e2-repeticion 8080/tcp | cut -d: -f2)
python3 web/tests/gateway/verify.py "http://dashboard.localhost:$puerto" /tmp/lr-e2-evidencias
docker stop lr-e2-repeticion
```

El script requiere Playwright para Python, Google Chrome y la copia con la asignación y los datos de E0. Solicita la contraseña por terminal y también admite la variable de entorno `DASHBOARD_TEST_PASSWORD`. Produce dos capturas y la traza al completar las aserciones. [Prueba reproducible](../../../web/tests/gateway/verify.py)

Pasaron los ocho casos de Vitest. Cubren retorno al favorito tras login, acrónimo ajeno, usuario sin redes, reintento de configuración, paginación de redes, sesión expirada, rol READER y respuesta incompleta de una regla. TypeScript y Vite compilaron las entradas ES, EN y PT. El chunk principal fue de 648,65 kB minificados y 204,41 kB gzip, con aviso de tamaño de Vite. La aceptación en navegador se realizó en español y con la cuenta DASHBOARD. Los filtros de registros, ocurrencias y CSV corresponden a E3. [Pruebas de sesión](../../../web/tests/session.test.tsx) · [Pruebas del directorio](../../../web/tests/repositories.test.tsx)
