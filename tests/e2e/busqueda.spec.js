import { test, expect } from '@playwright/test';

const PRODUCTO_EXISTENTE = 'Mouse';
const PRODUCTO_INEXISTENTE = 'xyzProductoQueNoExiste123';

test.describe('Búsqueda de productos', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Esperar a que los productos carguen
    await page.waitForSelector('article', { timeout: 8000 });
  });

  // ── 1. El buscador existe y es visible ──────────────────────────────────────
  test('el campo de búsqueda es visible', async ({ page }) => {
    const input = page.locator('#input-buscar');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', /buscar/i);
  });

  // ── 2. Buscar un producto que existe filtra la lista ────────────────────────
  test('buscar un producto existente filtra los resultados', async ({ page }) => {
    const input = page.locator('#input-buscar');
    const cards = page.locator('article');

    // Total inicial de productos
    const totalInicial = await cards.count();
    expect(totalInicial).toBeGreaterThan(0);

    // Escribir en el buscador
    await input.fill(PRODUCTO_EXISTENTE);

    // Todos los resultados deben contener el texto buscado (case-insensitive)
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(totalInicial);

    // Cada card visible debe mencionar el término buscado en su título
    for (let i = 0; i < count; i++) {
      const texto = await cards.nth(i).locator('h2').innerText();
      expect(texto.toLowerCase()).toContain(PRODUCTO_EXISTENTE.toLowerCase());
    }
  });

  // ── 3. Buscar un producto inexistente muestra mensaje vacío ─────────────────
  test('buscar un término sin resultados muestra mensaje de vacío', async ({ page }) => {
    const input = page.locator('#input-buscar');

    await input.fill(PRODUCTO_INEXISTENTE);

    // No deben aparecer cards
    const cards = page.locator('article');
    await expect(cards).toHaveCount(0);

    // Debe aparecer el mensaje de "no se encontraron"
    await expect(
      page.getByText(/no se encontraron productos/i)
    ).toBeVisible();
  });

  // ── 4. Limpiar búsqueda restaura todos los productos ───────────────────────
  test('limpiar el buscador restaura todos los productos', async ({ page }) => {
    const input = page.locator('#input-buscar');
    const cards = page.locator('article');

    const totalInicial = await cards.count();

    // Filtra
    await input.fill(PRODUCTO_EXISTENTE);
    await expect(cards.first()).toBeVisible();

    // Limpia con el botón X
    await page.locator('button[aria-label="Limpiar búsqueda"]').click();

    // Deben volver todos los productos
    await expect(cards).toHaveCount(totalInicial);
    await expect(input).toHaveValue('');
  });

  // ── 5. La búsqueda es case-insensitive ──────────────────────────────────────
  test('la búsqueda no distingue mayúsculas de minúsculas', async ({ page }) => {
    const input = page.locator('#input-buscar');
    const cards = page.locator('article');

    // Minúsculas
    await input.fill(PRODUCTO_EXISTENTE.toLowerCase());
    const countMin = await cards.count();

    // Mayúsculas
    await input.fill(PRODUCTO_EXISTENTE.toUpperCase());
    const countMay = await cards.count();

    expect(countMin).toBe(countMay);
  });

});
