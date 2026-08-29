import {
  AspectRatio,
  Checkbox,
  ColorPicker,
  Group,
  NumberInput,
  Overlay,
  SegmentedControl,
  Slider,
  Stack,
  TextInput,
} from "@mantine/core";
import FontSelector from "./FontSelector";
import useWithPartial from "./useWithPartial";
import type {
  PartialVisualProps,
  VisualProps,
  WithParentVisualProps,
} from "./util/VisualProps";

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

/**
 * スタイルの各項目。only を渡すとその項目だけを出す
 * （タグ編集はタグにできる項目しか扱えないため）。
 */
function VisualPropsFields({
  required,
  props,
  setProps,
  withParentVisualProps,
  fonts,
  only,
}: {
  required?: boolean;
  props: PartialVisualProps;
  setProps: (newProps: PartialVisualProps) => void;
  withParentVisualProps?: WithParentVisualProps;
  fonts: string[];
  only?: readonly (keyof VisualProps)[];
}) {
  const WithPartial = useWithPartial({
    required,
    setProps,
    withParentVisualProps,
  });
  const propsWithParent = withParentVisualProps
    ? withParentVisualProps(props)
    : (props as VisualProps);
  const show = (prop: keyof VisualProps) => only == null || only.includes(prop);
  return (
    <Stack>
      <Group>
        {show("textColor") && (
          <WithPartial prop="textColor" value={props.textColor} label="文字色">
            <ColorPickerField
              props={props}
              propsWithParent={propsWithParent}
              prop="textColor"
              setProps={setProps}
            />
            <TextInput
              disabled={props.textColor == null}
              size="xs"
              w={w}
              value={propsWithParent.textColor}
              onChange={(e) => setProps({ textColor: e.currentTarget.value })}
            />
          </WithPartial>
        )}
        {show("backgroundColor") && (
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
            <TextInput
              disabled={props.backgroundColor == null}
              size="xs"
              w={w}
              value={propsWithParent.backgroundColor}
              onChange={(e) =>
                setProps({ backgroundColor: e.currentTarget.value })
              }
            />
          </WithPartial>
        )}
      </Group>
      {show("fontFamily") && (
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
      )}
      <Group>
        {show("fontSize") && (
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
            <Slider
              disabled={props.fontSize == null}
              value={propsWithParent.fontSize}
              step={1}
              min={6}
              max={160}
              onChange={(value) => setProps({ fontSize: Number(value) })}
            />
          </WithPartial>
        )}
        {show("lineHeight") && (
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
            <Slider
              disabled={props.lineHeight == null}
              value={propsWithParent.lineHeight}
              step={0.1}
              min={0.5}
              max={2}
              onChange={(value) => setProps({ lineHeight: Number(value) })}
            />
          </WithPartial>
        )}
      </Group>
      <Group>
        {show("outlineWidth") && (
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
            <Slider
              disabled={props.outlineWidth == null}
              value={propsWithParent.outlineWidth}
              step={1}
              min={0}
              max={30}
              onChange={(value) => setProps({ outlineWidth: Number(value) })}
            />
          </WithPartial>
        )}
        {show("scaleX") && (
          <WithPartial prop="scaleX" value={props.scaleX} label="伸縮率">
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
          </WithPartial>
        )}
      </Group>
      <Group>
        {show("outlineColor") && (
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
            <TextInput
              disabled={props.outlineColor == null}
              size="xs"
              w={w}
              value={propsWithParent.outlineColor}
              onChange={(e) =>
                setProps({ outlineColor: e.currentTarget.value })
              }
            />
          </WithPartial>
        )}
        <Stack>
          {show("textAlign") && (
            <WithPartial prop="textAlign" value={props.textAlign} label="揃え">
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
          )}
          {show("fontWeight") && (
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
          )}
          {show("outlineType") && (
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
          )}
        </Stack>
      </Group>
    </Stack>
  );
}

export default VisualPropsFields;
