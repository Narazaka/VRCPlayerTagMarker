import { describe, expect, it } from "vitest";
import {
  deleteCellShiftLeft,
  deleteCellShiftUp,
  deleteColumnCells,
  deleteColumnVisuals,
  deleteRowCells,
  deleteRowVisuals,
  insertCellShiftDown,
  insertCellShiftRight,
  insertColumnCells,
  insertColumnVisuals,
  insertRowCells,
  insertRowVisuals,
  isCellEmpty,
  isColumnEmpty,
  isRowEmpty,
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

describe("isCellEmpty", () => {
  it("undefinedは空", () => {
    expect(isCellEmpty(undefined)).toBe(true);
  });

  it("空文字列テキストは空", () => {
    expect(isCellEmpty({ text: "" })).toBe(true);
  });

  it("テキストありは空でない", () => {
    expect(isCellEmpty({ text: "A" })).toBe(false);
  });

  it("スタイルのみでテキストなしは空", () => {
    expect(isCellEmpty({ text: "", fontSize: 12 })).toBe(true);
  });
});

describe("isColumnEmpty", () => {
  it("全行で指定列が空なら true", () => {
    const cells = [
      [{ text: "A" }, undefined],
      [{ text: "B" }, undefined],
    ];
    expect(isColumnEmpty(cells, 1)).toBe(true);
  });

  it("一部非空なら false", () => {
    const cells = [
      [{ text: "A" }, { text: "B" }],
      [{ text: "C" }, undefined],
    ];
    expect(isColumnEmpty(cells, 1)).toBe(false);
  });

  it("空配列なら true", () => {
    expect(isColumnEmpty([], 0)).toBe(true);
  });
});

describe("isRowEmpty", () => {
  it("全列が空なら true", () => {
    const cells = [
      [undefined, undefined],
      [{ text: "A" }, { text: "B" }],
    ];
    expect(isRowEmpty(cells, 0)).toBe(true);
  });

  it("一部非空なら false", () => {
    const cells = [[{ text: "A" }, undefined]];
    expect(isRowEmpty(cells, 0)).toBe(false);
  });

  it("存在しない行は true", () => {
    expect(isRowEmpty([], 5)).toBe(true);
  });
});

describe("deleteCellShiftLeft", () => {
  it("中央セルを削除し左に詰める", () => {
    const cells = [
      [
        { text: "A", cellId: 1 },
        { text: "B", cellId: 2 },
        { text: "C", cellId: 3 },
        { text: "D", cellId: 4 },
      ],
    ];
    const result = deleteCellShiftLeft(cells, 0, 1, 4);
    expect(result[0][0]?.text).toBe("A");
    expect(result[0][1]?.text).toBe("C");
    expect(result[0][2]?.text).toBe("D");
    expect(result[0][3]).toBeUndefined();
  });

  it("先頭セルを削除", () => {
    const cells = [[{ text: "A" }, { text: "B" }, { text: "C" }]];
    const result = deleteCellShiftLeft(cells, 0, 0, 3);
    expect(result[0][0]?.text).toBe("B");
    expect(result[0][1]?.text).toBe("C");
    expect(result[0][2]).toBeUndefined();
  });

  it("末尾セルを削除", () => {
    const cells = [[{ text: "A" }, { text: "B" }, { text: "C" }]];
    const result = deleteCellShiftLeft(cells, 0, 2, 3);
    expect(result[0][0]?.text).toBe("A");
    expect(result[0][1]?.text).toBe("B");
    expect(result[0][2]).toBeUndefined();
  });

  it("他の行は変更されない", () => {
    const cells = [
      [{ text: "A" }, { text: "B" }],
      [{ text: "C" }, { text: "D" }],
    ];
    const result = deleteCellShiftLeft(cells, 0, 0, 2);
    expect(result[1][0]?.text).toBe("C");
    expect(result[1][1]?.text).toBe("D");
  });

  it("元の配列が変更されない（イミュータブル）", () => {
    const cells = [[{ text: "A" }, { text: "B" }]];
    const result = deleteCellShiftLeft(cells, 0, 0, 2);
    expect(cells[0][0]?.text).toBe("A");
    expect(result[0][0]?.text).toBe("B");
  });
});

describe("deleteCellShiftUp", () => {
  it("中央セルを削除し上に詰める", () => {
    const cells = [
      [{ text: "A" }, { text: "B" }],
      [{ text: "C" }, { text: "D" }],
      [{ text: "E" }, { text: "F" }],
    ];
    const result = deleteCellShiftUp(cells, 1, 0);
    expect(result[0][0]?.text).toBe("A");
    expect(result[1][0]?.text).toBe("E");
    expect(result[2][0]).toBeUndefined();
    // 他の列は変更されない
    expect(result[0][1]?.text).toBe("B");
    expect(result[1][1]?.text).toBe("D");
    expect(result[2][1]?.text).toBe("F");
  });

  it("先頭行セルを削除", () => {
    const cells = [[{ text: "A" }], [{ text: "B" }], [{ text: "C" }]];
    const result = deleteCellShiftUp(cells, 0, 0);
    expect(result[0][0]?.text).toBe("B");
    expect(result[1][0]?.text).toBe("C");
    expect(result[2][0]).toBeUndefined();
  });

  it("末尾行セルを削除", () => {
    const cells = [[{ text: "A" }], [{ text: "B" }]];
    const result = deleteCellShiftUp(cells, 1, 0);
    expect(result[0][0]?.text).toBe("A");
    expect(result[1][0]).toBeUndefined();
  });

  it("元の配列が変更されない（イミュータブル）", () => {
    const cells = [[{ text: "A" }], [{ text: "B" }]];
    const result = deleteCellShiftUp(cells, 0, 0);
    expect(cells[0][0]?.text).toBe("A");
    expect(result[0][0]?.text).toBe("B");
  });
});

describe("insertCellShiftRight", () => {
  it("中央に挿入し右にシフト", () => {
    const cells = [[{ text: "A" }, { text: "B" }, { text: "C" }]];
    const result = insertCellShiftRight(cells, 0, 1, 4);
    expect(result[0][0]?.text).toBe("A");
    expect(result[0][1]).toBeUndefined();
    expect(result[0][2]?.text).toBe("B");
    expect(result[0][3]?.text).toBe("C");
  });

  it("先頭に挿入", () => {
    const cells = [[{ text: "A" }, { text: "B" }]];
    const result = insertCellShiftRight(cells, 0, 0, 3);
    expect(result[0][0]).toBeUndefined();
    expect(result[0][1]?.text).toBe("A");
    expect(result[0][2]?.text).toBe("B");
  });

  it("末尾に挿入（拡張なしで切り詰め）", () => {
    const cells = [[{ text: "A" }, { text: "B" }, { text: "C" }]];
    const result = insertCellShiftRight(cells, 0, 2, 3);
    expect(result[0][0]?.text).toBe("A");
    expect(result[0][1]?.text).toBe("B");
    expect(result[0][2]).toBeUndefined();
    expect(result[0]).toHaveLength(3);
  });

  it("他の行は変更されない", () => {
    const cells = [
      [{ text: "A" }, { text: "B" }],
      [{ text: "C" }, { text: "D" }],
    ];
    const result = insertCellShiftRight(cells, 0, 0, 3);
    expect(result[1][0]?.text).toBe("C");
    expect(result[1][1]?.text).toBe("D");
  });

  it("元の配列が変更されない（イミュータブル）", () => {
    const cells = [[{ text: "A" }, { text: "B" }]];
    const result = insertCellShiftRight(cells, 0, 0, 3);
    expect(cells[0][0]?.text).toBe("A");
    expect(result[0][0]).toBeUndefined();
  });

  it("cells配列に対象行が存在しない場合", () => {
    // row state=3 だが cells配列は1行分しかないケース、row=2に挿入
    const cells = [[{ text: "A" }]];
    const result = insertCellShiftRight(cells, 2, 0, 3);
    expect(result[0][0]?.text).toBe("A");
    // 対象行が存在しなくてもエラーにならない
    expect(result).toHaveLength(1);
  });
});

describe("insertCellShiftDown", () => {
  it("中央に挿入し下にシフト", () => {
    const cells = [
      [{ text: "A" }, { text: "B" }],
      [{ text: "C" }, { text: "D" }],
      [{ text: "E" }, { text: "F" }],
    ];
    const result = insertCellShiftDown(cells, 1, 0, 4);
    expect(result[0][0]?.text).toBe("A");
    expect(result[1][0]).toBeUndefined();
    expect(result[2][0]?.text).toBe("C");
    // 他の列は変更されない
    expect(result[0][1]?.text).toBe("B");
    expect(result[1][1]?.text).toBe("D");
    expect(result[2][1]?.text).toBe("F");
  });

  it("先頭行に挿入", () => {
    const cells = [[{ text: "A" }], [{ text: "B" }]];
    const result = insertCellShiftDown(cells, 0, 0, 3);
    expect(result[0][0]).toBeUndefined();
    expect(result[1][0]?.text).toBe("A");
  });

  it("末尾行に挿入（切り詰め）", () => {
    const cells = [[{ text: "A" }], [{ text: "B" }], [{ text: "C" }]];
    const result = insertCellShiftDown(cells, 2, 0, 3);
    expect(result[0][0]?.text).toBe("A");
    expect(result[1][0]?.text).toBe("B");
    expect(result[2][0]).toBeUndefined();
  });

  it("元の配列が変更されない（イミュータブル）", () => {
    const cells = [[{ text: "A" }], [{ text: "B" }]];
    const result = insertCellShiftDown(cells, 0, 0, 3);
    expect(cells[0][0]?.text).toBe("A");
    expect(result[0][0]).toBeUndefined();
  });

  it("cells配列がrowCountより短い場合にセルが消失しない", () => {
    // row state=3 だが cells配列は2行分しかないケース
    const cells = [[{ text: "A" }], [{ text: "B" }]];
    const result = insertCellShiftDown(cells, 0, 0, 3);
    expect(result[0][0]).toBeUndefined();
    expect(result[1][0]?.text).toBe("A");
    expect(result[2][0]?.text).toBe("B");
  });

  it("cells配列がrowCountより大幅に短い場合", () => {
    const cells = [[{ text: "A" }]];
    const result = insertCellShiftDown(cells, 0, 0, 4);
    expect(result[0][0]).toBeUndefined();
    expect(result[1][0]?.text).toBe("A");
  });
});

describe("insertColumnCells", () => {
  it("中央に列を挿入", () => {
    const cells = [
      [{ text: "A" }, { text: "B" }, { text: "C" }],
      [{ text: "D" }, { text: "E" }, { text: "F" }],
    ];
    const result = insertColumnCells(cells, 1);
    expect(result[0].map((c) => c?.text)).toEqual(["A", "B", undefined, "C"]);
    expect(result[1].map((c) => c?.text)).toEqual(["D", "E", undefined, "F"]);
  });

  it("先頭列の右に挿入", () => {
    const cells = [[{ text: "A" }, { text: "B" }]];
    const result = insertColumnCells(cells, 0);
    expect(result[0].map((c) => c?.text)).toEqual(["A", undefined, "B"]);
  });

  it("末尾列の右に挿入", () => {
    const cells = [[{ text: "A" }, { text: "B" }]];
    const result = insertColumnCells(cells, 1);
    expect(result[0].map((c) => c?.text)).toEqual(["A", "B", undefined]);
  });

  it("元の配列が変更されない（イミュータブル）", () => {
    const cells = [[{ text: "A" }, { text: "B" }]];
    const result = insertColumnCells(cells, 0);
    expect(cells[0]).toHaveLength(2);
    expect(result[0]).toHaveLength(3);
  });
});

describe("deleteColumnCells", () => {
  it("中央列を削除", () => {
    const cells = [
      [{ text: "A" }, { text: "B" }, { text: "C" }],
      [{ text: "D" }, { text: "E" }, { text: "F" }],
    ];
    const result = deleteColumnCells(cells, 1);
    expect(result[0].map((c) => c?.text)).toEqual(["A", "C"]);
    expect(result[1].map((c) => c?.text)).toEqual(["D", "F"]);
  });

  it("先頭列を削除", () => {
    const cells = [[{ text: "A" }, { text: "B" }]];
    const result = deleteColumnCells(cells, 0);
    expect(result[0].map((c) => c?.text)).toEqual(["B"]);
  });

  it("末尾列を削除", () => {
    const cells = [[{ text: "A" }, { text: "B" }]];
    const result = deleteColumnCells(cells, 1);
    expect(result[0].map((c) => c?.text)).toEqual(["A"]);
  });

  it("元の配列が変更されない（イミュータブル）", () => {
    const cells = [[{ text: "A" }, { text: "B" }]];
    const result = deleteColumnCells(cells, 0);
    expect(cells[0]).toHaveLength(2);
    expect(result[0]).toHaveLength(1);
  });
});

describe("insertColumnVisuals", () => {
  it("中央に挿入", () => {
    const visuals = [{ fontSize: 10 }, { fontSize: 20 }];
    const result = insertColumnVisuals(visuals, 0);
    expect(result).toEqual([{ fontSize: 10 }, undefined, { fontSize: 20 }]);
  });

  it("元の配列が変更されない", () => {
    const visuals = [{ fontSize: 10 }];
    const result = insertColumnVisuals(visuals, 0);
    expect(visuals).toHaveLength(1);
    expect(result).toHaveLength(2);
  });
});

describe("deleteColumnVisuals", () => {
  it("中央を削除", () => {
    const visuals = [{ fontSize: 10 }, { fontSize: 20 }, { fontSize: 30 }];
    const result = deleteColumnVisuals(visuals, 1);
    expect(result).toEqual([{ fontSize: 10 }, { fontSize: 30 }]);
  });

  it("元の配列が変更されない", () => {
    const visuals = [{ fontSize: 10 }, { fontSize: 20 }];
    const result = deleteColumnVisuals(visuals, 0);
    expect(visuals).toHaveLength(2);
    expect(result).toHaveLength(1);
  });
});
