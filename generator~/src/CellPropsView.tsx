import { Group, TextInput } from "@mantine/core";
import { memo } from "react";
import type { CellProps } from "./util/CellProps";
import VisualPropsView from "./VisualPropsView";
import type { WithParentVisualProps } from "./util/VisualProps";
import chroma from "chroma-js";

function CellPropsView({
  props,
  setProps,
  withParentVisualProps,
  fonts,
}: {
  props: CellProps | undefined;
  setProps: (newTitle: Partial<CellProps>) => void;
  withParentVisualProps: WithParentVisualProps;
  fonts: string[];
}) {
  const propsWithParent = withParentVisualProps(props);
  return (
    <Group>
      <TextInput
        size="xs"
        variant="unstyled"
        styles={{
          input: {
            color:
              chroma.contrastAPCA(propsWithParent.backgroundColor, "#fff") > 60
                ? "#fff"
                : "#000",
            backgroundColor: propsWithParent.backgroundColor,
          },
        }}
        value={props ? props.text : ""}
        onChange={(event) => {
          setProps({ text: event.currentTarget.value });
        }}
      />
      <VisualPropsView
        props={props}
        setProps={setProps}
        withParentVisualProps={withParentVisualProps}
        fonts={fonts}
      />
    </Group>
  );
}

export default memo(CellPropsView);
