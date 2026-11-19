"""Comparación de las cosechas históricas #1 y #4 de PA en la copia Docker."""
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


def display(value, index, delta=False):
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
            text += " pp" if delta else " %"
    return ("−" if value < 0 else "+" if value > 0 and delta else "") + text


def screenshot(page, path):
    expect(page.get_by_role("listbox")).to_have_count(0)
    page.evaluate("window.scrollTo(0, 0)")
    page.screenshot(path=str(path), full_page=True, animations="disabled")


def verify(page, output, password):
    page.goto(ORIGIN + "/dashboard/es/")
    page.get_by_label("Usuario").fill("developer")
    page.get_by_label("Contraseña").fill(password)
    page.get_by_role("button", name="Iniciar sesión").click()
    expect(page.get_by_role("combobox", name="Repositorio")).to_be_visible()
    me = page.request.get(ORIGIN + "/api/v5/me")
    assert me.ok and "ADMIN" in me.json()["roles"]

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

    table = page.get_by_role("table", name="Cosechas")
    expect(table.get_by_role("row")).to_have_count(4)
    assert table.get_by_role("link").all_text_contents() == ["#1", "#3", "#4"]
    for i, row_id in enumerate((1, 3, 4), start=1):
        cells = table.get_by_role("row").nth(i).get_by_role("cell").all_text_contents()
        row = rows[row_id]
        counts = [row["harvestedSize"], row["validSize"], row["harvestedSize"] - row["validSize"], row["transformedSize"]]
        assert [int(cell.replace(".", "")) for cell in cells[1:5]] == counts
        assert cells[-1] == display(metrics(row)[3], 3)

    page.get_by_role("combobox", name=re.compile("^Referencia")).click()
    page.get_by_role("option", name=re.compile("^#1 ")).click()
    expect(page.get_by_role("heading", name="#1 → #4")).to_be_visible()
    expect(page.get_by_role("link", name="Ver diagnóstico #4")).to_have_attribute("href", re.compile(r"/PA/validation/4$"))
    comparison = []
    a, b = metrics(rows[1]), metrics(rows[4])
    for i, label in enumerate(["Cosechados", "Tasa de validez", "Transformados", "Duración"]):
        delta = b[i] - a[i]
        caption = f"{display(delta, i, True)} · #1 ({display(a[i], i)})"
        card = page.get_by_text(caption, exact=True).locator("..")
        expect(card.get_by_text(label, exact=True)).to_be_visible()
        expect(card.get_by_text(display(b[i], i), exact=True)).to_be_visible()
        comparison.append([label, a[i], b[i], delta, card.inner_text().replace("\n", " | ")])

    expect(page.get_by_role("img", name="Registros por cosecha")).to_be_visible()
    screenshot(page, output / "volumen.png")
    page.get_by_role("combobox", name=re.compile("^Indicador")).click()
    page.get_by_role("option", name="Duración", exact=True).click()
    expect(page.get_by_role("img", name="Duración (min)")).to_be_visible()
    screenshot(page, output / "duracion.png")

    (output / "historial-api.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    with (output / "comparacion.tsv").open("w", newline="") as f:
        writer = csv.writer(f, delimiter="\t", lineterminator="\n")
        writer.writerow(["indicador", "referencia_1", "destino_4", "diferencia", "texto_visible"])
        writer.writerows(comparison)
    print(f"HTTP {api.status} {api.request.method} {api.url}")
    for item in comparison:
        print(*item, sep=" | ")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    output = parser.parse_args().output
    password = getpass("Contraseña de developer en la copia: ")
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome")
        ctx = browser.new_context(locale="es-ES", timezone_id="Europe/Madrid", viewport={"width": 1440, "height": 1060})
        output.mkdir(parents=True, exist_ok=True)
        try:
            verify(ctx.new_page(), output, password)
        finally:
            ctx.close()
            browser.close()
