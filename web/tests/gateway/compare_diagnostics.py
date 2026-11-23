"""Compare the two diagnostics UIs on a single local Docker gateway."""
import argparse
import getpass
import re
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

IDENTIFIER = "oai:digitk.areandina.edu.co:areandina/1000"


def capture(browser, role, password, port, output, dom_dir=None):
    admin = role == "admin"
    origin = f"http://{role}.localhost:{port}"
    path = "/admin/networks/33/diagnostics?snapshot=6" if admin else "/dashboard/es/AREANDINA/validation/6"
    context = browser.new_context(locale="es-ES", timezone_id="Europe/Madrid",
                                  viewport={"width": 1440, "height": 1000}, reduced_motion="reduce")
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))

    def shot(name):
        screenshot(page, output, role, name)

    page.goto(origin + path)
    page.get_by_label("Usuario").fill("developer" if admin else "dashboard")
    page.get_by_label("Contraseña").fill(password)
    page.get_by_role("button", name="Ingresar" if admin else "Iniciar sesión").click()
    language = page.get_by_role("row").filter(has=page.get_by_text("Language", exact=True))
    expect(language).to_contain_text("1871")
    expect(language).to_contain_text("2129")
    expect(page.get_by_text("H: 4000")).to_be_visible()
    identity = context.request.get(origin + "/api/v5/me").json()
    assert ("ADMIN" if admin else "DASHBOARD") in identity["roles"]
    expect(page.get_by_text("Snapshot #6", exact=False).first).to_contain_text("20:16")
    shot("informe")
    if dom_dir:
        (dom_dir / f"{role}.html").write_text(page.locator("main").evaluate("el => el.outerHTML"))
    snapshot = page.get_by_role("combobox", name=re.compile(r"^Snapshot(?: |$)"))
    snapshot.focus()
    snapshot.press("ArrowDown")
    expect(page.get_by_role("option").filter(has_text="#6")).to_contain_text("20:16")
    shot("snapshot")
    page.keyboard.press("Escape")

    compare_rules(page, admin, language, shot)
    page.goto(origin + path)

    compare_records(page, admin, shot)
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(origin + path)
    expect(language).to_contain_text("2129")
    shot("movil")
    width = page.evaluate("document.documentElement.scrollWidth")
    print(f"{role}: ancho del documento móvil {width}px", flush=True)
    if not admin:
        assert width == 390, width
    assert not errors, errors
    context.close()


def screenshot(page, output, role, name):
    page.mouse.move(1438, 1)
    page.screenshot(path=output / f"{role}-{name}.png", animations="disabled")


def compare_rules(page, admin, language, shot):
    page.get_by_text("Cumplimiento de reglas", exact=True).evaluate("el => el.scrollIntoView()")
    shot("reglas")

    language.get_by_text("Ocurrencias" if admin else "Ver ocurrencias", exact=True).click()
    dialog = page.get_by_role("dialog")
    expect(dialog.get_by_text("2274", exact=True)).to_be_visible()
    shot("frecuencias")
    dialog.get_by_role("button", name="Cerrar", exact=True).click()

    # Both surfaces support failed-rule selection for the same comparison cohort.
    if admin:
        page.get_by_role("combobox", name="Regla fallida").click()
        page.get_by_role("option", name="Language", exact=True).click()
    else:
        page.get_by_role("combobox", name="Reglas fallidas").click()
        page.get_by_role("option", name="#5 Language", exact=True).click()
    expect(language.get_by_role("cell").nth(2)).to_have_text("0")
    expect(language.get_by_role("cell").nth(3)).to_have_text("2129")
    page.evaluate("scrollTo(0, 0)")
    shot("filtro")


def compare_records(page, admin, shot):
    search = page.get_by_label("Buscar identificador" if admin else "Identificador OAI", exact=True)
    table = page.locator("table").last
    expect(table.locator("tbody tr")).to_have_count(25)
    first_id = table.locator("tbody td").first.inner_text()
    page.get_by_role("button").filter(has_text=re.compile(r"^2$")).click()
    expect(table.locator("tbody td").first).not_to_have_text(first_id)
    expect(table.locator("tbody td").first).to_have_text("oai:digitk.areandina.edu.co:areandina/1026")
    expect(table.locator("tbody tr")).to_have_count(25)
    table.evaluate("el => el.parentElement.parentElement.scrollIntoView()")
    shot("pagina-2")
    search.fill(IDENTIFIER)
    search.press("Enter")
    row = page.get_by_role("row").filter(has=page.get_by_text(IDENTIFIER, exact=True))
    expect(row).to_have_count(1)
    expect(page.locator("table").last.locator("tbody tr")).to_have_count(1)
    page.evaluate("scrollTo(0, document.body.scrollHeight)")
    shot("registros")
    row.get_by_role("button", name="Detalle", exact=True).click()
    dialog = page.get_by_role("dialog")
    expect(dialog.get_by_text(IDENTIFIER, exact=True).first).to_be_visible()
    shot("ficha")
    dialog.get_by_role("tab", name="XML publicado" if admin else "XML histórico").click()
    dialog.get_by_label("Buscar en XML" if admin else "Buscar en el XML").fill("<field")
    expect(dialog.locator("pre")).to_contain_text("Ramírez")
    shot("xml")
    dialog.get_by_role("button", name="Cerrar", exact=True).click()

    search.fill("sin-coincidencia-AREANDINA-6")
    search.press("Enter")
    expect(page.get_by_text("No hay registros para estos filtros." if admin else "Ningún registro coincide con los filtros.")).to_be_visible()
    page.evaluate("scrollTo(0, document.body.scrollHeight)")
    shot("vacio")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("port", type=int)
    parser.add_argument("output", type=Path)
    parser.add_argument("--dom-dir", type=Path, help="Directorio temporal para comparar la estructura renderizada")
    args = parser.parse_args()
    if args.dom_dir:
        args.dom_dir.mkdir(parents=True, exist_ok=True)
    args.output.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome")
        for role in ("admin", "dashboard"):
            capture(browser, role, getpass.getpass(f"Contraseña ({role}): "), args.port, args.output, args.dom_dir)
        browser.close()
