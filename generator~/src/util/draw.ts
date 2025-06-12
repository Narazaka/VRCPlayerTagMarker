import type { CellProps } from "./CellProps";
import type { VisualProps } from "./VisualProps";

type CellPropsWithVisual = CellProps & VisualProps;

function drawOutline(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  thickness: number,
  draw: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
  ) => void,
) {
  const step = 1;
  const count = 360 / step;
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < count; i += step) {
    draw(
      ctx,
      x + (Math.sin(i) * thickness) / 2,
      y + (Math.cos(i) * thickness) / 2,
      color,
    );
  }
  ctx.globalAlpha = 1;
}

function setTextPropContexts(
  ctx: CanvasRenderingContext2D,
  textProps: VisualProps,
) {
  ctx.font = `${textProps.fontWeight} ${textProps.fontSize}px "${textProps.fontFamily}"`;
  ctx.fillStyle = textProps.textColor;
  ctx.textAlign = textProps.textAlign;
  ctx.textBaseline = textProps.textBaseline;
}

function genDrawText(textProps: CellPropsWithVisual) {
  const font = `${textProps.fontWeight} ${textProps.fontSize}px "${textProps.fontFamily}"`;
  return (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
  ) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = textProps.textAlign;
    ctx.textBaseline = textProps.textBaseline;
    ctx.fillText(textProps.text, x, y);
  };
}

function drawTextOutlined(
  ctx: CanvasRenderingContext2D,
  textProps: CellPropsWithVisual,
  x: number,
  y: number,
) {
  if (textProps.outlineWidth === 0) {
    const draw = genDrawText(textProps);
    draw(ctx, x, y, textProps.textColor);
  } else if (textProps.outlineType === "thick") {
    drawTextThickOutlined(ctx, textProps, x, y);
  } else {
    drawTextBlurOutlined(ctx, textProps, x, y);
  }
}

function drawTextThickOutlined(
  ctx: CanvasRenderingContext2D,
  textProps: CellPropsWithVisual,
  x: number,
  y: number,
) {
  const draw = genDrawText(textProps);
  drawOutline(ctx, x, y, textProps.outlineColor, textProps.outlineWidth, draw);
  draw(ctx, x, y, textProps.textColor);
}

function drawTextBlurOutlined(
  ctx: CanvasRenderingContext2D,
  textProps: CellPropsWithVisual,
  x: number,
  y: number,
) {
  const draw = genDrawText(textProps);
  ctx.shadowColor = textProps.outlineColor;
  ctx.shadowBlur = textProps.outlineWidth;
  draw(ctx, x, y, textProps.textColor);
  ctx.shadowBlur = 0;
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
}: {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  widthWithPadding: number;
  height: number;
  paddingX: number;
  paddingY: number;
  props: CellPropsWithVisual;
}) {
  const contentWidth = widthWithPadding - paddingX * 2;
  const contentHeight = height - paddingY * 2;
  let xOffset = 0;
  switch (props.textAlign) {
    case "left":
      xOffset = paddingX;
      break;
    case "right":
      xOffset = widthWithPadding - paddingX;
      break;
    case "center":
      xOffset = widthWithPadding / 2;
      break;
  }
  ctx.scale(props.scaleX, 1);
  setTextPropContexts(ctx, props);
  const { fillCommands, height: resultHeight } = wrapText({
    ctx,
    text: props.text,
    maxWidth: contentWidth / props.scaleX,
    lineHeight: props.lineHeight * props.fontSize,
    charWrap: props.charWrap,
  });
  for (const { text, offsetY } of fillCommands) {
    const yPos =
      props.textBaseline === "top"
        ? y + paddingY + offsetY
        : props.textBaseline === "middle"
          ? y +
            height / 2 +
            offsetY -
            (resultHeight - props.lineHeight * props.fontSize) / 2
          : y +
            paddingY +
            contentHeight -
            resultHeight +
            props.lineHeight * props.fontSize +
            offsetY;
    drawTextOutlined(
      ctx,
      { ...props, text },
      (x + xOffset) / props.scaleX,
      yPos,
    );
  }
  ctx.scale(1 / props.scaleX, 1);
  return resultHeight;
}

function wrapText({
  ctx,
  text,
  maxWidth,
  lineHeight,
  charWrap,
}: {
  ctx: CanvasRenderingContext2D;
  text: string;
  maxWidth: number;
  lineHeight: number;
  charWrap: boolean;
}) {
  let height = 0;
  const fillCommands: { text: string; offsetY: number }[] = [];
  if (charWrap) {
    let line = "";
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "\n") {
        fillCommands.push({ text: line, offsetY: height });
        console.log("line", line, "LF");
        line = "";
        height += lineHeight;
        continue;
      }
      const testLine = line + text[i];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && line.length > 0) {
        fillCommands.push({ text: line, offsetY: height });
        console.log("line", line, testWidth);
        line = text[i];
        height += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      fillCommands.push({ text: line, offsetY: height });
      console.log("line", line, "END");
      height += lineHeight;
    }
  } else {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      if (words[n] === "\n") {
        fillCommands.push({ text: line, offsetY: height });
        line = "";
        height += lineHeight;
        continue;
      }
      const testLine = `${line + words[n]} `;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        fillCommands.push({ text: line, offsetY: height });
        line = `${words[n]} `;
        height += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      fillCommands.push({ text: line, offsetY: height });
      height += lineHeight;
    }
  }
  return { fillCommands, height };
}

export function draw({
  ctx,
  col,
  row,
  cellWidth,
  cellHeight,
  spacing,
  cells,
}: {
  ctx: CanvasRenderingContext2D;
  col: number;
  row: number;
  cellWidth: number;
  cellHeight: number;
  spacing: number;
  cells: CellPropsWithVisual[][];
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
      });
    }
  }
}
