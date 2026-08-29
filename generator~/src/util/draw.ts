import type { CellProps } from "./CellProps";
import { parseRichText, type TextRun } from "./richText";
import type { VisualProps } from "./VisualProps";

type CellPropsWithVisual = CellProps & VisualProps;

/** 幅を測り終えた1文字。props はタグで分岐した断片ごとに同一オブジェクト */
interface MeasuredChar {
  ch: string;
  props: VisualProps;
  width: number;
}

interface MeasuredLine {
  chars: MeasuredChar[];
  height: number;
}

interface LineRun {
  text: string;
  props: VisualProps;
  width: number;
}

function fontOf(props: VisualProps) {
  return `${props.fontWeight} ${props.fontSize}px "${props.fontFamily}"`;
}

function measureChars(
  ctx: CanvasRenderingContext2D,
  runs: TextRun[],
): MeasuredChar[] {
  const chars: MeasuredChar[] = [];
  for (const run of runs) {
    ctx.font = fontOf(run.props);
    // カーニングを保つため、断片先頭からの累積幅の差分を1文字の幅とする
    let start = 0;
    let prevWidth = 0;
    for (let i = 0; i < run.text.length; i++) {
      const ch = run.text[i];
      if (ch === "\n") {
        chars.push({ ch, props: run.props, width: 0 });
        start = i + 1;
        prevWidth = 0;
        continue;
      }
      const width =
        ctx.measureText(run.text.slice(start, i + 1)).width * run.props.scaleX;
      chars.push({ ch, props: run.props, width: width - prevWidth });
      prevWidth = width;
    }
  }
  return chars;
}

function wrapLines({
  chars,
  maxWidth,
  charWrap,
  base,
}: {
  chars: MeasuredChar[];
  maxWidth: number;
  charWrap: boolean;
  base: VisualProps;
}): MeasuredLine[] {
  const lines: MeasuredLine[] = [];
  let line: MeasuredChar[] = [];
  let width = 0;
  let lastSpace = -1;
  const flush = (chunk: MeasuredChar[]) => {
    lines.push({
      chars: chunk,
      height: chunk.reduce(
        (max, c) => Math.max(max, c.props.lineHeight * c.props.fontSize),
        0,
      ),
    });
  };
  for (const char of chars) {
    if (char.ch === "\n") {
      flush(line);
      line = [];
      width = 0;
      lastSpace = -1;
      continue;
    }
    if (width + char.width > maxWidth && line.length > 0) {
      let carry: MeasuredChar[] = [];
      if (!charWrap) {
        if (lastSpace < 0) {
          // 単語途中では折り返さず、はみ出させる
          line.push(char);
          width += char.width;
          continue;
        }
        carry = line.slice(lastSpace + 1);
      }
      flush(line.slice(0, line.length - carry.length));
      line = carry;
      width = carry.reduce((sum, c) => sum + c.width, 0);
      lastSpace = -1;
    }
    line.push(char);
    width += char.width;
    if (char.ch === " ") lastSpace = line.length - 1;
  }
  if (line.length > 0) flush(line);
  const emptyHeight = base.lineHeight * base.fontSize;
  return lines.map((line) =>
    line.height === 0 ? { ...line, height: emptyHeight } : line,
  );
}

function toLineRuns(
  ctx: CanvasRenderingContext2D,
  line: MeasuredLine,
): LineRun[] {
  const runs: LineRun[] = [];
  for (const char of line.chars) {
    const last = runs[runs.length - 1];
    if (last && last.props === char.props) {
      last.text += char.ch;
    } else {
      runs.push({ text: char.ch, props: char.props, width: 0 });
    }
  }
  // 描画位置は行内の実測幅で決める（1文字ずつの積算では字詰めの分ずれる）
  for (const run of runs) {
    ctx.font = fontOf(run.props);
    run.width = ctx.measureText(run.text).width * run.props.scaleX;
  }
  return runs;
}

function setRunContext(
  ctx: CanvasRenderingContext2D,
  props: VisualProps,
  textBaseline: CanvasTextBaseline,
) {
  ctx.scale(props.scaleX, 1);
  ctx.font = fontOf(props);
  ctx.textAlign = "left";
  ctx.textBaseline = textBaseline;
}

