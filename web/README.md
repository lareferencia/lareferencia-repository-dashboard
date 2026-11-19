# Dashboard React

Interfaz publicada en `/dashboard/`. Se puede instalar y compilar copiando únicamente esta carpeta. La cuenta inicia sesión con la API v5 y el selector ofrece sus repositorios autorizados. Desde Validaciones se abre el último snapshot válido. Los enlaces al informe y a cada regla se pueden guardar y recargar. [Recorrido E2 y pruebas por el gateway](../docs/evidencias/e2-react/README.md)

El perfil Maven optativo `dashboard-react` genera un ZIP independiente en `target/`; la compilación Maven predeterminada publica React en el harvester. La ficha permite consultar el XML histórico y el informe aplica los mismos filtros a resumen, registros y frecuencias. [Comparación final con el admin](../docs/evidencias/comparacion-final-validaciones/README.md) · [Empaquetado y reversión](../docs/evidencias/e5-react/README.md)

## Desarrollo

Usar Node 22.14.0 (también en `.nvmrc`) y npm 10.9.2. Desde `web/`:

```sh
npm ci
npm run dev
```

Abrir [la portada local](http://127.0.0.1:5174/dashboard/es/). El servidor de desarrollo reenvía `/api/v5` al gateway Docker en `127.0.0.1:8188` con el host `dashboard.localhost`. Para otra dirección de gateway local, definir `DASHBOARD_GATEWAY_ORIGIN`. La ruta determina el idioma. El selector conserva la ruta, la consulta y el fragmento al cambiar entre español, inglés y portugués. El menú lateral permite volver a Inicio.

El informe permite filtrar registros, recuperar filtros y página desde la URL, consultar las ocurrencias de la regla y descargar las reglas visibles, la página actual o un grupo completo de frecuencias. [Aceptación de E3 frente a Angular y SQLite](../docs/evidencias/e3-react/README.md)

Cosechas ofrece el historial, el gráfico por intervalo y el CSV de la página. Los indicadores de módulo controlan la portada, el menú y las rutas. Estadísticas toma la URL del widget de la configuración y el ID estadístico del repositorio. [Pruebas de E4 y comparación con Angular](../docs/evidencias/e4-react/README.md)

## Verificación y salida

```sh
npm run typecheck
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4174
```

El build genera `dist/{es,en,pt}/index.html`, el JavaScript compartido en `dist/assets/` y un archivo de configuración por idioma en `dist/{es,en,pt}/assets/data/appConfig.json`. La plantilla de instalación está en `config/appConfig.json`. El cliente pide la copia de su idioma antes de montar el router; al fallar esa lectura permite reintentar. Para probar en otro servidor estático, montar `dist/` bajo `/dashboard/` y dirigir las navegaciones de cada idioma a su index. Vite dev y preview ya incluyen esa lógica.

## Origen y comprobaciones de E1

El tema y los estilos de navegación se tomaron del admin-web en `5dacfdb`. El layout adapta su barra lateral, paleta, contenedor principal y selector de idioma al dashboard. Los componentes, dependencias y pruebas se mantienen aquí. [Tema original](https://github.com/lareferencia/lareferencia-lrharvester-admin-web/blob/5dacfdb94b4dbc2a1fb37c1a988f2ee14b114bf8/src/app/App.tsx) · [Layout original](https://github.com/lareferencia/lareferencia-lrharvester-admin-web/blob/5dacfdb94b4dbc2a1fb37c1a988f2ee14b114bf8/src/app/AppLayout.tsx)

El 19 de noviembre de 2026 se copió solo `web/` a un directorio temporal, se instalaron las dependencias del lock con Node/npm en las versiones indicadas y pasaron TypeScript, los dos casos Vitest y el build de producción. En Chrome se verificaron las tres entradas, el cambio de idioma desde una ruta profunda con query y fragmento, recarga, navegación a Inicio y viewport móvil de 390 px. El bundle compartido midió 555 kB minificados (175 kB gzip); Vite emitió el aviso de tamaño de chunk. [Escritorio ES](../docs/evidencias/e1-react/es-escritorio.png) · [Móvil PT](../docs/evidencias/e1-react/pt-movil.png)

Durante E1, React se compilaba como preview y el POM y Docker aún publicaban Angular. La huella SHA-256 de `/dashboard/es/main.js` en el harvester local fue idéntica antes y después de E1: `1ef70d67f8de04dd0641c3467be5ba9701b2459983213a69feea4368841fcb15`.
