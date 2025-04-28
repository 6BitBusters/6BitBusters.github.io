import { test, expect } from "@playwright/test";

test.describe("HomePage", () => {
  test("Verifica che la selezione della HomePage sia visibile.", async ({
    page,
  }) => {
    await page.goto("/");

    const selection = await page.locator("div.containerHome");
    await expect(selection).toBeVisible();
  });

  test("Verifica che il menu a tendina si apra e diventi visibile.", async ({
    page,
  }) => {
    await page.goto("/");

    await page.locator("div.containerHome");
    await page.locator("div.css-13cymwt-control").click();
    const options = await page.locator("div.css-1nmdiq5-menu");
    await expect(options).toBeVisible();
  });

  test("Verifica che, dopo aver aperto il menu a tendina, la selezione della prima opzione sia possibile e, una volta selezionata, l'azione associata venga eseguita.", async ({
    page,
  }) => {
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

test.describe("ErrorPage", () => {
  test.beforeEach(async ({ page }) => {});

  test("Verifica che se il riperimento dei dataset restituisce un errore l`utente venga reindirizzato alla pagina di errore", async ({
    page,
  }) => {
    await page.route("http://localhost:3000/data-source", async (route) => {
      await route.abort("failed"); // 'failed' simula un errore generico di richiesta
    });
    await page.goto("/");
    await expect(page.locator("div.containerError")).toBeVisible();
    await expect(page.locator("h2", { hasText: "Server Error" })).toBeVisible();
  });

  test("Verifica che se il riperimento dei dati del dataset restituisce un errore l`utente venga reindirizzato alla pagina di errore", async ({
    page,
  }) => {
    await page.route(
      "http://localhost:3000/data-visualization/0",
      async (route) => {
        await route.abort("failed"); // 'failed' simula un errore generico di richiesta
      },
    );
    await page.goto("/");
    await page.locator("div.containerHome");
    await page.locator("div.css-13cymwt-control").click();
    await page
      .getByRole("option", { name: "0 - Tassi di cambio 21x200" })
      .click();
    await page.locator("input", { hasText: "Avanti" }).click();
    await page.waitForURL("http://localhost:5173/error");
    await expect(page.locator("div.containerError")).toBeVisible();
    await expect(page.locator("h2", { hasText: "Server Error" })).toBeVisible();
  });
});

test.describe("EnvironmentPage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("div.containerHome");
    await page.locator("div.css-13cymwt-control").click();
    await page
      .getByRole("option", { name: "2 - Popolazione per anno 50x26" })
      .click();
    await page.locator("input", { hasText: "Avanti" }).click();
    await page.waitForURL("http://localhost:5173/environment");
  });
  test("Verifica che il canvas sia visibile.", async ({ page }) => {
    const canvas = await page.locator("canvas");
    await page.waitForTimeout(2000);
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  test("Verifica che la camera possa effettuare una panoramica (pan) lungo l'asse Y.", async ({
    page,
  }) => {
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

  test("Verifica che la camera possa effettuare una panoramica (pan) lungo l'asse X.", async ({
    page,
  }) => {
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

  test("Verifica che la camera possa ruotare attorno all'asse Y.", async ({
    page,
  }) => {
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

  test("Verifica che la camera possa ruotare attorno all'asse X.", async ({
    page,
  }) => {
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

  test("Verifica che la camera possa effettuare lo zoom in (avvicinamento).", async ({
    page,
  }) => {
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

  test("Verifica che la camera possa effettuare lo zoom out (allontanamento).", async ({
    page,
  }) => {
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
