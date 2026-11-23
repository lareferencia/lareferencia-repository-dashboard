"""Chrome acceptance for E4. Only the local Docker candidate is supported."""
import argparse
import csv
import getpass
import json
import os
import re
from contextlib import contextmanager
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.parse import parse_qs, urlsplit

from playwright.sync_api import expect, sync_playwright

REPORT = "/dashboard/es/AREANDINA/validation/6"
HISTORY = "/dashboard/es/AREANDINA/harvesting"
API = "/api/v5/dashboard/harvesting/source/AREANDINA"
DAY = "2026-10-04"


def dates(page, start, end):
    page.get_by_label("Desde").fill(start)
    page.get_by_label("Hasta").fill(end)
    page.get_by_role("button", name="Aplicar").click()


def history(page, origin, output):
    expect(page.get_by_role("heading", name="¿Qué quieres consultar?")).to_be_visible()
    page.get_by_role("combobox", name="Repositorio").fill("areandina")
    page.get_by_role("option", name=re.compile("^AREANDINA ·")).click()
    page.get_by_role("link", name="Cosechas", exact=True).click()
    plot = page.get_by_role("group", name="Registros por cosecha")
    expect(plot).to_be_visible()
    table = page.get_by_role("table", name="Cosechas", exact=True)
    row = table.get_by_role("row").nth(1)
    expect(row).to_contain_text("#6")
    with page.expect_response(lambda r: f"/history/{DAY}/{DAY}?" in r.url) as day:
        dates(page, DAY, DAY)
    data = day.value.json()
    assert data["totalElements"] == 1 and data["content"][0]["id"] == 6
    item = data["content"][0]
    assert [item[k] for k in ("harvestedSize", "validSize", "transformedSize", "deleted")] == [4000, 0, 0, False]
    assert item["startTime"].startswith(DAY + "T18:01:") and item["endTime"].startswith(DAY + "T18:16:")
    expect(row).to_contain_text("20:16")
    expect(row).to_contain_text("14min 37s")
    page.screenshot(path=str(output / "grafico.png"), animations="disabled")
    page.set_viewport_size({"width": 390, "height": 844})
    expect(page.get_by_role("heading", name="Historial de cosechas")).to_be_visible()
    assert page.evaluate("document.documentElement.scrollWidth") == 390
    period = page.locator("summary").filter(has_text="Intervalo")
    period.click()
    expect(page.get_by_label("Desde")).to_have_value(DAY)
    period.click()
    page.screenshot(path=str(output / "movil.png"), full_page=True, animations="disabled")
    page.set_viewport_size({"width": 1440, "height": 1000})
    page.get_by_role("link", name="Ver diagnóstico #6").click()
    expect(page).to_have_url(origin + REPORT)
    expect(page.get_by_role("link", name="#5 Language")).to_be_visible()
    page.go_back()
    expect(page.get_by_label("Desde")).to_have_value(DAY)
    dates(page, "2026-10-05", "2026-10-05")
    expect(page.get_by_text("No se encontraron cosechas.")).to_be_visible()
    page.get_by_role("button", name="Restablecer intervalo").click()
    expect(plot).to_be_visible()
    page.get_by_role("tab", name="Tabla").click()
    sort = table.get_by_text("Cosechados", exact=True)
    with page.expect_response(lambda r: "/history/" in r.url and "sort=size%2Casc" in r.url) as sorted_page:
        sort.click()
    assert sorted_page.value.ok and sorted_page.value.json()["totalElements"] == 1
    page.get_by_label("Filas por página").select_option("25")
    expect(row).to_contain_text("20:01")
    with page.expect_download() as event:
        page.get_by_role("button", name="CSV de la página actual").click()
    target = output / "historial.csv"
    event.value.save_as(target)
    with target.open(encoding="utf-8-sig", newline="") as handle:
        headers, record = list(csv.reader(handle, delimiter=";"))
    assert headers == ["id", "harvestedSize", "validSize", "invalidRecords", "transformedSize", "startTime", "endTime"]
    assert record == ["6", "4000", "0", "4000", "0", item["startTime"], item["endTime"]]
    page.screenshot(path=str(output / "tabla.png"))
    table.get_by_role("link", name="Ver diagnóstico #6", exact=True).click()
    expect(page.get_by_role("link", name="#5 Language")).to_be_visible()
    page.go_back()
    expect(page.get_by_label("Filas por página")).to_have_value("25")
    assert "size%2Casc" in page.url
    page.goto(origin + "/dashboard/es/statistics")
    expect(page.get_by_role("heading", name="Dashboard de repositorios")).to_be_visible()
    expect(page.get_by_role("link", name="Estadísticas", exact=True)).to_have_count(0)
    expect(page.locator("iframe")).to_have_count(0)
    return item


