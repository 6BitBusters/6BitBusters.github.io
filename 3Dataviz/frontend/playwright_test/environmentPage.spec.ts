import { test, expect } from "@playwright/test";

test.describe("HomePage", () => {
  test("homePage selection visible", async ({ page }) => {
    await page.goto("/");

    const canvas = await page.locator("div.containerHome");
    await expect(canvas).toBeVisible();
  });

  test("Apri il menu a tendina", async ({ page }) => {
    await page.goto("/");

    await page.locator("div.containerHome");
    await page.locator("div.css-13cymwt-control").click();
    const options = await page.locator("div.css-1nmdiq5-menu");
    await expect(options).toBeVisible();
  });

  test("Apri il menu a tendina e scegli la prima opzione", async ({ page }) => {
    await page.goto("/");

    await page.locator("div.containerHome");
    await page.locator("div.css-13cymwt-control").click();
    await page
      .getByRole("option", { name: "0 - Tassi di cambio 21x200" })
      .click();
    await page.locator("input", { hasText: "Avanti" }).click();
    await page.waitForURL("http://localhost:5173/environment");
  });
});

test.describe("EnvironmentPage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("div.containerHome");
    await page.locator("div.css-13cymwt-control").click();
    await page
      .getByRole("option", { name: "0 - Tassi di cambio 21x200" })
      .click();
    await page.locator("input", { hasText: "Avanti" }).click();
    await page.waitForURL("http://localhost:5173/environment");
  });
  test("canvas visible", async ({ page }) => {
    const canvas = await page.locator("canvas");
    await page.waitForTimeout(2000);
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  test("camera can pan on Y axis", async ({ page }) => {
    const canvas = await page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 10000 });

    const before = await page.screenshot({ fullPage: true });
    const box = await canvas.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;

      await page.mouse.down({ button: "right" });
      await page.mouse.move(startX, startY + 200);
      await page.mouse.up({ button: "right" });
    }
    await page.waitForTimeout(2000);

    const after = await page.screenshot({ fullPage: true });
    expect(before).not.toBe(after);
  });

  test("camera can pan on X axis", async ({ page }) => {
    const canvas = await page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 10000 });

    const before = await page.screenshot({ fullPage: true });
    const box = await canvas.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;

      await page.mouse.down({ button: "right" });
      await page.mouse.move(startX + 200, startY);
      await page.mouse.up({ button: "right" });
    }
    await page.waitForTimeout(2000);

    const after = await page.screenshot({ fullPage: true });
    expect(before).not.toBe(after);
  });

  test("camera can rotation on Y axis", async ({ page }) => {
    const canvas = await page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 15000 });

    const before = await page.screenshot({ fullPage: true });
    const box = await canvas.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;

      await page.mouse.down({ button: "left" });
      await page.mouse.move(startX, startY + 200);
      await page.mouse.up({ button: "left" });
    }
    await page.waitForTimeout(2000);

    const after = await page.screenshot({ fullPage: true });
    expect(before).not.toBe(after);
  });

  test("camera can rotation on X axis", async ({ page }) => {
    const canvas = await page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 10000 });

    const before = await page.screenshot({ fullPage: true });
    const box = await canvas.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;

      await page.mouse.down({ button: "left" });
      await page.mouse.move(startX + 200, startY);
      await page.mouse.up({ button: "left" });
    }
    await page.waitForTimeout(2000);

    const after = await page.screenshot({ fullPage: true });
    expect(before).not.toBe(after);
  });

  test("camera zoom in", async ({ page }) => {
    const canvas = await page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 10000 });

    const before = await page.screenshot({ fullPage: true });
    const box = await canvas.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;

      await page.mouse.move(startX, startY);
      await page.mouse.wheel(0, 300);
    }
    await page.waitForTimeout(2000);

    const after = await page.screenshot({ fullPage: true });
    expect(before).not.toBe(after);
  });

  test("camera zoom out", async ({ page }) => {
    const canvas = await page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 10000 });

    const before = await page.screenshot({ fullPage: true });
    const box = await canvas.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;

      await page.mouse.move(startX, startY);
      await page.mouse.wheel(0, 300);
    }
    await page.waitForTimeout(2000);

    const after = await page.screenshot({ fullPage: true });
    expect(before).not.toBe(after);
  });
});
