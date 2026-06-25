import { expect, test } from "@playwright/test";

test.describe("D&D cell swap", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("table td input").first()).toBeVisible();
  });

  test("ハンバーガーアイコンをドラッグして別セルにドロップするとテキストが入れ替わる", async ({
    page,
  }) => {
    const inputs = await page.locator("table td input").all();
    await inputs[0].fill("AAA");
    await inputs[1].fill("BBB");

    const handles = await page.locator('span:has-text("☰")').all();
    const handleBox = await handles[0].boundingBox();
    const targetHandle = await handles[1].boundingBox();

    if (!handleBox || !targetHandle) throw new Error("Missing elements");

    const startX = handleBox.x + handleBox.width / 2;
    const startY = handleBox.y + handleBox.height / 2;
    const endX = targetHandle.x + targetHandle.width / 2;
    const endY = targetHandle.y + targetHandle.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    const steps = 15;
    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(
        startX + (endX - startX) * (i / steps),
        startY + (endY - startY) * (i / steps),
      );
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await page.waitForTimeout(200);

    const updatedInputs = await page.locator("table td input").all();
    await expect(updatedInputs[0]).toHaveValue("BBB");
    await expect(updatedInputs[1]).toHaveValue("AAA");
  });

  test("セルの端にポインタがあってもドロップ判定がセル全体に一致する", async ({
    page,
  }) => {
    const inputs = await page.locator("table td input").all();
    await inputs[0].fill("AAA");
    await inputs[1].fill("BBB");

    const handles = await page.locator('span:has-text("☰")').all();
    const handleBox = await handles[0].boundingBox();
    const cells = await page.locator("table td").all();
    const firstCellBox = await cells[0].boundingBox();

    if (!handleBox || !firstCellBox) throw new Error("Missing elements");

    const startX = handleBox.x + handleBox.width / 2;
    const startY = handleBox.y + handleBox.height / 2;
    // Move to right edge of first cell
    const endX = firstCellBox.x + firstCellBox.width - 3;
    const endY = firstCellBox.y + firstCellBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    const steps = 15;
    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(
        startX + (endX - startX) * (i / steps),
        startY + (endY - startY) * (i / steps),
      );
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await page.waitForTimeout(200);

    // Should not have swapped (dropped on same cell)
    const updatedInputs = await page.locator("table td input").all();
    await expect(updatedInputs[0]).toHaveValue("AAA");
    await expect(updatedInputs[1]).toHaveValue("BBB");
  });
});