def multi_page_history(page, origin, output):
    # One real snapshot cannot exercise a second chart page or a nonzero transformed series.
    def history_page(intercept):
        query = parse_qs(urlsplit(intercept.request.url).query)
        size = int(query["size"][0])
        offset = size * int(query["page"][0])
        ids = list(range(9, 0, -1))[offset:offset + size]
        rows = [{
            "id": n, "startTime": f"2026-01-{n:02}T00:00:00", "endTime": f"2026-01-{n:02}T01:00:00",
            "harvestedSize": 100, "validSize": n * 10, "transformedSize": n * 5, "deleted": False,
        } for n in ids]
        intercept.fulfill(json={"content": rows, "totalElements": 9})

    pattern = "**" + API + "/history/**"
    page.route(pattern, history_page)
    page.goto(origin + HISTORY)
    table = page.get_by_role("table", name="Cosechas", exact=True)
    expect(table.get_by_role("row")).to_have_count(9)
    assert table.locator("tbody td:first-child").all_text_contents() == [f"#{n}" for n in range(9, 1, -1)]
    expect(table.get_by_role("row").nth(1).get_by_role("cell").nth(4)).to_have_text("45")
    expect(page.get_by_role("img", name="Registros por cosecha")).to_be_visible()
    page.screenshot(path=str(output / "grafico-simulado.png"))
    page.get_by_role("button", name="Comparar dos cosechas").click()
    page.get_by_role("combobox", name=re.compile("^Referencia")).click()
    page.get_by_role("option", name=re.compile("^#2 ")).click()
    expect(page.get_by_role("table", name="Comparación de cosechas").get_by_role("columnheader", name="#9", exact=True)).to_be_visible()
    expect(page.get_by_text("70 puntos porcentuales más", exact=False)).to_be_visible()
    for label, heading in [("Tasa de validez", "Tasa de validez"), ("Duración", "Duración (min)")]:
        page.get_by_role("combobox", name=re.compile("^Indicador")).click()
        page.get_by_role("option", name=label, exact=True).click()
        expect(page.get_by_role("img", name=heading)).to_be_visible()
        if label == "Tasa de validez":
            expect(page.get_by_role("listbox")).to_have_count(0)
            page.evaluate("window.scrollTo(0, 0)")
            page.screenshot(path=str(output / "comparacion-simulada.png"), full_page=True, animations="disabled")
    page.get_by_role("button").filter(has_text=re.compile("^2$")).click()
    expect(table.get_by_role("row")).to_have_count(2)
    expect(table.get_by_role("link", name="Ver diagnóstico #1", exact=True)).to_be_visible()
    page.get_by_role("combobox", name=re.compile("^Comparar con")).click()
    page.get_by_role("option", name=re.compile("^#1 ")).click()
    expect(page.get_by_role("table", name="Comparación de cosechas").get_by_role("columnheader", name="#1", exact=True)).to_be_visible()
    expect(page.get_by_text("10 puntos porcentuales menos", exact=False)).to_be_visible()
    page.get_by_role("tab", name="Tabla").click()
    expect(table.get_by_role("row")).to_have_count(10)
    page.get_by_role("tab", name="Evolución").click()
    expect(page.get_by_role("table", name="Comparación de cosechas").get_by_role("columnheader", name="#1", exact=True)).to_be_visible()
    page.unroute(pattern)


def configure(page, config):
    def serve(route):
        route.fulfill(json=config)
    page.route("**/assets/data/appConfig.json", serve)


@contextmanager
def local_provider(real_script):
    # Serve a genuine script request from the opaque iframe, including one failed load.
    state = {"loads": 0, "published": False}
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            state["loads"] += 1
            if state["loads"] == 1:
                self.send_error(503)
                return
            body = real_script.read_bytes() if state["published"] else (
                b"document.getElementById('lrhw-widget').textContent=window.lrhw.parameters.default_repository.value")
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *args):
            pass

    with ThreadingHTTPServer(("127.0.0.1", 0), Handler) as server:
        thread = Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield f"http://127.0.0.1:{server.server_port}/historic-widget.js", state
        finally:
            server.shutdown()
            thread.join()


