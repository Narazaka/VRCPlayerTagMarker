export interface VisualProps {
  textColor: string;
  backgroundColor: string;
  outlineColor: string;
  outlineWidth: number;
  outlineType: "thick" | "blur";
  fontSize: number;
  fontFamily: string;
  fontWeight: "bold" | "normal";
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  lineHeight: number;
  scaleX: number;
  charWrap: boolean;
}

export const defaultVisualProps: VisualProps = {
  textColor: "#fff",
  backgroundColor: "#666",
  outlineColor: "#000",
  outlineWidth: 7,
  outlineType: "blur",
  fontSize: 24,
  fontFamily: "Rounded Mgen+ 1p heavy",
  fontWeight: "normal",
  textAlign: "center",
  textBaseline: "middle",
  lineHeight: 1.3,
  scaleX: 1,
  charWrap: true,
};

export type PartialVisualProps = Partial<VisualProps>;

export type WithParentVisualProps<T = PartialVisualProps> = (
  props: T | undefined,
) => VisualProps;

export const genWithParentVisualProps =
  (parent: VisualProps) =>
  <T extends PartialVisualProps | undefined>(props: T) => {
    return {
      ...parent,
      ...props,
    };
  };

export const stripVisualProps = <T extends PartialVisualProps>(props: T): T => {
  const stripped: T = { ...props };
  for (const key of Object.keys(defaultVisualProps) as (keyof T)[]) {
    if (stripped[key] == null) {
      delete stripped[key];
    }
  }
  return stripped;
};
