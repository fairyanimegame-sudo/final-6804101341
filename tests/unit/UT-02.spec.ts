import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

test('UT-02: product button state Add to cart -> Remove -> Add to cart', {
  annotation: {
    type: 'description',
    description: 'ตรวจสอบสถานะปุ่ม Add to cart และ Remove รวมถึง Cart Badge'
  }
}, async ({ page }) => {
  const addButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  const removeButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
  const cartBadge = page.locator('[data-test="shopping-cart-badge"]');

  await test.step('Login เข้าสู่ระบบ', async () => {
    await page.goto(BASE_URL);
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  await test.step('ตรวจสอบปุ่มก่อนเพิ่มสินค้า', async () => {
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveText('Add to cart');
    await expect(removeButton).toHaveCount(0);
    await expect(cartBadge).toHaveCount(0);
  });

  await test.step('เพิ่มสินค้าเข้า Cart', async () => {
    await addButton.click();
    await expect(removeButton).toBeVisible();
    await expect(removeButton).toHaveText('Remove');
    await expect(addButton).toHaveCount(0);
    await expect(cartBadge).toHaveText('1');
  });

  await test.step('ลบสินค้าออกจาก Cart', async () => {
    await removeButton.click();
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveText('Add to cart');
    await expect(removeButton).toHaveCount(0);
    await expect(cartBadge).toHaveCount(0);
  });
});