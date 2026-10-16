import { test, expect, type BrowserContext, type Page } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';
const INVENTORY_URL = `${BASE_URL}inventory.html`;

/**
 * DRIVER: เตรียมสถานะ Login โดยไม่ผ่าน Login Form
 * - ตั้ง Cookie `session-username` = standard_user บนโดเมน www.saucedemo.com
 * - เปิดหน้า Inventory จริงโดยตรง
 */
async function driverOpenInventory(context: BrowserContext): Promise<Page> {
  await context.addCookies([
    {
      name: 'session-username',
      value: 'standard_user',
      domain: 'www.saucedemo.com',
      path: '/',
    },
  ]);
  const page = await context.newPage();
  await page.goto(INVENTORY_URL);
  return page;
}

test('IT-02: DRIVER login state -> REAL Inventory and Cart', {
  annotation: {
    type: 'description',
    description: 'ใช้ Driver เตรียมสถานะ Login เพื่อทดสอบ Inventory และ Cart จริง'
  }
}, async ({ browser }) => {
  const context = await browser.newContext();
  try {
    let page!: Page;

    await test.step('สร้าง Driver และเปิด Inventory', async () => {
      page = await driverOpenInventory(context);
      await expect(page).toHaveURL(INVENTORY_URL);
    });

    await test.step('ตรวจสอบ Inventory จริง', async () => {
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    });

    await test.step('เพิ่มสินค้า 2 รายการ', async () => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    });

    await test.step('ตรวจสอบสินค้าใน Cart', async () => {
      await page.locator('[data-test="shopping-cart-link"]').click();
      await expect(page).toHaveURL(/cart\.html/);
      const names = page.locator('[data-test="inventory-item-name"]');
      await expect(names).toHaveCount(2);
      await expect(names).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    });
  } finally {
    // ปิด BrowserContext ที่สร้างเองเมื่อสิ้นสุดการทดสอบ
    await context.close();
  }
});