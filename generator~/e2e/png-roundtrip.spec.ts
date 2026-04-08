import * as fs from "node:fs";
import { expect, test } from "@playwright/test";

test.describe("PNG roundtrip", () => {
  test("テキスト入力→ダウンロード→再読み込みでデータが維持される", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForTimeout(500);

    // テキストを入力
    const inputs = await page.locator("table td input").all();
    await inputs[0].fill("AAA");
    await inputs[1].fill("BBB");

    // ダウンロード
    const downloadPromise = page.waitForEvent("download");
    await page.getByText("画像をダウンロード").click();
    const download = await downloadPromise;
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();

    // ダウンロードしたファイルを読み取り
    const fileBuffer = fs.readFileSync(downloadPath!);

    // Dropzone にファイルをドロップ (via input[type=file])
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test.vrc-tag-marker.png",
      mimeType: "image/png",
      buffer: fileBuffer,
    });
    await page.waitForTimeout(1000);

    // テキストが復元されていること
    const updatedInputs = await page.locator("table td input").all();
    await expect(updatedInputs[0]).toHaveValue("AAA");
    await expect(updatedInputs[1]).toHaveValue("BBB");
  });

  test("2文字以上の入力後にダウンロードが成功する（sparse配列バグ回帰テスト）", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForTimeout(500);

    // デフォルト3列×4行の最終セル(row=3, col=2)に1文字ずつ入力
    // 1文字目: cells配列にempty slots（sparse array）が作られる
    // 2文字目: [...prev]でempty slotsがundefinedに変換される
    const inputs = await page.locator("table td input").all();
    const lastInput = inputs[inputs.length - 1];
    await lastInput.pressSequentially("ab");

    // ダウンロードがエラーなく成功すること
    const downloadPromise = page.waitForEvent("download");
    await page.getByText("画像をダウンロード").click();
    const download = await downloadPromise;
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();
  });
});
