import { expect, test } from "@playwright/test";

test.describe("Row actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("table td input").first()).toBeVisible();
  });

  test("+ボタンで空行が挿入される", async ({ page }) => {
    const rowsBefore = await page.locator("table tbody tr").count();
    const insertButtons = await page.getByTitle("行を下に挿入").all();
    await insertButtons[0].click();
    const rowsAfter = await page.locator("table tbody tr").count();
    expect(rowsAfter).toBe(rowsBefore + 1);
  });

  test("−ボタンで確認ダイアログが出る", async ({ page }) => {
    let dialogMessage = "";
    page.on("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    const deleteButtons = await page.getByTitle("行を削除").all();
    await deleteButtons[0].click();

    expect(dialogMessage).toContain("削除");
  });

  test("確認後に行が削除される", async ({ page }) => {
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    const rowsBefore = await page.locator("table tbody tr").count();
    const deleteButtons = await page.getByTitle("行を削除").all();
    await deleteButtons[0].click();
    await page.waitForTimeout(200);
    const rowsAfter = await page.locator("table tbody tr").count();
    expect(rowsAfter).toBe(rowsBefore - 1);
  });
});
