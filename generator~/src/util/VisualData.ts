import type { CellProps } from "./CellProps";
import type { PartialVisualProps, VisualProps } from "./VisualProps";

export interface VisualData {
  version: 1;
  col: number;
  row: number;
  cellWidth: number;
  cellHeight: number;
  spacing: number;
  baseVisual: VisualProps;
  colVisuals: PartialVisualProps[];
  rowVisuals: PartialVisualProps[];
  cells: CellProps[][];
}
