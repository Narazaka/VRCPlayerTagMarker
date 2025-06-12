import {
  NumberInput,
  Slider,
  Group,
  Popover,
  ActionIcon,
  Stack,
  ColorPicker,
  AspectRatio,
  Overlay,
  SegmentedControl,
  Checkbox,
} from "@mantine/core";
import type {
  VisualProps,
  PartialVisualProps,
  WithParentVisualProps,
} from "./util/VisualProps";
import { memo } from "react";
import FontSelector from "./FontSelector";
import { IoColorPalette } from "react-icons/io5";
import useWithPartial from "./useWithPartial";

const w = 150;

type StringProps = {
  [K in keyof VisualProps]: VisualProps[K] extends string ? K : never;
}[keyof VisualProps];

const ColorPickerField = ({
  props,
  prop,
  propsWithParent,
  setProps,
}: {
  props: PartialVisualProps;
  propsWithParent: VisualProps;
  prop: StringProps;
  setProps: (newProps: PartialVisualProps) => void;
}) => (
  <AspectRatio ratio={6 / 5} pos="relative">
    <ColorPicker
      size="xs"
      format="hex"
      w={w}
      value={propsWithParent[prop]}
      onChange={(value) => setProps({ [prop]: value })}
    />
    {props[prop] == null && <Overlay color="#ccc" />}
  </AspectRatio>
);

function VisualPropsView({
  required,
  props = {},
  setProps,
  withParentVisualProps,
  fonts,
}:
  | {
      required?: false;
      props: PartialVisualProps | undefined;
      setProps: (newTitle: PartialVisualProps) => void;
      withParentVisualProps: WithParentVisualProps;
      fonts: string[];
    }
  | {
      required: true;
      props: VisualProps;
      setProps: (newTitle: PartialVisualProps) => void;
      withParentVisualProps?: never;
      fonts: string[];
    }) {
  const WithPartial = useWithPartial({
    required,
    setProps,
    withParentVisualProps,
  });
  const propsWithParent = withParentVisualProps
    ? withParentVisualProps(props)
    : (props as VisualProps);
  return (
    <Popover
      position="right-start"
      trapFocus
      withArrow
      shadow="md"
      middlewares={{
        flip: { fallbackAxisSideDirection: "end" },
      }}
    >
      <Popover.Target>
        <ActionIcon
          size="xs"
          variant={
            Object.keys(props).filter((p) => p !== "text").length > 0
              ? "filled"
              : "default"
          }
        >
          <IoColorPalette size={16} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Group>
            <WithPartial
              prop="textColor"
              value={props.textColor}
              label="文字色"
            >
              <ColorPickerField
                props={props}
                propsWithParent={propsWithParent}
                prop="textColor"
                setProps={setProps}
              />
            </WithPartial>
            <WithPartial
              prop="backgroundColor"
              value={props.backgroundColor}
              label="背景色"
            >
              <ColorPickerField
                props={props}
                propsWithParent={propsWithParent}
                prop="backgroundColor"
                setProps={setProps}
              />
            </WithPartial>
          </Group>
          <WithPartial
            prop="fontFamily"
            value={props.fontFamily}
            label="フォント"
          >
            <FontSelector
              disabled={props.fontFamily == null}
              fontFamily={propsWithParent.fontFamily}
              setFontFamily={(value) => setProps({ fontFamily: value })}
              fonts={fonts}
            />
          </WithPartial>
          <Group>
            <WithPartial
              prop="fontSize"
              value={props.fontSize}
              label="文字サイズ"
            >
              <NumberInput
                disabled={props.fontSize == null}
                size="xs"
                w={w}
                value={propsWithParent.fontSize}
                onChange={(value) => setProps({ fontSize: Number(value) })}
              />
            </WithPartial>
            <WithPartial
              prop="lineHeight"
              value={props.lineHeight}
              label="行の高さ"
            >
              <NumberInput
                disabled={props.lineHeight == null}
                size="xs"
                w={w}
                value={propsWithParent.lineHeight}
                onChange={(value) => setProps({ lineHeight: Number(value) })}
                step={0.1}
              />
            </WithPartial>
          </Group>
          <Group>
            <WithPartial
              prop="outlineWidth"
              value={props.outlineWidth}
              label="ふち幅"
            >
              <NumberInput
                disabled={props.outlineWidth == null}
                size="xs"
                w={w}
                value={propsWithParent.outlineWidth}
                onChange={(value) => setProps({ outlineWidth: Number(value) })}
              />
            </WithPartial>
            <WithPartial prop="scaleX" value={props.scaleX} label="伸縮率">
              <Stack>
                <NumberInput
                  disabled={props.scaleX == null}
                  step={0.1}
                  size="xs"
                  w={w}
                  value={propsWithParent.scaleX}
                  onChange={(value) => setProps({ scaleX: Number(value) })}
                />
                <Slider
                  disabled={props.scaleX == null}
                  value={propsWithParent.scaleX}
                  step={0.01}
                  min={0.2}
                  max={2}
                  onChange={(value) => setProps({ scaleX: Number(value) })}
                />
              </Stack>
            </WithPartial>
          </Group>
          <Group>
            <WithPartial
              prop="outlineColor"
              value={props.outlineColor}
              label="ふち色"
            >
              <ColorPickerField
                props={props}
                propsWithParent={propsWithParent}
                prop="outlineColor"
                setProps={setProps}
              />
            </WithPartial>
            <Stack>
              <WithPartial
                prop="textAlign"
                value={props.textAlign}
                label="揃え"
              >
                <SegmentedControl
                  disabled={props.textAlign == null}
                  size="xs"
                  value={propsWithParent.textAlign}
                  onChange={(value) =>
                    setProps({ textAlign: value as CanvasTextAlign })
                  }
                  data={
                    [
                      { value: "left", label: "左" },
                      { value: "center", label: "中央" },
                      { value: "right", label: "右" },
                    ] satisfies { value: CanvasTextAlign; label: string }[]
                  }
                />
              </WithPartial>
              <WithPartial
                prop="fontWeight"
                value={props.fontWeight}
                label="太字"
              >
                <Checkbox
                  disabled={props.fontWeight == null}
                  size="xs"
                  checked={propsWithParent.fontWeight === "bold"}
                  onChange={(e) =>
                    setProps({
                      fontWeight: e.currentTarget.checked ? "bold" : "normal",
                    })
                  }
                />
              </WithPartial>
              <WithPartial
                prop="outlineType"
                value={props.outlineType}
                label="ぼかし"
              >
                <Checkbox
                  disabled={props.outlineType == null}
                  size="xs"
                  checked={propsWithParent.outlineType === "blur"}
                  onChange={(e) =>
                    setProps({
                      outlineType: e.currentTarget.checked ? "blur" : "thick",
                    })
                  }
                />
              </WithPartial>
            </Stack>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default memo(VisualPropsView);
