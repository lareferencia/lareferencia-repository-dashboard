"""Accept E3 against the local AREANDINA fixture. Requires Chrome and Python Playwright."""
import argparse
import csv
import getpass
import hashlib
import os
import re
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlsplit

from playwright.sync_api import expect, sync_playwright

BASELINE = Path(__file__).resolve().parents[3] / "docs/evidencias/e0-areandina-6"
FIRST = "oai:digitk.areandina.edu.co:areandina/1000"


def read_csv(path):
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.reader(handle, delimiter=";"))


def download(page, label, path):
    with page.expect_download() as event:
        page.get_by_role("button", name=label, exact=True).click()
    event.value.save_as(path)
    rows = read_csv(path)
    assert all(len(row) == len(rows[0]) for row in rows)
    return rows


def count(page, total):
    expect(page.get_by_role("heading", name=f"Registros seleccionados · {total}", exact=True)).to_be_visible()


def choose_rule(page, field, name="#5 Language"):
    page.get_by_role("combobox", name=field, exact=True).click()
    page.get_by_role("option", name=name, exact=True).click()


def compare_page(page, output, name):
    actual = download(page, "CSV de la página actual", output / name)
    reference = read_csv(BASELINE / name)
    assert len(actual) == 11 and len(actual[0]) == 4
    assert [r[:2] for r in actual[1:]] == [r[:2] for r in reference[1:]]
    assert all([v.upper() for v in r[2:]] == old[2:] for r, old in zip(actual[1:], reference[1:]))


def select(page, label, value):
    page.get_by_role("combobox", name=re.compile("^" + re.escape(label) + r"(?: |$)")).click()
    page.get_by_role("option", name=value, exact=True).click()


def check_rules(page, output):
    select(page, "Obligatoriedad", "Obligatoria")
    rows = download(page, "CSV de reglas visibles", output / "reglas-obligatorias.csv")
    expected = [r[0] for r in read_csv(BASELINE / "reglas-obligatorias.csv")[1:] if r[3] == "TRUE"]
    assert [r[0] for r in rows[1:]] == expected and len(expected) == 6
    expect(page.get_by_role("table", name="Reglas").get_by_role("row")).to_have_count(7)
    select(page, "Obligatoriedad", "Todos")
    rule = page.get_by_role("link", name="#5 Language", exact=True)
    expect(page.get_by_role("row").filter(has=rule)).to_contain_text("46,8%")
    rule.click()
    dialog = page.get_by_role("dialog")
    expect(dialog).to_contain_text("Campo ausente")
    for group, label, expected in [
        ("valid", "Ocurrencias válidas", {"spa": 1869, "eng": 3, "por": 1, "ita": 1}),
        ("invalid", "Ocurrencias inválidas", {"es": 2274, "no_occurrences_found": 169, "en": 4, "de": 1, "Spanish": 1}),
    ]:
        rows = download(page, "CSV del grupo completo · " + label, output / f"5-{group}.csv")
        assert {value: int(n) for value, n in rows[1:]} == expected
    dialog.screenshot(path=str(output / "frecuencias.png"))
    dialog.get_by_role("button", name="Cerrar", exact=True).click()


def check_xml(page, dialog, output):
    with page.expect_response(lambda r: "/6/metadata?" in r.url) as response:
        dialog.get_by_role("tab", name="XML histórico").click()
    assert response.value.status == 200
    xml = response.value.json()["xml"]
    expect(dialog.locator("pre")).to_be_visible()
    assert dialog.locator("pre").text_content() == xml
    expected = "bce42125240154c1e75a8a06f584ae7352cf14a81767765f791cf598d31a8b43"
    assert hashlib.sha256(xml.encode()).hexdigest() == expected
    search = dialog.get_by_label("Buscar en el XML")
    search.fill("<FIELD")
    matches = dialog.locator("mark")
    expect(matches.first).to_have_text("<field")
    n = xml.casefold().count("<field")
    expect(matches).to_have_count(n)
    dialog.get_by_role("button", name="Siguiente").click()
    expect(dialog.get_by_role("status")).to_have_text(f"2 / {n}")
    dialog.get_by_role("button", name="Anterior").click()
    expect(dialog.get_by_role("status")).to_have_text(f"1 / {n}")
    dialog.screenshot(path=str(output / "xml.png"))
    search.fill("[.*]")
    expect(dialog.get_by_role("status")).to_have_text("0 / 0")
    dialog.get_by_role("button", name="Copiar XML").click()
    expect(dialog.get_by_text("XML copiado")).to_be_visible()
    assert page.evaluate("navigator.clipboard.readText()") == xml
    with page.expect_download() as event:
        dialog.get_by_role("button", name="Descargar XML").click()
    assert event.value.suggested_filename.endswith("1000.xml")
    assert event.value.path().read_bytes() == xml.encode()


