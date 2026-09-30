# LA Referencia Repository Dashboard

Angular single-page dashboard for reading authorized repository harvesting history and validation results through the Harvester v5 API. It does not administer users, technical accounts, tokens, repositories, harvesting configuration, or broker events.

## Requirements and local setup

The Maven-integrated build pins Node.js 18.20.8 and npm 10.8.2. For standalone local work, Node.js 18 is recommended.

```sh
npm ci
npm start
```

The development server runs on port 8080. The Harvester API must be available under the same origin through a reverse proxy, or configured with credentialed CORS. The session cookie is `HttpOnly`, `Secure`, and `SameSite=Lax`; use HTTPS for browser testing. Angular CLI's dev server does not proxy API requests by default.

## Runtime configuration

`src/assets/data/appConfig.json` is loaded at startup. Its default API base is `/api/v5`. Dashboard read compatibility routes are isolated under `/api/v5/dashboard`; native v5 routes are unchanged. Statistics are disabled by default and may be enabled with `statistics_module.active` and a valid `historic_stats.widget_url`.

The external statistics widget loads only when enabled and the selected repository has `attributes.stats_source_id`. No session credential or bearer token is sent to it. Harvesting and validation views do not depend on the widget.

## Authentication and authorization

The login screen authenticates a human local Harvester user through `GET /api/v5/auth/csrf`, `POST /api/v5/auth/login`, and restores the session through `GET /api/v5/me`. Logout calls `POST /api/v5/auth/logout`. Browser calls use the session cookie and CSRF cookie/header pair. Passwords are held only while submitting the login form. There is no Keycloak, HTTP Basic, or browser bearer-token flow. Technical service accounts are for API clients and cannot log in to this UI.

`ADMIN` can read all repositories; `DASHBOARD` sees only assigned repositories. `READER` and service-account tokens cannot access the dashboard API. Client-side filtering is navigation only: the Harvester API independently authorizes direct repository and snapshot requests. Users, assignments, service accounts, and token lifecycle are managed in the Harvester Admin Web. The dashboard account page is read-only. Existing `READER` users are not changed automatically; an administrator must explicitly grant the `DASHBOARD` role where appropriate.

Create the first administrator using the Harvester Shell's interactive local security command after applying database migrations; do not configure a default password. See the platform [authentication guide](../../docs/AUTHENTICATION.md) and [v5 API contract](../../docs/HARVESTER_MANAGEMENT_API_V5.md).

## Included functions and removed legacy

- Authorized repository selector, harvesting history/chart, validation summaries, records, filters, and occurrence details through the v5 dashboard adapter.
- Optional external historic statistics widget and read-only account/session details.
- Removed: Keycloak login, old user/group administration, harvesting configuration administration, and OpenAIRE Broker.

The platform Maven module at `../pom.xml` publishes localized builds into
`lareferencia-lrharvester-app/dashboard-static/{en,es,pt}`. The Harvester serves them
under `/dashboard/`. In Docker development, use
`http://dashboard.localhost:8188/dashboard/es/` in isolated mode; the Nginx gateway
allows only auth/session endpoints and GET requests under `/api/v5/dashboard/**` for
that host. Production must configure its own TLS-enabled dashboard hostname and proxy
the same allowlist. The Angular package by itself is not an authorization boundary.

## Build and localization

```sh
npm run build
```

This creates localized bundles with `/dashboard/{en,es,pt}/` base paths. To build and
publish the dashboard from the platform root, run
`./Docker/docker-dev.sh build dashboard`. English, Spanish, and Portuguese translations
are configured in `angular.json`. Update the relevant XLF catalogs when changing text
marked with `i18n`.
