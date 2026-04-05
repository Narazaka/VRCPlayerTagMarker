import { useDraggable } from "@dnd-kit/core";
import { Group, TextInput } from "@mantine/core";
import chroma from "chroma-js";
import { memo } from "react";
import type { CellProps } from "./util/CellProps";
import type { WithParentVisualProps } from "./util/VisualProps";
import VisualPropsView from "./VisualPropsView";

function CellPropsView({
  props,
  setProps,
  withParentVisualProps,
  fonts,
  row,
  col,
}: {
  props: CellProps | undefined;
  setProps: (newTitle: Partial<CellProps>) => void;
  withParentVisualProps: WithParentVisualProps;
  fonts: string[];
  row: number;
  col: number;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `cell-${row}-${col}`,
    data: { row, col },
  });

  const propsWithParent = withParentVisualProps(props);
  return (
    <div
      ref={setNodeRef}
      style={{
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <Group>
        <span
          {...attributes}
          {...listeners}
          style={{ cursor: "grab", userSelect: "none" }}
        >
          &#x2630;
        </span>
        <TextInput
          size="xs"
          variant="unstyled"
          styles={{
            input: {
              color:
                chroma.contrastAPCA(propsWithParent.backgroundColor, "#fff") >
                60
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
    </div>
  );
}

export default memo(CellPropsView);