def check_record(page, output):
    page.get_by_role("button", name=FIRST, exact=True).click()
    dialog = page.get_by_role("dialog", name="Detalle de validación")
    for heading in ["Fallos obligatorios", "Fallos opcionales", "Reglas aprobadas"]:
        expect(dialog.get_by_role("heading", name=heading, exact=False)).to_be_attached()
    language = dialog.get_by_role("region", name="#5 Language", exact=True)
    for text in ["Uno o más", "Ocurrencias válidas", "✓ spa", "Ocurrencias inválidas", "⚠ es"]:
        expect(language).to_contain_text(text)
    href = dialog.get_by_role("link", name="OAI GetRecord").get_attribute("href")
    assert parse_qs(urlsplit(href).query)["identifier"] == [FIRST]
    language.scroll_into_view_if_needed()
    dialog.screenshot(path=str(output / "ficha.png"))
    check_xml(page, dialog, output)
    dialog.get_by_role("button", name="Cerrar", exact=True).click()


def check_filters(page, report, output):
    count(page, 4000)
    choose_rule(page, "Reglas aprobadas")
    count(page, 1871)
    rule = page.get_by_role("link", name="#5 Language", exact=True)
    cells = page.get_by_role("row").filter(has=rule).get_by_role("cell")
    expect(cells.nth(2)).to_have_text("1871")
    expect(cells.nth(3)).to_have_text("0")
    expect(page.get_by_text("Registros", exact=True).locator("..")).to_contain_text("1871")
    page.screenshot(path=str(output / "seleccion.png"))
    select(page, "Filas por página", "10")
    compare_page(page, output, "registros-aprueban-5.csv")
    check_record(page, output)
    page.get_by_role("button").filter(has_text=re.compile(r"^2$")).click()
    expect(page.get_by_role("button", name=FIRST, exact=True)).to_have_count(0)
    page.reload()
    count(page, 1871)
    assert "pageNumber=1" in page.url
    page.get_by_label("Identificador OAI").fill("areandina/1000")
    page.get_by_label("Identificador OAI").press("Enter")
    count(page, 1)
    expect(page.get_by_role("button", name=FIRST)).to_be_visible()
    assert "pageNumber" not in page.url
    page.go_back()
    count(page, 1871)
    assert "pageNumber=1" in page.url

    page.get_by_role("link", name="#10 Access Level (M)", exact=True).click()
    dialog = page.get_by_role("dialog")
    expect(dialog).to_contain_text("Ocurrencias válidas · 1309")
    expect(dialog).to_contain_text("Ocurrencias inválidas · 6314")
    exported = download(page, "CSV del grupo completo · Ocurrencias inválidas", output / "10-invalid.csv")
    dialog.screenshot(path=str(output / "frecuencias-seleccion.png"))
    assert len(exported) == 42 and sum(int(row[1]) for row in exported[1:]) == 6314
    dialog.get_by_role("button", name="Cerrar", exact=True).click()
    choose_rule(page, "Reglas fallidas")
    count(page, 0)
    expect(page.get_by_text("Ningún registro coincide con los filtros.")).to_be_visible()
    page.get_by_role("button", name="Limpiar filtros").click()
    count(page, 4000)
    for field, value, total in [("Válido", "Válidos", 0), ("Válido", "Inválidos", 4000), ("Transformado", "Transformados", 0), ("Transformado", "Sin transformar", 4000)]:
        select(page, field, value)
        count(page, total)

    page.get_by_role("button", name="Limpiar filtros").click()
    count(page, 4000)
    choose_rule(page, "Reglas aprobadas", "#1 Publication Date (M)")
    count(page, 4000)
    choose_rule(page, "Reglas aprobadas")
    count(page, 1871)
    select(page, "Filas por página", "25")
    expect(page.get_by_role("table", name="Registros seleccionados").get_by_role("row")).to_have_count(26)
    page.get_by_role("link", name="Ver fallos de la regla 5", exact=True).click()
    count(page, 0)
    page.goto(report + "/invalid_rule/5")
    count(page, 2129)
    select(page, "Filas por página", "10")
    compare_page(page, output, "registros-fallan-5.csv")
    page.screenshot(path=str(output / "fallos.png"))