def widget_cases(page, origin, real_script, widget, provider, output):
    # The session and real source remain on the gateway. Changes apply to this browser only.
    route = origin + "/dashboard/pt/AREANDINA/statistics"
    configure(page, {"historic_module": {"active": False}, "validation_module": {"active": False},
                     "statistics_module": {"active": True}})
    page.goto(route)
    expect(page.get_by_text("Falta a URL do widget de estatísticas.")).to_be_visible()
    configure(page, {"historic_module": {"active": False}, "validation_module": {"active": False},
                     "statistics_module": {"active": True, "historic_stats": {"widget_url": widget}}})
    page.reload()
    expect(page.get_by_text("O repositório não tem um identificador de estatísticas configurado.")).to_be_visible()
    expect(page.locator("iframe")).to_have_count(0)

    def with_id(intercept):
        data = intercept.fetch().json()
        data["attributes"]["stats_source_id"] = "test-33"
        intercept.fulfill(json=data)
    page.route("**" + API, with_id)
    page.reload()
    expect(page.get_by_text("Não foi possível carregar o widget de estatísticas.")).to_be_visible()
    page.get_by_role("button", name="Tentar novamente").click()
    expect(page.frame_locator("iframe").locator("#lrhw-widget")).to_have_text("test-33")

    # A second synthetic source exercises remounting without granting another network to the test user.
    def sources(intercept):
        data = intercept.fetch().json()
        data["content"].append({"id": 99, "acronym": "TEST", "name": "Teste"})
        data["totalElements"] = len(data["content"])
        intercept.fulfill(json=data)
    page.route("**/source/list?*", sources)
    page.route("**/source/TEST", lambda r: r.fulfill(json={"id": 99, "acronym": "TEST", "name": "Teste",
                                                          "institutionName": "Instituto", "attributes": {"stats_source_id": "test-99"}}))
    page.reload()
    expect(page.frame_locator("iframe").locator("#lrhw-widget")).to_have_text("test-33")
    page.get_by_role("combobox", name="Repositório").click()
    page.get_by_role("option", name="TEST · Teste").click()
    expect(page.frame_locator("iframe").locator("#lrhw-widget")).to_have_text("test-99")
    assert provider["loads"] == 4
    expect(page.locator("iframe")).to_have_count(1)
    assert page.frames[-1].evaluate("window.lrhw.parameters.scope_labels") == {"N": "Instituto", "R": ""}
    if real_script:
        # Exercise the published script; the fixture source has no production usage data.
        configure(page, {"historic_module": {"active": False}, "statistics_module": {"active": True, "historic_stats": {
            "widget_url": widget, "is_national_aggregator": True, "scope_labels": {"N": "Nacional"}}}})
        provider["published"] = True
        page.reload()
        expect(page.frame_locator("iframe").locator("#lrhw-widget button").first).to_be_visible()
        expect(page.frame_locator("iframe").get_by_role("button", name="Português", exact=True)).to_be_visible()
        assert provider["loads"] == 5
        params = page.frames[-1].evaluate("window.lrhw.parameters")
        assert params["scope_labels"] == {"N": "Nacional", "R": "Instituto"}
        assert params["default_repository"] == {"label": "Instituto - Teste", "value": "test-99"}
        page.locator("iframe").screenshot(path=str(output / "widget-prueba.png"))

    page.goto(origin + "/dashboard/pt/TEST/harvesting")
    expect(page.get_by_role("heading", name="Painel de repositórios")).to_be_visible()
    expect(page.locator("iframe")).to_have_count(0)
    expect(page.get_by_role("link", name="Coletas", exact=True)).to_have_count(0)


def run(browser, origin, output, real_script):
    output.mkdir(parents=True, exist_ok=True)
    context = browser.new_context(locale="es-ES", timezone_id="Europe/Madrid", viewport={"width": 1440, "height": 1000})
    page = context.new_page()
    page.set_default_timeout(10000)
    expect.set_options(timeout=10000)
    trace = []
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    def log(response):
        url = urlsplit(response.url)
        if url.path.startswith("/api/v5/"):
            trace.append([response.request.method, url.path + ("?" + url.query if url.query else ""), response.status])
    page.on("response", log)
    page.goto(origin + "/dashboard/es/")
    page.get_by_label("Usuario").fill("dashboard")
    page.get_by_label("Contraseña").fill(os.getenv("DASHBOARD_TEST_PASSWORD") or getpass.getpass())
    page.get_by_role("button", name="Iniciar sesión").click()
    item = history(page, origin, output)
    page.remove_listener("response", log)
    assert all(status < 400 or (path == "/api/v5/me" and status == 401) for _, path, status in trace)
    multi_page_history(page, origin, output)
    with local_provider(real_script) as (widget, state):
        widget_cases(page, origin, real_script, widget, state, output)
    page.get_by_role("button", name="Sair", exact=True).click()
    expect(page.get_by_label("Usuário")).to_be_visible()
    assert not errors, errors
    (output / "snapshot.json").write_text(json.dumps(item, indent=2) + "\n")
    with (output / "http.tsv").open("w") as handle:
        writer = csv.writer(handle, delimiter="\t", lineterminator="\n")
        writer.writerow(["metodo", "ruta", "http"])
        writer.writerows(trace)
    context.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("origin")
    parser.add_argument("output", type=Path)
    parser.add_argument("--provider-script", type=Path, help="Copia del JavaScript publicado de LRHW 1.1.6")
    args = parser.parse_args()
    if urlsplit(args.origin).hostname not in {"dashboard.localhost", "localhost", "127.0.0.1"}:
        parser.error("Se requiere un destino local")
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome", args=["--host-resolver-rules=MAP stats.lareferencia.info ~NOTFOUND"])
        try:
            run(browser, args.origin.rstrip("/"), args.output, args.provider_script)
        finally:
            browser.close()
