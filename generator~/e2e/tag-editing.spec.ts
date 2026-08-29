import { expect, test } from "@playwright/test";

test.describe("タグ編集UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("table td textarea").first()).toBeVisible();
  });

  test("タグ一覧が見られる", async ({ page }) => {
    await page.getByRole("button", { name: "タグ一覧" }).click();
    await expect(page.getByText("<color=#f00>")).toBeVisible();
  });

  test("選択範囲にタグを適用できる", async ({ page }) => {
    const textarea = page.locator("table td textarea").first();
    await textarea.fill("あいう");

    // 選択していないうちはボタンが出ない
    await expect(page.getByTitle("選択範囲にタグを付ける")).toHaveCount(0);

    await textarea.click();
    await page.keyboard.press("Control+A");
    const tagButton = page.getByTitle("選択範囲にタグを付ける");
    await expect(tagButton).toBeVisible();
    await tagButton.click();

    // 文字色を有効にして適用
    const dropdown = page.locator(".mantine-Popover-dropdown").last();
    // Switch の input は視覚的に隠れているので force で押す
    await dropdown.getByRole("switch").first().click({ force: true });
    await dropdown.getByRole("button", { name: "適用" }).click();

    await expect(textarea).toHaveValue(/^<color=.+>あいう<\/color>$/);
  });
});
