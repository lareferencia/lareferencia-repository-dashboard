# Dashboard code review

Reviewed on 21 November 2026 against dashboard commit `249d2de` on `codex/rc5-pre`. The maintenance changes cover the published React application. The review also covered the browser checks, CI, Maven packaging, localized entries and the deployment examples. Maven selects `web/` as its frontend. The Angular tree and its XLF backups remain historical references. [Build definition](../pom.xml) · [CI workflow](../.github/workflows/release.yml)

## Where to make a change

| Area | What a maintainer needs to know | Entry points |
| --- | --- | --- |
| Startup and language | The entry HTML sets the language. The router, MUI locale and runtime configuration use that language. Each translation catalog has its own file. TypeScript checks the English and Portuguese keys against Spanish, including nested quantifiers. | [Bootstrap](../web/src/main.tsx) · [Configuration and theme](../web/src/app/App.tsx) · [Catalogs](../web/src/i18n/index.ts) · [Vite entries](../web/vite.config.ts) |
| Session and repositories | Login and logout obtain a CSRF token. A 401 from a private read returns the user to login. A private query cache belongs to one authenticated mount. The home page can restore a preferred repository, while a report link names its repository in the URL. Harvester enforces access on each read. | [Session](../web/src/auth/Session.tsx) · [API client](../web/src/api/dashboard.ts) · [Repository routes](../web/src/features/Repositories.tsx) · [Repository selector](../web/src/features/RepositorySelector.tsx) · [Landing page](../web/src/features/RepositoryHome.tsx) |
| Harvest history | The API supplies the table page in display order. CSV exports that page. The chart gets a chronological copy. Valid and invalid records make up the volume stack. Transformed records may overlap both groups. Null counts and durations represent missing measurements. Validity-rate differences use percentage points. | [History request and dates](../web/src/features/harvesting/history.ts) · [History screen](../web/src/features/harvesting/HarvestHistory.tsx) · [Chart](../web/src/features/harvesting/HarvestChart.tsx) · [Comparison](../web/src/features/harvesting/HarvestComparison.tsx) · [Bookmarked pair lookup](../web/src/features/harvesting/useHarvestComparison.ts) |
| Validation | The header and available rule filters use the complete snapshot. The cards, rule totals and occurrence lists use the selected cohort. Record requests copy those filters and add pagination. The list and record dialog share the same validity label. | [Report](../web/src/features/Validation.tsx) · [Canonical filters](../web/src/features/validation/filters.ts) · [Record list](../web/src/features/validation/Records.tsx) · [Validity label](../web/src/features/validation/RecordStatus.tsx) |
| Historical evidence | An explicit capture flag takes precedence. When it is absent, a stored-values flag can establish availability. When both are unknown the action stays accessible and an empty result explains the uncertainty. The rule table, frequency dialog and record details share these decisions. | [Rule evidence](../web/src/features/validation/ruleDetails.ts) · [Rule table](../web/src/features/validation/Rules.tsx) · [Frequency dialog](../web/src/features/validation/RuleDialog.tsx) |
| XML and exports | Opening the XML tab requests the archived document by source, snapshot and OAI identifier. Search highlights the displayed text. Copy and download use the original string. CSV, XML and the history table share the browser download mechanism. | [Record detail](../web/src/features/validation/RecordDetail.tsx) · [XML viewer](../web/src/features/validation/HistoricalXml.tsx) · [Downloads](../web/src/shared/downloads.ts) |
| Usage statistics | The widget requires an enabled module, an HTTP(S) script and a source statistics ID. It runs in a sandboxed iframe. A load failure is accepted only from the current frame's window. Relative widget URLs resolve against the dashboard document. | [Widget](../web/src/features/Statistics.tsx) · [Operator configuration](CONFIGURATION.md) |

## Changes and verification

The six findings from the review were addressed against a local copy of the development PostgreSQL database and its archived SQLite snapshots. Browser checks used Chrome through the copy's dashboard gateway. The controlled OAI source below was harvested and validated by the workers in the copy.

| Finding | Change | Verification |
| --- | --- | --- |
| Bookmarked comparisons across history pages | The comparator restores missing members by ID within the selected source and end-date interval. A missing member displays an explanation. A failed read offers a retry. | Opened and reloaded PA #3/#4 with #3 omitted from the first page by the browser harness, leaving the point lookup on the real gateway. Both diagnostics opened. An absent ID produced the notice. A snapshot from another permitted source returned 404 and an ungranted source returned 403. |
| Repository and snapshot selectors | The home page loads 100 permitted sources and searches by acronym or name. A stored preference outside that page is restored by ID. Opening the snapshot selector fetches one page of available diagnostics. Further pages load on request. | A separate dashboard account received 347 fixture grants. Searching selected REV347 and a reload restored it. The new API matched “panamá” to PA. The component suite checked a retained snapshot beyond the first 100. |
| Eligibility for historical diagnostics | The table, chart, comparator and picker use one deletion check. Historical clients can receive a missing or null flag. Only explicit deletion hides the diagnostic. The backend enforces deletion on diagnostic reads and keeps harvest metrics available for comparison. | Regression cases cover true, false, null and absent flags. The controller test checks a deleted snapshot and a date outside the requested interval. |
| Frequencies on high-cardinality rules | Each group reads one SQLite page. The response carries the number of distinct values and the sum of their frequencies for the whole filtered group. CSV requests the complete group when it spans several pages. | Compared AREANDINA #6 rule 12 with independent SQLite aggregation. The full invalid group had 299 distinct values and 3,735 occurrences (10,401 response bytes). Its first page had ten values and both totals (418 bytes). With `valid_rules=5`, the same comparison gave 291 distinct values and 1,606 occurrences (10,109 vs 416 bytes). A real SQLite test also covered an empty page past the end. |
| Incomplete API responses and old bookmarks | The client validates session fields, record identifiers, snapshot membership, rule collections and pagination. An out-of-range Java integer resets to the first record page. Legacy unnamed rules and missing capture flags remain readable. | Component tests retried a malformed session and a malformed record page, preserving the cohort. Boundary tests covered page numbers above the Java limit and the largest accepted integer. |
| Initial load and deployment examples | History, validation, statistics, the chart and language catalogs load separately. The repository selector ships with the entry to avoid a delay after login. The Nginx and Angular examples point maintainers to the current configuration guide. | The isolated Maven React ZIP's 17 files matched `web/dist` byte for byte. Authenticated Spanish, English and Portuguese direct links opened AREANDINA #6. [Current configuration](CONFIGURATION.md) |