function drawRunOutline(
  ctx: CanvasRenderingContext2D,
  run: LineRun,
  x: number,
  y: number,
  textBaseline: CanvasTextBaseline,
) {
  const props = run.props;
  if (props.outlineWidth === 0) return;
  ctx.save();
  setRunContext(ctx, props, textBaseline);
  const runX = x / props.scaleX;
  if (props.outlineType === "thick") {
    ctx.fillStyle = props.outlineColor;
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 360; i++) {
      ctx.fillText(
        run.text,
        runX + (Math.sin(i) * props.outlineWidth) / 2,
        y + (Math.cos(i) * props.outlineWidth) / 2,
      );
    }
  } else {
    ctx.shadowColor = props.outlineColor;
    ctx.shadowBlur = props.outlineWidth;
    ctx.fillStyle = props.textColor;
    ctx.fillText(run.text, runX, y);
  }
  ctx.restore();
}

function drawRunText(
  ctx: CanvasRenderingContext2D,
  run: LineRun,
  x: number,
  y: number,
  textBaseline: CanvasTextBaseline,
) {
  // blur のふちは本文も一緒に描いているので、二度塗りしてふちを濃くしない
  if (run.props.outlineWidth !== 0 && run.props.outlineType === "blur") return;
  ctx.save();
  setRunContext(ctx, run.props, textBaseline);
  ctx.fillStyle = run.props.textColor;
  ctx.fillText(run.text, x / run.props.scaleX, y);
  ctx.restore();
}

function drawBorderedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  borderWidth: number,
  fillColor: string,
  borderColor: string,
) {
  ctx.fillStyle = fillColor;
  ctx.fillRect(
    x + borderWidth,
    y + borderWidth,
    width - borderWidth * 2,
    height - borderWidth * 2,
  );
  if (borderWidth === 0) return;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(
    x + borderWidth / 2,
    y + borderWidth / 2,
    width - borderWidth,
    height - borderWidth,
  );
}

function drawText({
  ctx,
  x,
  y,
  widthWithPadding,
  height,
  paddingX,
  paddingY,
  props,
  scale,
}: {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  widthWithPadding: number;
  height: number;
  paddingX: number;
  paddingY: number;
  props: CellPropsWithVisual;
  scale: number;
}) {
  const contentWidth = widthWithPadding - paddingX * 2;
  const contentHeight = height - paddingY * 2;
  const lines = wrapLines({
    chars: measureChars(ctx, parseRichText(props.text, props, scale)),
    maxWidth: contentWidth,
    charWrap: props.charWrap,
    base: props,
  });
  const totalHeight = lines.reduce((sum, line) => sum + line.height, 0);
  let offsetY = 0;
  for (const line of lines) {
    const runs = toLineRuns(ctx, line);
    const lineWidth = runs.reduce((sum, run) => sum + run.width, 0);
    const lineX =
      props.textAlign === "left"
        ? x + paddingX
        : props.textAlign === "right"
          ? x + widthWithPadding - paddingX - lineWidth
          : x + widthWithPadding / 2 - lineWidth / 2;
    const lineY =
      props.textBaseline === "top"
        ? y + paddingY + offsetY
        : props.textBaseline === "middle"
          ? y + height / 2 + offsetY - (totalHeight - line.height) / 2
          : y + paddingY + contentHeight - totalHeight + line.height + offsetY;
    // 隣の断片のふちが本文に被らないよう、行内は「全ふち→全本文」の順に描く
    let runX = lineX;
    for (const run of runs) {
      drawRunOutline(ctx, run, runX, lineY, props.textBaseline);
      runX += run.width;
    }
    runX = lineX;
    for (const run of runs) {
      drawRunText(ctx, run, runX, lineY, props.textBaseline);
      runX += run.width;
    }
    offsetY += line.height;
  }
  return totalHeight;
}

export function draw({
  ctx,
  col,
  row,
  cellWidth,
  cellHeight,
  spacing,
  cells,
  scale = 1,
}: {
  ctx: CanvasRenderingContext2D;
  col: number;
  row: number;
  cellWidth: number;
  cellHeight: number;
  spacing: number;
  cells: CellPropsWithVisual[][];
  scale?: number;
}) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.clearRect(0, 0, width, height);

  for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {
      const cell = cells[r][c];
      if (cell.text === "") continue;
      const x = c * cellWidth + spacing;
      const y = r * cellHeight + spacing;
      const width = cellWidth - spacing * 2;
      const height = cellHeight - spacing * 2;
      const bgColor = cell.backgroundColor;
      drawBorderedRect(
        ctx,
        x,
        y,
        width,
        height,
        0,
        bgColor,
        "rgba(0, 0, 0, 0)",
      );
      drawText({
        ctx,
        x,
        y,
        widthWithPadding: width,
        height,
        paddingX: 3,
        paddingY: 3,
        props: cell,
        scale,
      });
    }
  }
}
