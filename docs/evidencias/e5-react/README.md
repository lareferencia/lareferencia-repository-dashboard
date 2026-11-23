# E5 · Empaquetado Maven y ensayo de reversión

El perfil Maven `dashboard-react` usa Node 22.14.0, npm 10.9.2 y el lock de web. Deja el bundle en target/react-static y adjunta un ZIP con clasificador react. El build por defecto sigue compilando Angular. Desde la plataforma:

```sh
mvn -pl lareferencia-repository-dashboard -Pdashboard-react package
```

El 19 de noviembre de 2026 se empaquetó el módulo desde una copia limpia de sus fuentes y se compiló Spring con sus dependencias en un reactor temporal. El ensayo usó una red Docker interna, PostgreSQL 14 restaurado con pg_dump/pg_restore y copias de config, datos y SQLite de Docker. Se desactivaron las 112 programaciones en la base copiada. El harvester utilizó la configuración efectiva de desarrollo, los dos datasources de la copia y el ZIP extraído como dashboard-static. Solo el gateway publicó un puerto de loopback (64065). El sitio Angular original conservó su bundle.

Pasaron los recorridos E2, E3 y E4 en Chrome. AREANDINA #6 devolvió 4.000 registros, 1.871 aprobaciones y 2.129 fallos de Language. PA respondió 403 y la ruta administrativa 404. Se comprobó HTML localizado y JavaScript con MIME correcto en ES, EN y PT, configuración por idioma y acceso directo a estadísticas, cosechas, informe, cuenta y login. Spring necesitó un forward para estadísticas por acrónimo y el gateway una redirección relativa para preservar el puerto publicado. [Traza](react-http.tsv) · [Rutas](rutas.tsv)

## Volver a Angular

Antes de cambiar un sitio, guardar **el árbol Angular completo**, incluidas sus tres configuraciones locales. Extraer el ZIP React en otro directorio vacío y aplicar allí la configuración propia de cada idioma. Apuntar `frontend.dashboard-static-directory` (o el montaje Docker correspondiente) a ese árbol. Para revertir, seleccionar de nuevo el árbol Angular guardado y recrear únicamente el harvester de esa instalación si cambió el montaje. Conservar la base y el gateway. Evitar mezclar los assets de las dos aplicaciones.

En el ensayo se restauró el directorio Angular completo en el destino exclusivo de la copia. En un contexto nuevo de Chrome se inició sesión, se abrió el favorito de AREANDINA #6 y se leyó Language y el resumen de 4.000. El SHA-256 de main.js fue el mismo de E0: `1ef70d67f8de04dd0641c3467be5ba9701b2459983213a69feea4368841fcb15`. Después se volvió a servir React en la copia. Los procesos de distribución y watcher de la instalación habitual conservan Angular como opción predeterminada. [Captura tras la reversión](angular-restaurado.png)

## Comparación posterior con el diagnóstico del admin

Tras ensayar la reversión se abrió el diagnóstico del admin con su cuenta de desarrollo y se usó la misma red y snapshot en React. La cabecera, las métricas, el selector de snapshot paginado, los filtros, el cumplimiento de reglas y la tabla de registros se recorren ahora en una sola página. Se probaron la ficha, las ocurrencias válidas e inválidas, el retorno con Atrás, las exportaciones y el enlace a los fallos de una regla con la cuenta dashboard. El dashboard conserva sus filtros múltiples y sus exportaciones. [Referencia del admin](admin-referencia.png) · [Informe React](dashboard-informe.png) · [Ficha](dashboard-ficha.png) · [Ocurrencias](dashboard-ocurrencias.png) · [Traza tras el cambio](diagnostico-http.tsv)

Al cierre de E5, el adaptador v5 del dashboard mantenía el resumen y las frecuencias para el snapshot completo. El admin admite consultas filtradas y una pestaña de XML del snapshot con búsqueda, copia y descarga. Reproducir esas operaciones para el rol DASHBOARD requiere un contrato de lectura por red y autorización para exponer el XML. La ampliación posterior se verificó en la misma copia. [Pruebas de XML y diagnóstico filtrado](../diagnostico-v5/README.md)

Se reconstruyó el ZIP final mediante el reactor Maven con el perfil dashboard-react y se extrajo en la copia. SHA-256: `bc0dffd3178d35e53d57300b850fafda7fb158cbdeefa5afa2b1c2e9e64c9666`. Los tres recorridos por el gateway pasaron de nuevo; Vitest pasó los 24 casos. El informe quedó disponible en la copia sobre el puerto 64065.

También se ejecutó el build Angular por defecto en un checkout temporal, con un destino vacío exclusivo. Maven terminó con BUILD SUCCESS y produjo index.html y main.js en los tres idiomas. Para reproducir las dos compilaciones en un checkout de prueba del reactor:

```sh
staging=$(mktemp -d)
mvn -B -pl lareferencia-repository-dashboard -am -Pdashboard-react package
mvn -B -pl lareferencia-repository-dashboard -am "-Ddashboard.static.dir=$staging/angular" package
unzip -q lareferencia-repository-dashboard/target/*-react.zip -d "$staging/react"
```

Los recorridos usan Chrome y Playwright para Python. En la copia arrancada, desde el repositorio del dashboard:

```sh
origen=http://dashboard.localhost:64065
python3 web/tests/gateway/verify.py "$origen" "$staging/login"
python3 web/tests/gateway/validation.py "$origen" "$staging/diagnostico"
python3 web/tests/gateway/history.py "$origen" "$staging/cosechas"
```
