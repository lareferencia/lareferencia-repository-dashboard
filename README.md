# LA Referencia Repository Dashboard

Interfaz React de solo lectura para consultar redes, cosechas, validaciones
y estadísticas a través del adaptador `/api/v5/dashboard`. Usa la sesión local de
Harvester y `/api/v5/me`; las cuentas y permisos se administran desde Admin Web.
La API del Dashboard requiere rol ADMIN o DASHBOARD, según la autorización del
backend. Para el resumen y las frecuencias filtradas y el XML histórico, usar el harvester del lock de plataforma (cambio `8d5575d`). Las pruebas de portada y diagnósticos están en [las evidencias del dashboard](docs/evidencias/).

## Compilación

Desde la raíz del workspace de plataforma, después de `githelper init`:

```bash
mvn -pl lareferencia-repository-dashboard package
# Alternativa con Node 22 dentro de Docker:
./build-dashboard.sh
```

El POM hereda la versión de `lareferencia-parent`, instala Node 22.14.0/npm 10.9.2,
sincroniza los archivos npm y ejecuta `npm ci` y `npm run build` en `web/`.
Publica las variantes en `lareferencia-lrharvester-app/dashboard-static/{en,es,pt}/`.
El JavaScript compartido se publica en `dashboard-static/assets/`. El código de Angular se conserva en `angular/` como referencia histórica.

En Docker de desarrollo, `./Docker/docker-dev.sh build dashboard` publica los estáticos que sirve el harvester. Para generar un ZIP aislado, usar el perfil Maven `-Pdashboard-react`.

El build completo `./build.sh lareferencia` incluye también Admin React y Java.
Los directorios estáticos de Admin y Dashboard son independientes.

## Acceso

Para configurar los módulos, las estadísticas de uso y los permisos, consulta la [guía de configuración en inglés](docs/CONFIGURATION.md).

Harvester sirve el Dashboard bajo `/dashboard/` (redirige a `/dashboard/es/`).
En Compose normal se accede por `http://localhost:8090/dashboard/es/`; en Docker
Dev aislado por `http://localhost:8190/dashboard/es/` o por el gateway
`http://dashboard.localhost:8188/dashboard/es/`. El gateway permite solo las rutas
de autenticación y lectura necesarias; no ofrece el API administrativo de React.

Referencias: [Docker Dev](../docs/DOCKER_DEV.md),
[autenticación](../docs/AUTHENTICATION.md), [workspace](../githelper.md).

## Publicación

Las releases se coordinan desde el repositorio de plataforma. Este repositorio
ejecuta CI en los PR y en main, usando el lockfile de `web/`, las pruebas Vitest y el build de Vite; guarda
el build como artefacto de Actions y no crea releases independientes al mergear
cambios de documentación o numeración.
