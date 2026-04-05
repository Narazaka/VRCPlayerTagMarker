import type { CellProps } from "./CellProps";
import type { PartialVisualProps } from "./VisualProps";

export function swapCells(
  cells: (CellProps | undefined)[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): (CellProps | undefined)[][] {
  const newCells = cells.map((row) => (row ? [...row] : []));
  if (!newCells[fromRow]) newCells[fromRow] = [];
  if (!newCells[toRow]) newCells[toRow] = [];
  const temp = newCells[fromRow][fromCol];
  newCells[fromRow][fromCol] = newCells[toRow][toCol];
  newCells[toRow][toCol] = temp;
  return newCells;
}

export function insertRowCells(
  cells: (CellProps | undefined)[][],
  afterRowIndex: number,
  col: number,
): (CellProps | undefined)[][] {
  const newCells = [...cells];
  newCells.splice(afterRowIndex + 1, 0, Array.from({ length: col }));
  return newCells;
}

export function insertRowVisuals(
  rowVisuals: (PartialVisualProps | undefined)[],
  afterRowIndex: number,
): (PartialVisualProps | undefined)[] {
  const newVisuals = [...rowVisuals];
  newVisuals.splice(afterRowIndex + 1, 0, undefined);
  return newVisuals;
}

export function deleteRowCells(
  cells: (CellProps | undefined)[][],
  rowIndex: number,
): (CellProps | undefined)[][] {
  const newCells = [...cells];
  newCells.splice(rowIndex, 1);
  return newCells;
}

export function deleteRowVisuals(
  rowVisuals: (PartialVisualProps | undefined)[],
  rowIndex: number,
): (PartialVisualProps | undefined)[] {
  const newVisuals = [...rowVisuals];
  newVisuals.splice(rowIndex, 1);
  return newVisuals;
}
