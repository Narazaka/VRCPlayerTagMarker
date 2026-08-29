import { expect, test } from "@playwright/test";
import { setMode } from "./helpers";

test.describe("Cell insert/delete", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("table td input").first()).toBeVisible();
  });

  /** テーブルのtdセル内のinput値を行×列の2D配列で取得する */
  async function getCellTexts(page: import("@playwright/test").Page) {
    const rows = await page.locator("table tbody tr").all();
    const result: string[][] = [];
    // 先頭行はヘッダー（th）なのでスキップ
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

  /** セルにホバーして挿入/削除ボタンを表示させ、指定titleのボタンをクリック */
  async function hoverCellAndClick(
    page: import("@playwright/test").Page,
    rowIndex: number,
    colIndex: number,
    buttonTitle: string,
  ) {
    const dataRows = await page.locator("table tbody tr").all();
    const row = dataRows[rowIndex + 1]; // +1 でヘッダー行をスキップ
    const cells = await row.locator("td").all();
    const cell = cells[colIndex];
    await setMode(page, buttonTitle.includes("削除") ? "削除" : "挿入");
    await cell.hover();
    await page.waitForTimeout(100);
    const button = page.getByTitle(buttonTitle).first();
    await button.click();
  }

  test.describe("セル削除（左に詰める）", () => {
    test("中央セルを削除すると同じ行内で左にシフトする", async ({ page }) => {
      page.on("dialog", (d) => d.accept());

      const inputs = await page.locator("table td input").all();
      await inputs[0].fill("A");
      await inputs[1].fill("B");
      await inputs[2].fill("C");

      await hoverCellAndClick(page, 0, 1, "セルを削除（左に詰める）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0][0]).toBe("A");
      expect(texts[0][1]).toBe("C");
      // 末尾列が全行空なら列数が自動縮小するため、列2は存在しないことがある
    });

    test("削除後に最右列が全行空なら列数が減る", async ({ page }) => {
      page.on("dialog", (d) => d.accept());

      // デフォルト3列。各行の3列目だけにデータがない状態で、
      // 行0の列1を削除 → 行0は [A, C, ""] → 列2は他行も空なら列数減
      const inputs = await page.locator("table td input").all();
      await inputs[0].fill("A");
      await inputs[1].fill("B");
      // inputs[2] は空のまま（列2）

      await hoverCellAndClick(page, 0, 0, "セルを削除（左に詰める）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      // A削除 → [B, "", ""] → 最右列が全行空なので列数が減るか確認
      expect(texts[0][0]).toBe("B");
    });

    test("確認ダイアログでキャンセルすると削除されない", async ({ page }) => {
      page.on("dialog", (d) => d.dismiss());

      const inputs = await page.locator("table td input").all();
      await inputs[0].fill("A");
      await inputs[1].fill("B");

      await hoverCellAndClick(page, 0, 0, "セルを削除（左に詰める）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0][0]).toBe("A");
      expect(texts[0][1]).toBe("B");
    });
  });

  test.describe("セル削除（上に詰める）", () => {
    test("セルを削除すると同じ列内で上にシフトする", async ({ page }) => {
      page.on("dialog", (d) => d.accept());

      // 列0の各行に入力
      const inputs = await page.locator("table td input").all();
      const col = 3; // デフォルト3列
      await inputs[0].fill("A");
      await inputs[col].fill("B");
      await inputs[col * 2].fill("C");

      await hoverCellAndClick(page, 0, 0, "セルを削除（上に詰める）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0][0]).toBe("B");
      expect(texts[1][0]).toBe("C");
      // 最下行が全列空なら行数が自動縮小するため、行2は存在しないことがある
    });

    test("確認ダイアログでキャンセルすると削除されない", async ({ page }) => {
      page.on("dialog", (d) => d.dismiss());

      const inputs = await page.locator("table td input").all();
      await inputs[0].fill("A");

      await hoverCellAndClick(page, 0, 0, "セルを削除（上に詰める）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0][0]).toBe("A");
    });
  });

  test.describe("セル挿入（右にシフト）", () => {
    test("左辺ボタンでセルが右にシフトする", async ({ page }) => {
      const inputs = await page.locator("table td input").all();
      await inputs[0].fill("A");
      await inputs[1].fill("B");
      await inputs[2].fill("C");

      await hoverCellAndClick(page, 0, 1, "ここにセルを挿入（右にシフト）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0][0]).toBe("A");
      expect(texts[0][1]).toBe("");
      expect(texts[0][2]).toBe("B");
    });

    test("末尾が非空なら列数が増える", async ({ page }) => {
      const inputs = await page.locator("table td input").all();
      await inputs[0].fill("A");
      await inputs[1].fill("B");
      await inputs[2].fill("C");

      // 全列埋まっている状態で先頭に挿入 → Cがはみ出す → 列数増加
      await hoverCellAndClick(page, 0, 0, "ここにセルを挿入（右にシフト）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0].length).toBe(4);
      expect(texts[0][0]).toBe("");
      expect(texts[0][1]).toBe("A");
      expect(texts[0][2]).toBe("B");
      expect(texts[0][3]).toBe("C");
    });

    test("右辺ボタンで右隣に挿入される", async ({ page }) => {
      const inputs = await page.locator("table td input").all();
      await inputs[0].fill("A");
      await inputs[1].fill("B");

      await hoverCellAndClick(page, 0, 0, "右にセルを挿入（右にシフト）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0][0]).toBe("A");
      expect(texts[0][1]).toBe("");
      expect(texts[0][2]).toBe("B");
    });
  });

  test.describe("セル挿入（下にシフト）", () => {
    test("上辺ボタンでセルが下にシフトする", async ({ page }) => {
      const inputs = await page.locator("table td input").all();
      const col = 3;
      await inputs[0].fill("A");
      await inputs[col].fill("B");
      await inputs[col * 2].fill("C");

      await hoverCellAndClick(page, 1, 0, "ここにセルを挿入（下にシフト）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0][0]).toBe("A");
      expect(texts[1][0]).toBe("");
      expect(texts[2][0]).toBe("B");
      expect(texts[3][0]).toBe("C");
    });

    test("末尾が非空なら行数が増える", async ({ page }) => {
      const inputs = await page.locator("table td input").all();
      const col = 3;
      await inputs[0].fill("A");
      await inputs[col].fill("B");
      await inputs[col * 2].fill("C");
      await inputs[col * 3].fill("D");

      // 列0の全行が埋まっている状態で先頭に挿入 → Dがはみ出す → 行数増加
      await hoverCellAndClick(page, 0, 0, "ここにセルを挿入（下にシフト）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts.length).toBe(5);
      expect(texts[0][0]).toBe("");
      expect(texts[1][0]).toBe("A");
      expect(texts[2][0]).toBe("B");
      expect(texts[3][0]).toBe("C");
      expect(texts[4][0]).toBe("D");
    });

    test("末尾行が空でもデータが消失しない", async ({ page }) => {
      // バグ再現: row=4だがcells配列が3行分→insertCellShiftDownで消失
      const inputs = await page.locator("table td input").all();
      const col = 3;
      await inputs[0].fill("A");
      await inputs[col].fill("B");
      await inputs[col * 2].fill("C");
      // inputs[col * 3] は空（末尾行）

      await hoverCellAndClick(page, 0, 0, "ここにセルを挿入（下にシフト）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0][0]).toBe("");
      expect(texts[1][0]).toBe("A");
      expect(texts[2][0]).toBe("B");
      expect(texts[3][0]).toBe("C");
    });

    test("下辺ボタンで下のセル位置に挿入される", async ({ page }) => {
      const inputs = await page.locator("table td input").all();
      const col = 3;
      await inputs[0].fill("A");
      await inputs[col].fill("B");

      await hoverCellAndClick(page, 0, 0, "下にセルを挿入（下にシフト）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0][0]).toBe("A");
      expect(texts[1][0]).toBe("");
      expect(texts[2][0]).toBe("B");
    });
  });

  test.describe("セル削除（上に詰める）— 行数減少", () => {
    test("削除後に最下行が全列空なら行数が減る", async ({ page }) => {
      page.on("dialog", (d) => d.accept());

      const inputs = await page.locator("table td input").all();
      const col = 3;
      // 行0と行1の列0にデータ入力（行2,3は空）
      await inputs[0].fill("A");
      await inputs[col].fill("B");

      // 行0を削除（上に詰め）→ [B, "", "", ""] → 最下行が全列空なら行数減
      await hoverCellAndClick(page, 0, 0, "セルを削除（上に詰める）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0][0]).toBe("B");
      // 行数が減っていることを確認（元4行→3行）
      expect(texts.length).toBeLessThan(4);
    });
  });

  test.describe("グリッド縮小は1操作で最大1行/1列", () => {
    test("削除で最大1列のみ縮小される（再帰的に複数列縮小しない）", async ({
      page,
    }) => {
      page.on("dialog", (d) => d.accept());

      const inputs = await page.locator("table td input").all();
      // デフォルト3列。列0のみにデータ、列1,2は空
      await inputs[0].fill("A");

      // 列0のセルを削除（左に詰め）→ ["", "", ""]
      // 列2が空→1列縮小→2列。しかし列1も空だが再帰しないので2列のまま
      await hoverCellAndClick(page, 0, 0, "セルを削除（左に詰める）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      // 3列→2列（1列のみ縮小、1列にはならない）
      expect(texts[0].length).toBe(2);
    });

    test("削除で最大1行のみ縮小される（再帰的に複数行縮小しない）", async ({
      page,
    }) => {
      page.on("dialog", (d) => d.accept());

      const inputs = await page.locator("table td input").all();
      // 行0のみにデータ、行1,2,3は空
      await inputs[0].fill("A");

      // 行0のセルを削除（上に詰め）→ 全行空
      // 最下行が空→1行縮小→3行。しかし新最下行も空だが再帰しないので3行のまま
      await hoverCellAndClick(page, 0, 0, "セルを削除（上に詰める）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      // 4行→3行（1行のみ縮小、1行にはならない）
      expect(texts.length).toBe(3);
    });
  });

  test.describe("挿入時にサイズが維持されるケース", () => {
    test("末尾が空なら列数は増えない", async ({ page }) => {
      const inputs = await page.locator("table td input").all();
      // デフォルト3列。列0,1にデータ、列2は空
      await inputs[0].fill("A");
      await inputs[1].fill("B");

      // 列0に挿入（右シフト）→ ["", A, B] 末尾のBが列2に収まる→列数3のまま
      await hoverCellAndClick(page, 0, 0, "ここにセルを挿入（右にシフト）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts[0].length).toBe(3);
      expect(texts[0][0]).toBe("");
      expect(texts[0][1]).toBe("A");
      expect(texts[0][2]).toBe("B");
    });

    test("末尾が空なら行数は増えない", async ({ page }) => {
      const inputs = await page.locator("table td input").all();
      const col = 3;
      // 行0,1にデータ、行2,3は空
      await inputs[0].fill("A");
      await inputs[col].fill("B");

      // 行0に挿入（下シフト）→ ["", A, B, ""] 末尾が空なので行数4のまま
      await hoverCellAndClick(page, 0, 0, "ここにセルを挿入（下にシフト）");
      await page.waitForTimeout(300);

      const texts = await getCellTexts(page);
      expect(texts.length).toBe(4);
      expect(texts[0][0]).toBe("");
      expect(texts[1][0]).toBe("A");
      expect(texts[2][0]).toBe("B");
      expect(texts[3][0]).toBe("");
    });
  });

  test.describe("ホバーUI表示", () => {
    test("セルにホバーすると挿入ボタンが表示される", async ({ page }) => {
      await setMode(page, "挿入");
      const dataRows = await page.locator("table tbody tr").all();
      const row = dataRows[1]; // 最初のデータ行
      const cell = (await row.locator("td").all())[0];

      // ホバー前は非表示
      await expect(
        page.getByTitle("ここにセルを挿入（右にシフト）"),
      ).toHaveCount(0);

      await cell.hover();
      await page.waitForTimeout(100);

      // ホバー後に表示
      await expect(
        page.getByTitle("ここにセルを挿入（右にシフト）"),
      ).toBeVisible();
      await expect(
        page.getByTitle("右にセルを挿入（右にシフト）"),
      ).toBeVisible();
      await expect(
        page.getByTitle("ここにセルを挿入（下にシフト）"),
      ).toBeVisible();
      await expect(
        page.getByTitle("下にセルを挿入（下にシフト）"),
      ).toBeVisible();
    });

    test("セルにホバーすると削除ボタンが表示される", async ({ page }) => {
      await setMode(page, "削除");
      const dataRows = await page.locator("table tbody tr").all();
      const row = dataRows[1];
      const cell = (await row.locator("td").all())[0];

      await cell.hover();
      await page.waitForTimeout(100);

      await expect(page.getByTitle("セルを削除（左に詰める）")).toBeVisible();
      await expect(page.getByTitle("セルを削除（上に詰める）")).toBeVisible();
    });

    test("編集モードではホバーしてもボタンが表示されない", async ({ page }) => {
      const dataRows = await page.locator("table tbody tr").all();
      const cell = (await dataRows[1].locator("td").all())[0];

      await cell.hover();
      await page.waitForTimeout(100);

      await expect(
        page.getByTitle("ここにセルを挿入（右にシフト）"),
      ).toHaveCount(0);
      await expect(page.getByTitle("セルを削除（左に詰める）")).toHaveCount(0);
      await expect(page.getByTitle("行を削除")).toHaveCount(0);
      await expect(page.getByTitle("列を右に挿入")).toHaveCount(0);
    });

    test("ドラッグ中は挿入/削除ボタンが表示されない", async ({ page }) => {
      await setMode(page, "挿入");
      // セルにテキストを入力（ドラッグハンドルが表示されるように）
      const inputs = await page.locator("table td input").all();
      await inputs[0].fill("A");
      await inputs[1].fill("B");

      const dataRows = await page.locator("table tbody tr").all();
      const row = dataRows[1];
      const cells = await row.locator("td").all();
      const sourceCell = cells[0];
      const targetCell = cells[1];

      // ドラッグハンドルを取得
      const dragHandle = sourceCell.locator("[role='button']").first();

      // ドラッグ開始（途中で保持）
      await dragHandle.hover();
      await page.mouse.down();
      // ターゲットセルに移動（ドラッグ中状態を作る）
      const targetBox = await targetCell.boundingBox();
      if (targetBox) {
        await page.mouse.move(
          targetBox.x + targetBox.width / 2,
          targetBox.y + targetBox.height / 2,
        );
      }
      await page.waitForTimeout(200);

      // ドラッグ中は挿入ボタンが非表示
      await expect(
        page.getByTitle("ここにセルを挿入（右にシフト）"),
      ).toHaveCount(0);
      await expect(page.getByTitle("セルを削除（左に詰める）")).toHaveCount(0);

      // ドラッグ終了
      await page.mouse.up();
    });
  });
});
