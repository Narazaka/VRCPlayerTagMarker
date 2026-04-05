import { describe, expect, it } from "vitest";
import {
  deleteRowCells,
  deleteRowVisuals,
  insertRowCells,
  insertRowVisuals,
  swapCells,
} from "../cellOperations";

describe("swapCells", () => {
  it("2つのセルの内容が入れ替わる", () => {
    const cells = [
      [
        { text: "A", cellId: 1 },
        { text: "B", cellId: 2 },
      ],
    ];
    const result = swapCells(cells, 0, 0, 0, 1);
    expect(result[0][0]?.text).toBe("B");
    expect(result[0][0]?.cellId).toBe(2);
    expect(result[0][1]?.text).toBe("A");
    expect(result[0][1]?.cellId).toBe(1);
  });

  it("空セルと非空セルのスワップ", () => {
    const cells = [[{ text: "A", cellId: 1 }, undefined]];
    const result = swapCells(cells, 0, 0, 0, 1);
    expect(result[0][0]).toBeUndefined();
    expect(result[0][1]?.text).toBe("A");
    expect(result[0][1]?.cellId).toBe(1);
  });

  it("異なる行間のスワップ", () => {
    const cells = [[{ text: "A", cellId: 1 }], [{ text: "B", cellId: 2 }]];
    const result = swapCells(cells, 0, 0, 1, 0);
    expect(result[0][0]?.text).toBe("B");
    expect(result[1][0]?.text).toBe("A");
  });

  it("元の配列が変更されない（イミュータブル）", () => {
    const cells = [
      [
        { text: "A", cellId: 1 },
        { text: "B", cellId: 2 },
      ],
    ];
    const result = swapCells(cells, 0, 0, 0, 1);
    expect(cells[0][0]?.text).toBe("A");
    expect(result[0][0]?.text).toBe("B");
  });
});

describe("insertRowCells / insertRowVisuals", () => {
  it("指定行の後に空行が追加される", () => {
    const cells = [[{ text: "A", cellId: 1 }], [{ text: "B", cellId: 2 }]];
    const result = insertRowCells(cells, 0, 1);
    expect(result).toHaveLength(3);
    expect(result[0][0]?.text).toBe("A");
    expect(result[1][0]).toBeUndefined();
    expect(result[2][0]?.text).toBe("B");
  });

  it("既存セルのcellIdが維持される", () => {
    const cells = [[{ text: "A", cellId: 5 }], [{ text: "B", cellId: 10 }]];
    const result = insertRowCells(cells, 0, 1);
    expect(result[0][0]?.cellId).toBe(5);
    expect(result[2][0]?.cellId).toBe(10);
  });

  it("rowVisualsが正しくシフトする", () => {
    const visuals = [{ fontSize: 12 }, { fontSize: 14 }];
    const result = insertRowVisuals(visuals, 0);
    expect(result).toHaveLength(3);
    expect(result[0]?.fontSize).toBe(12);
    expect(result[1]).toBeUndefined();
    expect(result[2]?.fontSize).toBe(14);
  });
});

describe("deleteRowCells / deleteRowVisuals", () => {
  it("指定行が削除される", () => {
    const cells = [
      [{ text: "A", cellId: 1 }],
      [{ text: "B", cellId: 2 }],
      [{ text: "C", cellId: 3 }],
    ];
    const result = deleteRowCells(cells, 1);
    expect(result).toHaveLength(2);
    expect(result[0][0]?.text).toBe("A");
    expect(result[1][0]?.text).toBe("C");
  });

  it("rowVisualsが正しく詰まる", () => {
    const visuals = [{ fontSize: 12 }, { fontSize: 14 }, { fontSize: 16 }];
    const result = deleteRowVisuals(visuals, 1);
    expect(result).toHaveLength(2);
    expect(result[0]?.fontSize).toBe(12);
    expect(result[1]?.fontSize).toBe(16);
  });
});
