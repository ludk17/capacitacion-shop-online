const { test, expect } = require('@playwright/test');

test('Comprar el primer producto en la tienda', async ({ page }) => {
  // 1. Ir a la página principal
  await page.goto('/');

  // 2. Esperar a que carguen los productos (buscando el primer botón de agregar)
  const primerBotonAgregar = page.locator('button[id^="btn-agregar-"]').first();
  await expect(primerBotonAgregar).toBeVisible({ timeout: 10000 });

  // 3. Agregar el primer producto al carrito
  await primerBotonAgregar.click();

  // Esperar a que el botón indique "Agregado"
  await expect(primerBotonAgregar).toContainText('Agregado');

  // 4. Ir al carrito de compras
  const btnCart = page.locator('#btn-cart');
  await btnCart.click();

  // Verificar que estemos en la página del carrito
  await expect(page).toHaveURL(/.*carrito/);

  // 5. Finalizar la compra
  const btnFinalizarCompra = page.locator('#btn-finalizar-compra');
  await expect(btnFinalizarCompra).toBeVisible();
  await btnFinalizarCompra.click();

  // 6. Verificar el mensaje de éxito de la compra
  const mensajeExito = page.locator('text="¡Compra realizada!"');
  await expect(mensajeExito).toBeVisible({ timeout: 10000 });
});
