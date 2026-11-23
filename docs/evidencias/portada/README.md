# Portada del dashboard React

Prueba del 19 de noviembre de 2026 en la copia Docker, con la cuenta `dashboard` y el navegador en español. La portada presenta el repositorio seleccionado y explica qué se puede consultar en cada servicio habilitado. Un único buscador permite cambiar de repositorio por nombre o sigla y confirmar con el teclado.

| Recorrido | Resultado |
| --- | --- |
| Iniciar sesión | El gateway devolvió las redes PA y AREANDINA para el rol DASHBOARD. Ambas coinciden con las asignaciones de la instalación actual. La consulta a UY devolvió 403. |
| Elegir PA y abrir Cosechas | La portada mostró Nodo Panama y el historial abrió la cosecha #4 en su tabla. Al volver a Inicio, PA siguió seleccionado. |
| Cambiar a AREANDINA y abrir Validaciones | Se abrió el diagnóstico #6. Se comprobó el cumplimiento de la regla #5 Language y se abrió su detalle. |
| Usar la portada a 390 px de ancho | El nombre completo de AREANDINA y ambas entradas se mostraron en una columna, sin desbordamiento horizontal. |
| Buscar entre 347 fuentes simuladas y desactivar módulos | Las pruebas de integración de React encuentran por sigla el último repositorio de la cuarta página de la API y comprueban que solo aparecen enlaces a los módulos habilitados. |

[Búsqueda por nombre](buscar-repositorio.png) · [Captura de escritorio](portada-pa.png) · [Captura móvil](portada-movil.png) · [Traza de rutas y estados HTTP](http.tsv) · [Prueba en Chrome](../../../web/tests/gateway/verify.py)
