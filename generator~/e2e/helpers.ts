import type { Page } from "@playwright/test";

/** 上部の編集モード切替。各モードのボタンしか表示されないため操作前に必要 */
export async function setMode(
  page: Page,
  label: "編集" | "挿入" | "削除" | "IDコピー",
) {
  await page.getByText(label, { exact: true }).click();
}
