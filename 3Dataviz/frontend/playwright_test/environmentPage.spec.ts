import { test, expect } from "@playwright/test";

test("canvas visible", async ({ page }) => {
  await page.goto("/environment");

  const canvas = await page.locator("canvas");
  await expect(canvas).toBeVisible();
});

test("camera can pan on Y axis", async ({ page }) => {
  await page.goto("/environment");

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
  await page.goto("/environment");

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
  await page.goto("/environment");

  const canvas = await page.locator("canvas");
  await canvas.waitFor({ state: "visible", timeout: 10000 });

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
  await page.goto("/environment");

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
  await page.goto("/environment");

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
  await page.goto("/environment");

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
