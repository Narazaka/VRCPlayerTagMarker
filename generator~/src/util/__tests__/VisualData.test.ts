import { describe, expect, it } from "vitest";
import type { VisualData } from "../VisualData";
import {
  fromUnityCellProps,
  fromUnityVisualData,
  toUnityCellProps,
  toUnityVisualData,
} from "../VisualData";
import { defaultVisualProps } from "../VisualProps";

describe("toUnityCellProps", () => {
  it("cellIdが props?.cellId ?? 0 で変換される", () => {
    const result = toUnityCellProps(1, 2, { text: "hello", cellId: 42 });
    expect(result.cellId).toBe(42);
    expect(result.col).toBe(1);
    expect(result.row).toBe(2);
    expect(result.text).toBe("hello");
  });

  it("cellId未設定の場合は0になる", () => {
    const result = toUnityCellProps(0, 0, { text: "hello" });
    expect(result.cellId).toBe(0);
  });

  it("undefined props の場合は空テキスト、cellId=0", () => {
    const result = toUnityCellProps(0, 0, undefined);
    expect(result.text).toBe("");
    expect(result.cellId).toBe(0);
  });
});

describe("toUnityVisualData", () => {
  it("version=2, maxCellIdが出力に含まれる", () => {
    const data: VisualData = {
      version: 2,
      col: 2,
      row: 1,
      cellWidth: 256,
      cellHeight: 64,
      spacing: 6,
      baseVisual: defaultVisualProps,
      colVisuals: [],
      rowVisuals: [],
      cells: [
        [
          { text: "a", cellId: 10 },
          { text: "b", cellId: 20 },
        ],
      ],
      maxCellId: 20,
    };
    const result = toUnityVisualData(data);
    expect(result.version).toBe(2);
    expect(result.maxCellId).toBe(20);
    expect(result.cells).toHaveLength(2);
    expect(result.cells[0].cellId).toBe(10);
    expect(result.cells[1].cellId).toBe(20);
  });
});

describe("fromUnityCellProps", () => {
  it("cellIdが復元される", () => {
    const unity = toUnityCellProps(1, 2, { text: "hello", cellId: 42 });
    const result = fromUnityCellProps(unity);
    expect(result.cellId).toBe(42);
    expect(result.text).toBe("hello");
  });
});

describe("fromUnityVisualData", () => {
  it("maxCellIdが復元される", () => {
    const data: VisualData = {
      version: 2,
      col: 1,
      row: 1,
      cellWidth: 256,
      cellHeight: 64,
      spacing: 6,
      baseVisual: defaultVisualProps,
      colVisuals: [],
      rowVisuals: [],
      cells: [[{ text: "a", cellId: 5 }]],
      maxCellId: 5,
    };
    const unity = toUnityVisualData(data);
    const result = fromUnityVisualData(unity);
    expect(result.maxCellId).toBe(5);
  });
});

describe("往復変換", () => {
  it("toUnity → fromUnity でテキストとcellIdが一致する", () => {
    const data: VisualData = {
      version: 2,
      col: 2,
      row: 2,
      cellWidth: 256,
      cellHeight: 64,
      spacing: 6,
      baseVisual: defaultVisualProps,
      colVisuals: [],
      rowVisuals: [],
      cells: [
        [
          { text: "a", cellId: 1 },
          { text: "b", cellId: 2 },
        ],
        [{ text: "c", cellId: 3 }, undefined],
      ],
      maxCellId: 3,
    };
    const unity = toUnityVisualData(data);
    const result = fromUnityVisualData(unity);
    expect(result.cells[0][0]?.text).toBe("a");
    expect(result.cells[0][0]?.cellId).toBe(1);
    expect(result.cells[0][1]?.text).toBe("b");
    expect(result.cells[0][1]?.cellId).toBe(2);
    expect(result.cells[1][0]?.text).toBe("c");
    expect(result.cells[1][0]?.cellId).toBe(3);
    expect(result.maxCellId).toBe(3);
  });
});
