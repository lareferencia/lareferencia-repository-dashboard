"""Comparación de las cosechas históricas #3 y #4 de PA en la copia Docker."""
import argparse
import csv
from datetime import datetime
from getpass import getpass
import json
from pathlib import Path
import re
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright


ORIGIN = "http://dashboard.localhost:64065"
ROUTE = "/dashboard/es/PA/harvesting"
HISTORY = "/api/v5/dashboard/harvesting/source/PA/history/2026-10-03/2026-10-04"


def metrics(row):
    stamp = "%Y-%m-%dT%H:%M:%S.%f"
    elapsed = datetime.strptime(row["endTime"], stamp) - datetime.strptime(row["startTime"], stamp)
    return [row["harvestedSize"], 100 * row["validSize"] / row["harvestedSize"],
            row["transformedSize"], round(elapsed.total_seconds())]


def display(value, index):
    n = abs(value)
    if index == 3:
        if n >= 3600:
            text = f"{n // 3600}h {n % 3600 // 60}min"
        elif n >= 60:
            text = f"{n // 60}min {n % 60}s"
        else:
            text = f"{n}s"
    else:
        text = f"{n:,.0f}".replace(",", ".") if n >= 10000 else f"{n:g}"
        if index == 1:
            text += " %"
    return text


def screenshot(page, path):
    expect(page.get_by_role("listbox")).to_have_count(0)
    page.evaluate("window.scrollTo(0, 0)")
    page.screenshot(path=str(path), full_page=True, animations="disabled")


def verify_changes(page, comparison_table, reference, target):
    comparison = []
    a, b = metrics(reference), metrics(target)
    for i, label in enumerate(["Cosechados", "Tasa de validez", "Transformados", "Duración"]):
        delta = b[i] - a[i]
        row = comparison_table.get_by_role("row").filter(has=page.get_by_role("rowheader", name=label, exact=True))
        status = "Sin cambio" if delta == 0 else (f"{abs(delta):g} puntos porcentuales" if i == 1 else display(abs(delta), i)) + (" menos" if delta < 0 else " más")
        for cell, expected in enumerate([display(a[i], i), display(b[i], i), status]):
            expect(row.get_by_role("cell").nth(cell)).to_have_text(expected)
        comparison.append([label, a[i], b[i], delta, status])

    return comparison


def verify(page, output, password):
    page.goto(ORIGIN + "/dashboard/es/")
    page.get_by_label("Usuario").fill("dashboard")
    page.get_by_label("Contraseña").fill(password)
    page.get_by_role("button", name="Iniciar sesión").click()
    expect(page.get_by_role("heading", name="¿Qué quieres consultar?")).to_be_visible()
    me = page.request.get(ORIGIN + "/api/v5/me")
    assert me.ok and "DASHBOARD" in me.json()["roles"]

    page.goto(ORIGIN + ROUTE)
    expect(page.get_by_role("combobox", name="Repositorio")).to_have_value("PA · Nodo Panama")
    page.get_by_label("Desde").fill("2026-10-03")
    page.get_by_label("Hasta").fill("2026-10-04")
    with page.expect_response(lambda r: urlsplit(r.url).path == HISTORY) as response:
        page.get_by_role("button", name="Aplicar").click()
    api = response.value
    assert api.status == 200 and api.request.method == "GET"
    payload = api.json()
    rows = {row["id"]: row for row in payload["content"]}
    assert set(rows) == {1, 3, 4} and payload["totalElements"] == 3

    table = page.get_by_role("table", name="Cosechas", exact=True)
    expect(table.get_by_role("row")).to_have_count(4)
    assert table.get_by_role("link").all_text_contents() == ["#1", "#3", "#4"]
    for i, row_id in enumerate((1, 3, 4), start=1):
        cells = table.get_by_role("row").nth(i).get_by_role("cell").all_text_contents()
        row = rows[row_id]
        counts = [row["harvestedSize"], row["validSize"], row["harvestedSize"] - row["validSize"], row["transformedSize"]]
        assert [int(cell.replace(".", "")) for cell in cells[1:5]] == counts
        assert cells[-1] == display(metrics(row)[3], 3)

    comparison_table = page.get_by_role("table", name="Comparación de cosechas")
    toggle = page.get_by_role("button", name="Comparar dos cosechas", exact=True)
    expect(comparison_table).to_have_count(0)
    expect(toggle).to_have_attribute("aria-expanded", "false")
    expect(page.get_by_role("img", name="Registros por cosecha")).to_be_visible()
    screenshot(page, output / "evolucion.png")
    toggle.click()
    expect(comparison_table).to_be_visible()
    for label, stamp in [("^Referencia", "#3 · 4 oct 2026, 9:17"), ("^Comparar con", "#4 · 4 oct 2026, 10:50")]:
        expect(page.get_by_role("combobox", name=re.compile(label))).to_contain_text(stamp)

    comparison = verify_changes(page, comparison_table, rows[3], rows[4])

    # The captured section includes the time selectors, both diagnosis links and all four changes.
    panel = comparison_table.locator("xpath=ancestor::section[1]")
    panel.screenshot(path=str(output / "comparacion.png"), animations="disabled")
    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_function("document.documentElement.scrollWidth === 390", timeout=5000)
    assert comparison_table.evaluate("(table) => table.scrollWidth <= table.parentElement.clientWidth")
    panel.screenshot(path=str(output / "comparacion-movil.png"), animations="disabled")
    page.set_viewport_size({"width": 1440, "height": 1060})
    for snapshot in [3, 4]:
        endpoint = f"/api/v5/dashboard/validation/source/PA/{snapshot}"
        with page.expect_response(lambda r: urlsplit(r.url).path == endpoint) as diagnostic:
            panel.get_by_role("link", name=f"Ver diagnóstico #{snapshot}").click()
        assert diagnostic.value.status == 200 and diagnostic.value.json()["size"] == rows[snapshot]["harvestedSize"]
        expect(page.get_by_role("heading", name=f"PA · Snapshot #{snapshot}")).to_be_visible()
        page.go_back()
        expect(comparison_table).to_be_visible()

    page.get_by_role("combobox", name=re.compile("^Referencia")).click()
    page.get_by_role("option", name=re.compile("^#1 ")).click()
    verify_changes(page, comparison_table, rows[1], rows[4])
    page.get_by_role("button", name="Ocultar comparación").click()
    expect(comparison_table).to_have_count(0)
    expect(toggle).to_be_visible()
    (output / "historial-api.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    with (output / "comparacion.tsv").open("w", newline="") as f:
        writer = csv.writer(f, delimiter="\t", lineterminator="\n")
        writer.writerow(["indicador", "referencia_3", "destino_4", "diferencia", "texto_visible"])
        writer.writerows(comparison)
    print(f"HTTP {api.status} {api.request.method} {api.url}")
    for item in comparison:
        print(*item, sep=" | ")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    output = parser.parse_args().output
    password = getpass("Contraseña de dashboard en la copia: ")
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome")
        ctx = browser.new_context(locale="es-ES", timezone_id="Europe/Madrid", viewport={"width": 1440, "height": 1060})
        output.mkdir(parents=True, exist_ok=True)
        try:
            verify(ctx.new_page(), output, password)
        finally:
            ctx.close()
            browser.close()
