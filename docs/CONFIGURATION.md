# Dashboard configuration

The Repository Dashboard reads a public JSON file at startup. This file controls which modules are visible, where the dashboard calls the Harvester API, and how it loads usage statistics. Manage user access and repository attributes in Harvester Admin.

## Configuration file

Edit [`web/config/appConfig.json`](../web/config/appConfig.json) to set the installation defaults. A build copies this file to `{es,en,pt}/assets/data/appConfig.json` within the dashboard output. Harvester publishes those files at `/dashboard/<language>/assets/data/appConfig.json`. The URL determines the language: `en`, `es`, or `pt`. Opening `/dashboard/` in Harvester redirects to `/dashboard/es/`.

Keep credentials, tokens, and other secrets out of this public file.

## Enable or disable modules

Each switch applies to every repository in the dashboard. Harvester controls which repositories each account can access.

| Module | JSON setting | Shipped default | What enabling it adds |
| --- | --- | --- | --- |
| Harvests | `historic_module.active` | `true` | Harvest history, trends, comparisons, and CSV export. |
| Validations | `validation_module.active` | `true` | Validation reports. When Harvests is also enabled, its history links to available diagnostics. |
| dARK identifiers | `dark_module.active` | `false` | Read-only identifier report with filters and a full CSV download. |
| Statistics | `statistics_module.active` | `false` | Usage statistics. Each repository needs a provider ID to display figures. See [Usage statistics](#usage-statistics). |

1. In the template, find the module and change only its `active` value. Use the JSON boolean `true` to enable it or `false` to disable it. Keep the module's other settings so you can turn it back on later. Omitting the entire module also disables it.
2. Build and publish the dashboard to apply the template. To apply a change immediately to an existing deployment, edit `assets/data/appConfig.json` under each of the three published language directories (`es`, `en`, and `pt`). Keep the template in sync because the next build regenerates those copies.
3. Reload the dashboard and select a repository. Enabled modules appear in the navigation. Opening a saved URL for a disabled module shows Home. To check the effective switch in Spanish, for example, open `/dashboard/es/assets/data/appConfig.json`. [Configuration loader](../web/src/app/config.ts) · [Module routes](../web/src/features/Repositories.tsx)

## API and module settings

| Setting | Purpose |
| --- | --- |
| `apiBaseUrl` | Base URL for local authentication, session checks, and dashboard reads. The default is `/api/v5`. Keep this path when the UI and API share an origin. |
| `validation_module.portalService` | Optional HTTP(S) URL prefix for the **Portal** link in a record's details. Use the complete record URL prefix, including any trailing slash required by the portal. The dashboard appends the encoded portal identifier from a compatible record ID. Records without a portal identifier omit the link. |
| `statistics_module.historic_stats.widget_url` | URL of the LRHW JavaScript bundle. The template points to LRHW 1.1.6. Use an HTTPS URL on an HTTPS installation. |
| `statistics_module.historic_stats.is_national_aggregator` | Set to `true` for a national aggregator or `false` to use the institution name as the main scope label. |
| `statistics_module.historic_stats.scope_labels.N` | Label for the national scope when national aggregator mode is enabled. In that mode the dashboard fills the repository scope label (`R`) with the institution name. |

## dARK identifiers

Set `"dark_module": { "active": true }` and open **dARK identifiers** for a repository. A direct link uses `/dashboard/<language>/<repository-acronym>/dark`. Deploy the Harvester version that provides the dARK dashboard endpoints before enabling the module.

The report shows each assigned ARK, its OAI identifier, the last tracking state recorded by Harvester, and the last update in UTC. Network read permissions apply to the report and its CSV. Each row must have an ARK and a recorded source network. Historical imports without source provenance appear once the staging worker records their network. Sharing a NAAN does not grant access to another network's records.

Select a state, enter part of an ARK or OAI identifier, or set either end of the update date range. Both dates include the entire UTC day. Select **Apply**, then **Download results as CSV** to download every matching row across pages. Use **Clear filters** to download all assigned identifiers. CSV timestamps use UTC, and state codes use their English API names.

## Usage statistics

1. Set `statistics_module.active` to `true` and set `historic_stats.widget_url`. Choose the aggregator setting for this installation.
2. In Harvester Admin, open **Sources**, edit the repository, and find **Statistics source ID** in the source's specific data tab. The field is available when the source's attribute profile includes `stats_source_id`, such as the LA Referencia Repository profile. Enter the identifier assigned by the statistics provider and save the source.
3. Sign in to the dashboard and open **Statistics** for that repository. Select a period for which the provider has data. Check views, downloads, and links against the provider's totals for the same scope and dates.

For example, the following block enables statistics for a national aggregator. Replace just the `statistics_module` block in the template.

```json
{
  "statistics_module": {
    "active": true,
    "historic_stats": {
      "widget_url": "https://cdn.jsdelivr.net/gh/lareferencia/lrhw@1.1.6/dist/assets/chunks/historic-widget.js",
      "is_national_aggregator": true,
      "scope_labels": { "N": "National node" }
    }
  }
}
```

The dashboard passes the source ID from `attributes.stats_source_id`, the institution, and the selected language to LRHW. The widget fetches usage figures from its statistics provider. Harvester supplies the repository details and permissions. If your provider assigns different IDs to different repositories, configure each source individually. [Widget integration](../web/src/features/Statistics.tsx)

## Accounts and API access

- In Harvester Admin, open **Users**, create or edit an enabled user with the `DASHBOARD` role, and assign the networks they should see. A dashboard user can read the assigned networks. An `ADMIN` account can read all networks. Review the role and assignments if a repository is missing or a saved report opens with **Access denied**.
- Serve the dashboard and its API under the same HTTPS origin so the browser can send the Harvester session and CSRF cookies. A dedicated dashboard proxy needs `GET` or `HEAD` for `/dashboard/**`, `GET` for `/api/v5/auth/csrf` and `/api/v5/me`, `POST` for `/api/v5/auth/login` and `/api/v5/auth/logout`, and `GET` for `/api/v5/dashboard/**`. Keep the administrative API on its own access surface.
- Keep `apiBaseUrl` at the API root. The client appends the session and dashboard paths itself. [API client](../web/src/api/dashboard.ts)

## Build and verify

From the dashboard repository's `web/` directory, use Node 22.14.0 and npm 10.9.2.

```sh
npm ci
npm run build
```

The build writes `web/dist/`. For a Harvester deployment, publish that directory's contents to the directory configured by `frontend.dashboard-static-directory`, which defaults to `dashboard-static` relative to Harvester's working directory. From the platform workspace, Maven can build and publish the same files with `mvn -pl lareferencia-repository-dashboard package`. If you serve the build separately, mount it under `/dashboard/` and serve the matching language's `index.html` for dashboard navigation routes, while serving assets and API requests through their own routes. [Build guide](../web/README.md)

1. Open `/dashboard/en/assets/data/appConfig.json` on the deployed host and check the effective settings. Check the corresponding Spanish and Portuguese files for shared settings.
2. Sign in with a dashboard account and select an assigned repository. Confirm that the enabled modules appear and that bookmarked reports reload correctly.
3. For statistics, check that the expected repository and scope appear. Try a date range with known usage and switch repositories to confirm the widget updates.

| Symptom | What to check |
| --- | --- |
| Configuration error on startup | Check the JSON URL for the current language. It should return valid JSON with boolean `active` flags for each module present. |
| Settings differ after switching languages | Verify the JSON served under each language path. |
| Statistics is missing from navigation | Check `statistics_module.active` in the JSON served by that language. Select a repository that the account can read. |
| Statistics reports missing configuration | Check that `historic_stats.widget_url` points to an HTTP(S) script. |
| Statistics reports a missing source identifier | Check `stats_source_id` in the repository's attribute profile and confirm that Harvester returns it in the source details. |
| The widget fails to load or displays no data | If the script failed, use the screen's **Retry** action and check the browser's network requests. If the widget loads without figures, check the provider's response for the selected ID, scope, and dates. |
| Login fails or the repository list is empty | Check the API base, HTTPS and proxy routes for sign-in errors. For an empty list after successful sign-in, check the user's network assignments. |