def check_cohorts(page, origin, output):
    base = origin + "/api/v5/dashboard/validation/source/AREANDINA/6"
    rows = [["filtros", "resumen", "registros", "aprueban_10", "fallan_10", "ocurrencias_validas_10", "ocurrencias_invalidas_10"]]
    # Expected values come from independently grouping active records in snapshot_6/validation.db.
    for filters, expected in [
        ({}, (4000, 4000, 1312, 2688, 1312, 8659)),
        ({"valid_rules": "5"}, (1871, 1871, 1309, 562, 1309, 6314)),
        ({"invalid_rules": "5"}, (2129, 2129, 3, 2126, 3, 2345)),
        ({"valid_rules": "5", "invalid_rules": "5"}, (0, 0, 0, 0, 0, 0)),
    ]:
        def read(suffix, **extra):
            response = page.request.get(base + suffix, params={**filters, **extra})
            assert response.ok, (response.url, response.status)
            return response.json()
        summary = read("")
        rule = summary["rulesByID"]["10"]
        totals = tuple(sum(item["count"] for item in read(f"/{group}_occrs/10")) for group in ["valid", "invalid"])
        actual = (summary["size"], read("/records", pageSize=1)["totalElements"], rule["validCount"], rule["invalidCount"], *totals)
        assert actual == expected, (filters, actual)
        rows.append([urlencode(filters) or "global", *actual])
    with (output / "selecciones.tsv").open("w") as handle:
        csv.writer(handle, delimiter="\t", lineterminator="\n").writerows(rows)


def check_access(page, origin, output):
    base = "/api/v5/dashboard/validation/source"
    xml = "/metadata?" + urlencode({"identifier": FIRST})
    controls = [
        ("/api/v5/me", 200),
        (base + "/UY/2?valid_rules=5", 403),
        (base + "/UY/2/valid_occrs/10?valid_rules=5", 403),
        (base + "/UY/2/invalid_occrs/10?valid_rules=5", 403),
        (base + "/UY/2" + xml, 403),
        (base + "/PA/6" + xml, 404),
        (base + "/AREANDINA/6/metadata?" + urlencode({"identifier": FIRST[:20]}), 404),
        (base + "/AREANDINA/6/metadata?identifier=", 400),
        ("/api/v5/snapshots/6/diagnostics/records/metadata?" + urlencode({"identifier": FIRST}), 404),
    ]
    rows = ["ruta\thttp"]
    for path, status in controls:
        response = page.request.get(origin + path)
        assert response.status == status, (path, response.status)
        if path == "/api/v5/me":
            user = response.json()
            assert user["roles"] == ["DASHBOARD"] and 33 in user["readableNetworkIds"]
        rows.append(f"{path}\t{status}")
    (output / "permisos.tsv").write_text("\n".join(rows) + "\n")


def run(browser, origin, output):
    output.mkdir(parents=True, exist_ok=True)
    context = browser.new_context(permissions=["clipboard-read", "clipboard-write"], locale="es-ES", viewport={"width": 1440, "height": 1080})
    page = context.new_page()
    trace = []
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))

    def response(r):
        url = urlsplit(r.url)
        if url.path.startswith("/api/v5/"):
            trace.append((r.request.method, url.path + ("?" + url.query if url.query else ""), r.status))
    page.on("response", response)
    report = origin.rstrip("/") + "/dashboard/es/AREANDINA/validation/6"
    page.goto(report)
    page.get_by_label("Usuario").fill("dashboard")
    page.get_by_label("Contraseña").fill(os.getenv("DASHBOARD_TEST_PASSWORD") or getpass.getpass())
    page.get_by_role("button", name="Iniciar sesión").click()
    expect(page.get_by_role("table", name="Reglas")).to_be_visible()
    assert not any("occrs" in path for _, path, _ in trace)
    page.screenshot(path=str(output / "informe.png"))
    check_rules(page, output)
    check_filters(page, report, output)
    check_cohorts(page, origin, output)
    check_access(page, origin, output)
    page.get_by_role("button", name="Cerrar sesión").click()
    expect(page.get_by_label("Usuario")).to_be_visible()
    path = "/api/v5/dashboard/validation/source/AREANDINA/6/metadata?" + urlencode({"identifier": FIRST})
    assert page.request.get(origin + path).status == 401
    with (output / "permisos.tsv").open("a") as handle:
        handle.write(f"{path}\t401\n")
    assert not errors, errors
    assert all(status < 400 or (path == "/api/v5/me" and status == 401) for _, path, status in trace)
    with (output / "http.tsv").open("w") as handle:
        writer = csv.writer(handle, delimiter="\t", lineterminator="\n")
        writer.writerow(["metodo", "ruta", "http"])
        writer.writerows(trace)
    context.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("origin")
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    if urlsplit(args.origin).hostname not in {"dashboard.localhost", "localhost", "127.0.0.1"}:
        parser.error("Se requiere un destino local")
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome")
        try:
            run(browser, args.origin, args.output)
        finally:
            browser.close()
