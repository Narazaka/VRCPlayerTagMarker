import { describe, expect, it } from "vitest";
import { assignCellIds } from "../cellIdAssigner";

describe("assignCellIds", () => {
  it("空セル(undefined)にはIDが振られない", () => {
    const cells = [[undefined, undefined]];
    const result = assignCellIds(cells, 0);
    expect(result.cells).toEqual([[undefined, undefined]]);
    expect(result.maxCellId).toBe(0);
  });

  it("テキストが空文字のセルにはIDが振られない", () => {
    const cells = [[{ text: "" }]];
    const result = assignCellIds(cells, 0);
    expect(result.cells[0][0]?.cellId).toBeUndefined();
    expect(result.maxCellId).toBe(0);
  });

  it("テキストありでcellId未設定のセルにIDが振られる", () => {
    const cells = [[{ text: "hello" }]];
    const result = assignCellIds(cells, 0);
    expect(result.cells[0][0]?.cellId).toBe(1);
    expect(result.maxCellId).toBe(1);
  });

  it("既にcellIdを持つセルはIDが維持される", () => {
    const cells = [[{ text: "hello", cellId: 42 }]];
    const result = assignCellIds(cells, 50);
    expect(result.cells[0][0]?.cellId).toBe(42);
    expect(result.maxCellId).toBe(50);
  });

  it("複数セルへの連番採番が重複しない", () => {
    const cells = [
      [{ text: "a" }, { text: "b" }],
      [{ text: "c" }, undefined],
    ];
    const result = assignCellIds(cells, 10);
    expect(result.cells[0][0]?.cellId).toBe(11);
    expect(result.cells[0][1]?.cellId).toBe(12);
    expect(result.cells[1][0]?.cellId).toBe(13);
    expect(result.cells[1][1]).toBeUndefined();
    expect(result.maxCellId).toBe(13);
  });

  it("既存IDと新規IDが混在する場合", () => {
    const cells = [[{ text: "existing", cellId: 5 }, { text: "new" }]];
    const result = assignCellIds(cells, 5);
    expect(result.cells[0][0]?.cellId).toBe(5);
    expect(result.cells[0][1]?.cellId).toBe(6);
    expect(result.maxCellId).toBe(6);
  });
});
