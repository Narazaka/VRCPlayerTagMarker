import { expect, test } from "@playwright/test";
import { setMode } from "./helpers";

test.describe("Column actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("table td input").first()).toBeVisible();
  });

  /** テーブルのtdセル内のinput値を行×列の2D配列で取得する */
  async function getCellTexts(page: import("@playwright/test").Page) {
    const rows = await page.locator("table tbody tr").all();
    const result: string[][] = [];
    for (const row of rows.slice(1)) {
      const inputs = await row.locator("td input").all();
      const texts: string[] = [];
      for (const input of inputs) {
        texts.push(await input.inputValue());
      }
      result.push(texts);
    }
    return result;
  }

  test("+ボタンで空列が挿入される", async ({ page }) => {
    const inputs = await page.locator("table td input").all();
    await inputs[0].fill("A");
    await inputs[1].fill("B");
    await inputs[2].fill("C");

    // 列0の右に挿入
    await setMode(page, "挿入");
    const insertButtons = await page.getByTitle("列を右に挿入").all();
    await insertButtons[0].click();
    await page.waitForTimeout(300);

    const texts = await getCellTexts(page);
    expect(texts[0].length).toBe(4);
    expect(texts[0][0]).toBe("A");
    expect(texts[0][1]).toBe("");
    expect(texts[0][2]).toBe("B");
    expect(texts[0][3]).toBe("C");
  });

  test("−ボタンで確認ダイアログが出る", async ({ page }) => {
    let dialogMessage = "";
    page.on("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    await setMode(page, "削除");
    const deleteButtons = await page.getByTitle("列を削除").all();
    await deleteButtons[0].click();

    expect(dialogMessage).toContain("削除");
  });

  test("確認後に列が削除される", async ({ page }) => {
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    const inputs = await page.locator("table td input").all();
    await inputs[0].fill("A");
    await inputs[1].fill("B");
    await inputs[2].fill("C");

    const textsBefore = await getCellTexts(page);
    const colsBefore = textsBefore[0].length;

    // 列1(B)を削除
    await setMode(page, "削除");
    const deleteButtons = await page.getByTitle("列を削除").all();
    await deleteButtons[1].click();
    await page.waitForTimeout(300);

    const textsAfter = await getCellTexts(page);
    expect(textsAfter[0].length).toBe(colsBefore - 1);
    expect(textsAfter[0][0]).toBe("A");
    expect(textsAfter[0][1]).toBe("C");
  });

  test("削除キャンセルで列が保持される", async ({ page }) => {
    page.on("dialog", async (dialog) => {
      await dialog.dismiss();
    });

    const inputs = await page.locator("table td input").all();
    await inputs[0].fill("A");
    await inputs[1].fill("B");

    await setMode(page, "削除");
    const deleteButtons = await page.getByTitle("列を削除").all();
    await deleteButtons[0].click();
    await page.waitForTimeout(200);

    const texts = await getCellTexts(page);
    expect(texts[0][0]).toBe("A");
    expect(texts[0][1]).toBe("B");
  });

  test("列が1つの場合は削除されない", async ({ page }) => {
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    // 列を1つまで減らす（3列→2→1）
    await setMode(page, "削除");
    const deleteButtons1 = await page.getByTitle("列を削除").all();
    await deleteButtons1[0].click();
    await page.waitForTimeout(200);
    await setMode(page, "削除");
    const deleteButtons2 = await page.getByTitle("列を削除").all();
    await deleteButtons2[0].click();
    await page.waitForTimeout(200);

    // 残り1列、削除ボタンを押してもダイアログが出ない（early return）
    const texts = await getCellTexts(page);
    expect(texts[0].length).toBe(1);

    await setMode(page, "削除");
    const deleteButtons3 = await page.getByTitle("列を削除").all();
    await deleteButtons3[0].click();
    await page.waitForTimeout(200);

    const textsAfter = await getCellTexts(page);
    expect(textsAfter[0].length).toBe(1);
  });
});
