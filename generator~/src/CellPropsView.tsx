import { useDndContext, useDraggable } from "@dnd-kit/core";
import { ActionIcon, Group, TextInput } from "@mantine/core";
import chroma from "chroma-js";
import { memo, useCallback, useState } from "react";
import { IoArrowBack, IoArrowUp } from "react-icons/io5";
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
  onDeleteLeft,
  onDeleteUp,
}: {
  props: CellProps | undefined;
  setProps: (newTitle: Partial<CellProps>) => void;
  withParentVisualProps: WithParentVisualProps;
  fonts: string[];
  row: number;
  col: number;
  onDeleteLeft?: () => void;
  onDeleteUp?: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `cell-${row}-${col}`,
    data: { row, col },
  });

  const { active } = useDndContext();
  const isAnyDragging = active != null;

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const showButtons = isHovered && !isAnyDragging;

  const propsWithParent = withParentVisualProps(props);
  return (
    // biome-ignore lint/a11y/useSemanticElements: hover detection for showing action buttons
    <div
      ref={setNodeRef}
      role="group"
      style={{
        opacity: isDragging ? 0.4 : 1,
        position: "relative",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showButtons && (
        <Group
          gap={2}
          style={{
            position: "absolute",
            top: -2,
            right: 0,
            zIndex: 10,
          }}
        >
          <ActionIcon
            size={16}
            variant="subtle"
            color="red"
            onClick={onDeleteLeft}
            title="セルを削除（左に詰める）"
          >
            <IoArrowBack size={11} />
          </ActionIcon>
          <ActionIcon
            size={16}
            variant="subtle"
            color="red"
            onClick={onDeleteUp}
            title="セルを削除（上に詰める）"
          >
            <IoArrowUp size={11} />
          </ActionIcon>
        </Group>
      )}
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
