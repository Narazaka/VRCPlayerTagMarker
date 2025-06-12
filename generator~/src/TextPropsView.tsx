import {
  Grid,
  NumberInput,
  ColorInput,
  Switch,
  Select,
  Slider,
} from "@mantine/core";
import type { VisualProps } from "./util/VisualProps";
import { memo } from "react";
import FontSelector from "./FontSelector";

function TextPropsView({
  text,
  setText,
  fonts,
}: {
  text: VisualProps;
  setText: (newTitle: Partial<VisualProps>) => void;
  fonts: string[];
}) {
  return (
    <Grid align="center">
      <Grid.Col span={9}>
        <Grid>
          <Grid.Col span={1.5}>
            <NumberInput
              label="大きさ"
              size="xs"
              value={text.fontSize}
              onChange={(value) => setText({ fontSize: Number(value) })}
            />
          </Grid.Col>
          <Grid.Col span={1.5}>
            <NumberInput
              label="行の高さ"
              size="xs"
              value={text.lineHeight}
              onChange={(value) => setText({ lineHeight: Number(value) })}
              step={0.1}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              label="ふち幅"
              size="xs"
              value={text.outlineWidth}
              onChange={(value) => setText({ outlineWidth: Number(value) })}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              label="伸縮率"
              step={0.1}
              size="xs"
              value={text.scaleX}
              onChange={(value) => setText({ scaleX: Number(value) })}
            />
            <Slider
              value={text.scaleX}
              step={0.01}
              min={0.2}
              max={2}
              onChange={(value) => setText({ scaleX: Number(value) })}
            />
          </Grid.Col>
          <Grid.Col span={1.5}>
            <Select
              label="揃え"
              size="xs"
              value={text.textAlign}
              onChange={(value) =>
                setText({ textAlign: value as CanvasTextAlign })
              }
              data={
                [
                  { value: "left", label: "左" },
                  { value: "center", label: "中央" },
                  { value: "right", label: "右" },
                ] satisfies { value: CanvasTextAlign; label: string }[]
              }
            />
          </Grid.Col>

          <Grid.Col span={1.5}>
            <Switch
              label="太字"
              size="xs"
              checked={text.fontWeight === "bold"}
              onChange={(e) =>
                setText({
                  fontWeight: e.currentTarget.checked ? "bold" : "normal",
                })
              }
            />
          </Grid.Col>

          <Grid.Col span={1.5}>
            <Switch
              label="ぼかし"
              size="xs"
              checked={text.outlineType === "blur"}
              onChange={(e) =>
                setText({
                  outlineType: e.currentTarget.checked ? "blur" : "thick",
                })
              }
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <ColorInput
              label="文字色"
              size="xs"
              format="rgba"
              value={text.textColor}
              onChange={(value) => setText({ textColor: value })}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <ColorInput
              label="ふち色"
              size="xs"
              format="rgba"
              value={text.outlineColor}
              onChange={(value) => setText({ outlineColor: value })}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <FontSelector
              fontFamily={text.fontFamily}
              setFontFamily={(value) => setText({ fontFamily: value })}
              fonts={fonts}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
}

export default memo(TextPropsView);
