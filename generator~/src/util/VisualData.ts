import type { CellProps } from "./CellProps";
import type { PartialVisualProps, VisualProps } from "./VisualProps";

export interface VisualData {
  version: 1;
  mainTex?: {
    fileID: number;
    guid: string;
    type: number;
  };
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

type NullableKeys<T> = {
  [K in keyof T]: T[K] extends NonNullable<T[K]> ? never : K;
}[keyof T];

type OnlyString<T> = T extends string ? T : never;

type NullableFields<K extends string> = {
  [KK in `use${Capitalize<K>}`]: boolean;
};

type UnityNullableData<T> = NullableFields<
  NonNullable<OnlyString<NullableKeys<T>>>
> &
  Required<T>;

export interface UnityCellProps extends UnityNullableData<CellProps> {
  col: number;
  row: number;
}
export type UnityPartialVisualProps = UnityNullableData<PartialVisualProps>;

export interface UnityVisualData {
  version: 1;
  mainTex:
    | {
        fileID: number;
        guid: string;
        type: number;
      }
    | { instanceID: 0 };
  col: number;
  row: number;
  cellWidth: number;
  cellHeight: number;
  spacing: number;
  baseVisual: VisualProps;
  colVisuals: UnityPartialVisualProps[];
  rowVisuals: UnityPartialVisualProps[];
  cells: UnityCellProps[];
}

export function toUnityPartialVisualProps(
  props: PartialVisualProps,
): UnityPartialVisualProps {
  return {
    textColor: props.textColor ?? "",
    useTextColor: props.textColor == null,
    backgroundColor: props.backgroundColor ?? "",
    useBackgroundColor: props.backgroundColor == null,
    outlineColor: props.outlineColor ?? "",
    useOutlineColor: props.outlineColor == null,
    outlineWidth: props.outlineWidth ?? 0,
    useOutlineWidth: props.outlineWidth == null,
    outlineType: props.outlineType ?? "thick",
    useOutlineType: props.outlineType == null,
    fontSize: props.fontSize ?? 0,
    useFontSize: props.fontSize == null,
    fontFamily: props.fontFamily ?? "",
    useFontFamily: props.fontFamily == null,
    fontWeight: props.fontWeight ?? "normal",
    useFontWeight: props.fontWeight == null,
    textAlign: props.textAlign ?? "center",
    useTextAlign: props.textAlign == null,
    textBaseline: props.textBaseline ?? "middle",
    useTextBaseline: props.textBaseline == null,
    lineHeight: props.lineHeight ?? 1,
    useLineHeight: props.lineHeight == null,
    scaleX: props.scaleX ?? 1,
    useScaleX: props.scaleX == null,
    charWrap: props.charWrap ?? true,
    useCharWrap: props.charWrap == null,
  };
}

export function toUnityCellProps(
  col: number,
  row: number,
  props: CellProps,
): UnityCellProps {
  return {
    text: props.text,
    col,
    row,
    ...toUnityPartialVisualProps(props),
  };
}

export function toUnityVisualData(data: VisualData): UnityVisualData {
  return {
    version: 1,
    mainTex: {
      instanceID: 0,
    },
    col: data.col,
    row: data.row,
    cellWidth: data.cellWidth,
    cellHeight: data.cellHeight,
    spacing: data.spacing,
    baseVisual: data.baseVisual,
    colVisuals: data.colVisuals.map(toUnityPartialVisualProps),
    rowVisuals: data.rowVisuals.map(toUnityPartialVisualProps),
    cells: data.cells.flatMap((col, rowIndex) =>
      col.map((cell, colIndex) => toUnityCellProps(colIndex, rowIndex, cell)),
    ),
  };
}
export function fromUnityPartialVisualProps(
  props: UnityPartialVisualProps,
): PartialVisualProps {
  return {
    textColor: props.useTextColor ? undefined : props.textColor,
    backgroundColor: props.useBackgroundColor
      ? undefined
      : props.backgroundColor,
    outlineColor: props.useOutlineColor ? undefined : props.outlineColor,
    outlineWidth: props.useOutlineWidth ? undefined : props.outlineWidth,
    outlineType: props.useOutlineType ? undefined : props.outlineType,
    fontSize: props.useFontSize ? undefined : props.fontSize,
    fontFamily: props.useFontFamily ? undefined : props.fontFamily,
    fontWeight: props.useFontWeight ? undefined : props.fontWeight,
    textAlign: props.useTextAlign ? undefined : props.textAlign,
    textBaseline: props.useTextBaseline ? undefined : props.textBaseline,
    lineHeight: props.useLineHeight ? undefined : props.lineHeight,
    scaleX: props.useScaleX ? undefined : props.scaleX,
    charWrap: props.useCharWrap ? undefined : props.charWrap,
  };
}

export function fromUnityCellProps(props: UnityCellProps): CellProps {
  return {
    text: props.text,
    ...fromUnityPartialVisualProps(props),
  };
}

export function fromUnityCellPropsArray(data: UnityCellProps[]): CellProps[][] {
  const cells: CellProps[][] = [];
  for (const cell of data) {
    if (!cells[cell.row]) {
      cells[cell.row] = [];
    }
    cells[cell.row][cell.col] = fromUnityCellProps(cell);
  }
  return cells;
}

export function fromUnityVisualData(data: UnityVisualData): VisualData {
  return {
    version: data.version,
    col: data.col,
    row: data.row,
    cellWidth: data.cellWidth,
    cellHeight: data.cellHeight,
    spacing: data.spacing,
    baseVisual: data.baseVisual,
    colVisuals: data.colVisuals.map(fromUnityPartialVisualProps),
    rowVisuals: data.rowVisuals.map(fromUnityPartialVisualProps),
    cells: fromUnityCellPropsArray(data.cells),
  };
}
