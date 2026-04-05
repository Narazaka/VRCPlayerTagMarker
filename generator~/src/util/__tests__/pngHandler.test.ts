import { describe, expect, it } from "vitest";
import { addDataJson, loadPngDataFromBlob } from "../pngHandler";
import { defaultVisualProps } from "../VisualProps";

const MINIMAL_PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00,
  0x0c, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x60, 0x60, 0x60, 0x00,
  0x00, 0x00, 0x04, 0x00, 0x01, 0xf6, 0x17, 0x38, 0x55, 0x00, 0x00, 0x00,
  0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

function createPngBlob(data: unknown): Blob {
  const png = addDataJson(MINIMAL_PNG, { vrcTagMarkerData: data });
  return new Blob([png], { type: "image/png" });
}

describe("loadPngDataFromBlob", () => {
  it("version 1 データのテキスト非空セルにcellIdが付与される", async () => {
    const v1Data = {
      version: 1,
      col: 2,
      row: 1,
      cellWidth: 256,
      cellHeight: 64,
      spacing: 6,
      baseVisual: defaultVisualProps,
      colVisuals: [],
      rowVisuals: [],
      cells: [[{ text: "hello" }, { text: "" }]],
    };
    const blob = createPngBlob(v1Data);
    const result = await loadPngDataFromBlob(blob);
    expect(result).toBeDefined();
    expect(result!.version).toBe(2);
    expect(result!.cells[0][0]?.cellId).toBe(1);
    expect(result!.cells[0][0]?.text).toBe("hello");
  });

  it("version 1 の空テキストセルにはcellIdが付与されない", async () => {
    const v1Data = {
      version: 1,
      col: 1,
      row: 1,
      cellWidth: 256,
      cellHeight: 64,
      spacing: 6,
      baseVisual: defaultVisualProps,
      colVisuals: [],
      rowVisuals: [],
      cells: [[{ text: "" }]],
    };
    const blob = createPngBlob(v1Data);
    const result = await loadPngDataFromBlob(blob);
    expect(result!.cells[0][0]?.cellId).toBeUndefined();
  });

  it("maxCellIdが全セルの最大値として計算される", async () => {
    const v1Data = {
      version: 1,
      col: 2,
      row: 2,
      cellWidth: 256,
      cellHeight: 64,
      spacing: 6,
      baseVisual: defaultVisualProps,
      colVisuals: [],
      rowVisuals: [],
      cells: [
        [{ text: "a" }, { text: "b" }],
        [{ text: "c" }, null],
      ],
    };
    const blob = createPngBlob(v1Data);
    const result = await loadPngDataFromBlob(blob);
    // Sequential: a=1, b=2, c=3
    expect(result!.maxCellId).toBe(3);
  });

  it("version 2 データはcellIdがそのまま維持される", async () => {
    const v2Data = {
      version: 2,
      col: 1,
      row: 1,
      cellWidth: 256,
      cellHeight: 64,
      spacing: 6,
      baseVisual: defaultVisualProps,
      colVisuals: [],
      rowVisuals: [],
      cells: [[{ text: "hello", cellId: 42 }]],
      maxCellId: 42,
    };
    const blob = createPngBlob(v2Data);
    const result = await loadPngDataFromBlob(blob);
    expect(result!.cells[0][0]?.cellId).toBe(42);
    expect(result!.maxCellId).toBe(42);
  });

  it("出力のversionが常に2になる", async () => {
    const v1Data = {
      version: 1,
      col: 1,
      row: 1,
      cellWidth: 256,
      cellHeight: 64,
      spacing: 6,
      baseVisual: defaultVisualProps,
      colVisuals: [],
      rowVisuals: [],
      cells: [[null]],
    };
    const blob = createPngBlob(v1Data);
    const result = await loadPngDataFromBlob(blob);
    expect(result!.version).toBe(2);
  });
});
