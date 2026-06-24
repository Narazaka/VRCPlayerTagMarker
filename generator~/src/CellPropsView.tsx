import { useDndContext, useDraggable } from "@dnd-kit/core";
import { ActionIcon, Button, Group, TextInput, Tooltip } from "@mantine/core";
import chroma from "chroma-js";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  IoArrowBack,
  IoArrowUp,
  IoCheckmark,
  IoCopyOutline,
} from "react-icons/io5";
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

  const cellId = props?.cellId;
  const hasText = !!props?.text;
  const [copied, setCopied] = useState(false);
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
    },
    [],
  );
  const handleCopyId = useCallback(async () => {
    if (cellId == null) return;
    try {
      await navigator.clipboard.writeText(String(cellId));
      setCopied(true);
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
      copyResetTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable; ignore
    }
  }, [cellId]);

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
      {showButtons && hasText && (
        <Group
          gap={2}
          style={{
            position: "absolute",
            bottom: -2,
            right: 0,
            zIndex: 10,
          }}
        >
          {cellId != null ? (
            <Tooltip
              label={copied ? "コピーしました" : `cellId ${cellId} をコピー`}
            >
              <Button
                size="compact-xs"
                variant="subtle"
                onClick={handleCopyId}
                leftSection={
                  copied ? (
                    <IoCheckmark size={11} />
                  ) : (
                    <IoCopyOutline size={11} />
                  )
                }
                styles={{
                  root: { height: 16, paddingLeft: 4, paddingRight: 4 },
                  label: { fontSize: 10 },
                }}
              >
                #{cellId}
              </Button>
            </Tooltip>
          ) : (
            <Tooltip label="ダウンロード時に確定します">
              <Button
                size="compact-xs"
                variant="subtle"
                color="gray"
                data-disabled
                onClick={(e) => e.preventDefault()}
                leftSection={<IoCopyOutline size={11} />}
                styles={{
                  root: { height: 16, paddingLeft: 4, paddingRight: 4 },
                  label: { fontSize: 10 },
                }}
              >
                #?
              </Button>
            </Tooltip>
          )}
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