### Browser measurements

Five fresh Chrome contexts per build, on the same machine. For initial rendering, the two builds used identical local API fixture responses. Times are navigation-to-interaction medians, and byte counts are the JavaScript actually fetched (gzip level 6). For the large-directory check, both builds received their static files locally while all source reads went through the same Docker gateway. Timing depends on browser, round-trip time and API load.

| Measurement | Before | After |
| --- | ---: | ---: |
| Cold Spanish login | 175 ms | 128 ms |
| Cold home, small directory | 222 ms | 172 ms |
| Cold login/home JavaScript, uncompressed | 750,823 bytes | 648,084 bytes |
| Cold login/home JavaScript, gzip | 234,717 bytes | 205,860 bytes |
| Open home, 347 permitted sources | 310 ms, four list requests | 219 ms, one list request |
| Select REV347 from navigation start | 374 ms | 546 ms |
| Restore REV347 after reload | Four list requests | One list request and one ID lookup |

Typing REV347 now triggers a debounced server search. In this local run that added time to the selection while reducing the total source rows transferred from 347 to 101. The frequency query still aggregates all matching values for accurate totals. The decrease in response size is repeatable. Seven-request local frequency timing samples varied with concurrent load, so these checks establish no latency guarantee.

### Historical data and permissions

- AREANDINA #6 contained 4,000 invalid records. Rule 5 passed 1,871 and failed 2,129. The filtered summary, rule table, occurrence CSV and record queries agreed with the archived baseline. Historical XML, exact-identifier access, logout and the network-denial checks passed through the gateway. [Validation procedure](evidencias/diagnostico-v5/README.md)
- PA #3 and #4 each contained 3,444 valid records. Harvest durations were 50,982 seconds and 5,380 seconds. The comparison displayed a reduction of 12 h 40 min. [Harvest procedure](evidencias/historial-evolucion/README.md)
- QAMIX mixed accepted and rejected records in one snapshot. A dashboard user with a QAMIX grant could open the harvest, snapshot choices and paged frequencies. A dashboard user without the grant got 403 on those reads and zero matching sources when searching by name or ID.

### Mixed validation fixture

QAMIX #8 and #10 came from full OAI harvests of the same six records. Both snapshots contained three valid and three invalid records and the same rule totals. With detailed capture enabled in #8, the title rule displayed **Sin recuento** and the two vocabulary rules offered **Ver ocurrencias**. With capture disabled on the validation action in #10 all three rules displayed **Sin recuento**. SQLite contained 13 occurrence rows for #8 and zero for #10. The snapshot data and the visible actions still agreed after re-enabling capture for future runs. [Detailed report](evidencias/qa-mixed/mixed-detailed.png) · [Language occurrences](evidencias/qa-mixed/mixed-language.png) · [Summary-only report](evidencias/qa-mixed/mixed-summary.png)

The platform fixture lives in `testing/dashboard-validation/`. Its README describes importing the validator, serving the OAI sample, running the workers, and rerunning `verify.py` with the snapshot IDs allocated by a different installation.

### Build and regression checks

- From `web/`: `npm ci`, `npm test` (40 tests passed). From the platform root: `mvn -pl lareferencia-repository-dashboard -Pdashboard-react package`. The package includes the localized HTML, catalogs and route assets.
- From the platform root: `mvn -pl lareferencia-lrharvester-app -am -Dno-frontends -Dtest=HistoricalValidationReportTest,ApiV5DashboardCompatibilityControllerTest -Dsurefire.failIfNoSpecifiedTests=false package`. Six real-SQLite tests and six v5 controller tests passed. Maven also reported existing Javadoc errors in core and OCLC while packaging the runnable JAR successfully.
- Browser checks included a production React build, the matching harvester in the copy, and the original PA/AREANDINA fixtures. The external usage-statistics provider was outside the run. Its widget configuration and failure handling are covered by the existing fixture checks. [Widget checks](../web/tests/gateway/history.py)

### Harvest comparison regression

The history screen tests open a three-ID bookmark with its first two harvests already loaded. The unavailable notice appears and the comparison stays closed. Clicking **Compare two harvests** then opens a valid pair. Another test restores a pair after its original page disappears and a lookup for one harvest needs a retry. Both use the React routes with controlled API responses. The suite passed all 42 cases and the localized production build completed with Node 22.14.0. [History screen tests](../web/tests/harvestHistory.test.tsx)
