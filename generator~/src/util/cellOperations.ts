import type { CellProps } from "./CellProps";
import type { PartialVisualProps } from "./VisualProps";

export function isCellEmpty(cell: CellProps | undefined): boolean {
  return cell == null || !cell.text;
}

export function isColumnEmpty(
  cells: (CellProps | undefined)[][],
  colIndex: number,
): boolean {
  return cells.every((row) => isCellEmpty(row?.[colIndex]));
}

export function isRowEmpty(
  cells: (CellProps | undefined)[][],
  rowIndex: number,
): boolean {
  const row = cells[rowIndex];
  if (!row) return true;
  return row.every((cell) => isCellEmpty(cell));
}

export function deleteCellShiftLeft(
  cells: (CellProps | undefined)[][],
  row: number,
  col: number,
  colCount: number,
): (CellProps | undefined)[][] {
  const newCells = cells.map((r, i) => {
    if (i !== row) return r ? [...r] : [];
    const newRow = r ? [...r] : [];
    newRow.splice(col, 1);
    while (newRow.length < colCount) {
      newRow.push(undefined);
    }
    return newRow;
  });
  return newCells;
}

export function deleteCellShiftUp(
  cells: (CellProps | undefined)[][],
  row: number,
  col: number,
): (CellProps | undefined)[][] {
  const newCells = cells.map((r) => (r ? [...r] : []));
  for (let i = row; i < newCells.length - 1; i++) {
    newCells[i][col] = newCells[i + 1]?.[col];
  }
  if (newCells.length > 0) {
    newCells[newCells.length - 1][col] = undefined;
  }
  return newCells;
}

export function insertCellShiftRight(
  cells: (CellProps | undefined)[][],
  row: number,
  col: number,
  colCount: number,
): (CellProps | undefined)[][] {
  const newCells = cells.map((r, i) => {
    if (i !== row) return r ? [...r] : [];
    const newRow = r ? [...r] : [];
    newRow.splice(col, 0, undefined);
    return newRow.slice(0, colCount);
  });
  return newCells;
}

export function insertCellShiftDown(
  cells: (CellProps | undefined)[][],
  row: number,
  col: number,
  rowCount: number,
): (CellProps | undefined)[][] {
  const newCells = cells.map((r) => (r ? [...r] : []));
  while (newCells.length < rowCount) {
    newCells.push([]);
  }
  for (let i = rowCount - 1; i > row; i--) {
    newCells[i][col] = newCells[i - 1]?.[col];
  }
  if (newCells[row]) {
    newCells[row][col] = undefined;
  }
  return newCells;
}

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
