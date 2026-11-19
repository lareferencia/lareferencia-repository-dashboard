"""Chrome + API real. Solicita la contraseña por terminal o DASHBOARD_TEST_PASSWORD."""
import argparse
import getpass
import os
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright


def verify(browser, origin, output):
    context = browser.new_context(locale="es-ES", viewport={"width": 1440, "height": 1000})
    page = context.new_page()
    trace = []
    page.on("response", lambda r: trace.append((r.request.method, urlsplit(r.url).path, r.status))
            if "/api/v5/" in r.url else None)
    root = origin + "/dashboard/es/"
    api = origin + "/api/v5"
    def control(path):
        result = context.request.get(api + path)
        trace.append(("GET", "/api/v5" + path, result.status))
        return result

    page.goto(root)
    expect(page.get_by_label("Usuario")).to_be_visible()
    page.get_by_label("Usuario").fill("dashboard")
    page.get_by_label("Contraseña").fill(os.environ.get("DASHBOARD_TEST_PASSWORD") or getpass.getpass())
    page.get_by_role("button", name="Iniciar sesión").click()
    expect(page.get_by_role("heading", name="¿Qué quieres consultar?")).to_be_visible()
    me = control("/me")
    assert me.ok and me.json()["roles"] == ["DASHBOARD"], (me.status, me.json().get("roles"))
    listed = control("/dashboard/harvesting/source/list?page=0&size=100")
    assert listed.ok
    sources = {s["acronym"]: s for s in listed.json()["content"]}
    assert set(sources) == {"AREANDINA", "PA"}
    assert {s["id"] for s in sources.values()} == set(me.json()["readableNetworkIds"])
    output.mkdir(parents=True, exist_ok=True)
    selector = page.get_by_role("combobox", name="Repositorio")
    selector.click()
    expect(page.get_by_role("option")).to_have_count(len(sources))
    selector.fill("panamá")
    expect(page.get_by_role("option", name="PA · Nodo Panama")).to_be_visible()
    expect(page.get_by_role("option")).to_have_count(1)
    page.screenshot(path=str(output / "buscar-repositorio.png"), animations="disabled")
    selector.press("Enter")
    expect(page.get_by_role("heading", name=sources["PA"]["name"])).to_be_visible()
    expect(page.get_by_role("link", name="Validaciones", exact=True)).to_have_attribute("href", "/dashboard/es/PA/validation")
    page.screenshot(path=str(output / "portada-pa.png"), animations="disabled")
    page.get_by_role("link", name="Cosechas", exact=True).click()
    table = page.get_by_role("table", name="Cosechas")
    expect(table.get_by_role("link", name="#4", exact=True)).to_be_visible()
    page.get_by_role("link", name="Inicio", exact=True).click()
    expect(selector).to_have_value("PA · Nodo Panama")
    selector.fill("areand")
    page.get_by_role("option", name="AREANDINA · " + sources["AREANDINA"]["name"]).click()
    page.set_viewport_size({"width": 390, "height": 844})
    assert page.evaluate("document.documentElement.scrollWidth") == 390
    expect(page.get_by_role("heading", name=sources["AREANDINA"]["name"])).to_be_visible()
    page.screenshot(path=str(output / "portada-movil.png"), full_page=True, animations="disabled")
    page.set_viewport_size({"width": 1440, "height": 1000})
    with page.expect_response(lambda r: r.url.endswith("/validation/source/AREANDINA/6")) as summary:
        page.get_by_role("link", name="Validaciones", exact=True).click()
    assert summary.value.ok
    report = summary.value.json()
    assert (report["size"], report["validSize"], report["transformedSize"], len(report["rulesByID"])) == (4000, 0, 0, 14)
    rule = page.get_by_role("link", name="#5 Language", exact=True)
    row = page.get_by_role("row").filter(has=rule)
    expect(row).to_contain_text("46,8%")
    rule.click()
    dialog = page.get_by_role("dialog", name="#5 Language")
    expect(dialog).to_contain_text("dc:language")
    expect(dialog).to_contain_text("Opcional")
    expect(dialog).to_contain_text("ONE_OR_MORE")
    expected = root + "AREANDINA/validation/6?rule=5"
    expect(page).to_have_url(expected)
    page.reload()
    expect(dialog).to_be_visible()
    page.screenshot(path=str(output / "regla-5.png"))
    page.go_back()
    expect(dialog).not_to_be_visible()
    expect(rule).to_be_visible()
    page.go_forward()
    expect(dialog).to_be_visible()
    dialog.get_by_role("button", name="Cerrar").click()
    assert control("/dashboard/harvesting/source/UY").status == 403
    assert control("/networks").status == 404
    page.get_by_role("button", name="Cerrar sesión").click()
    expect(page.get_by_role("button", name="Iniciar sesión")).to_be_visible()
    assert control("/me").status == 401
    (output / "http.tsv").write_text("metodo\truta\thttp\n" + "".join(
        f"{method}\t{path}\t{status}\n" for method, path, status in trace))
    context.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("origin", help="Origen local del candidato")
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    if urlsplit(args.origin).hostname not in ("dashboard.localhost", "localhost", "127.0.0.1"):
        parser.error("Se requiere un destino local")
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome")
        try:
            verify(browser, args.origin.rstrip("/"), args.output)
        finally:
            browser.close()
