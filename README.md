# LA Referencia Repository Dashboard

Interfaz Angular 15 de solo lectura para consultar redes, cosechas, validaciones
y estadísticas a través del adaptador `/api/v5/dashboard`. Usa la sesión local de
Harvester y `/api/v5/me`; las cuentas y permisos se administran desde Admin Web.
La API del Dashboard requiere rol ADMIN o DASHBOARD, según la autorización del
backend. Las verificaciones de navegador y gateway aún pendientes están en
[la guía de migración](../docs/DASHBOARD_V5_MIGRATION.md).

## Compilación

Desde la raíz del workspace de plataforma, después de `githelper init`:

```bash
mvn -pl lareferencia-repository-dashboard package
# Alternativa con Node 18 dentro de Docker:
./build-dashboard.sh
```

El POM hereda la versión de `lareferencia-parent`, instala Node 18.20.8/npm 10.8.2,
sincroniza los archivos npm y ejecuta `npm ci` y `npm run build` en `angular/`.
Publica las variantes en `lareferencia-lrharvester-app/dashboard-static/{en,es,pt}/`.
No hace falta instalar Node globalmente para compilar con Maven.

El build completo `./build.sh lareferencia` incluye también Admin React y Java.
Los directorios estáticos de Admin y Dashboard son independientes.

## Acceso

Harvester sirve el Dashboard bajo `/dashboard/` (redirige a `/dashboard/es/`).
En Compose normal se accede por `http://localhost:8090/dashboard/es/`; en Docker
Dev aislado por `http://localhost:8190/dashboard/es/` o por el gateway
`http://dashboard.localhost:8188/dashboard/es/`. El gateway permite solo las rutas
de autenticación y lectura necesarias; no ofrece el API administrativo de React.

Referencias: [Docker Dev](../docs/DOCKER_DEV.md),
[autenticación](../docs/AUTHENTICATION.md), [workspace](../githelper.md).

## Publicación

Las releases se coordinan desde el repositorio de plataforma. Este repositorio
ejecuta CI en los PR y en main, usando el lockfile y el Angular CLI local; guarda
el build como artefacto de Actions y no crea releases independientes al mergear
cambios de documentación o numeración.
