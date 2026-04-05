import type { CellProps } from "./CellProps";

export function assignCellIds(
  cells: (CellProps | undefined)[][],
  maxCellId: number,
): { cells: (CellProps | undefined)[][]; maxCellId: number } {
  let nextId = maxCellId;
  const newCells = cells.map((row) =>
    row.map((cell) => {
      if (!cell?.text) {
        if (cell?.cellId != null) {
          const { cellId: _, ...rest } = cell;
          return rest as CellProps;
        }
        return cell;
      }
      if (cell.cellId != null) return cell;
      nextId++;
      return { ...cell, cellId: nextId };
    }),
  );
  return { cells: newCells, maxCellId: nextId };
}
