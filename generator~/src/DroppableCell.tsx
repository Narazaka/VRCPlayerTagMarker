import { useDndContext, useDroppable } from "@dnd-kit/core";
import { ActionIcon } from "@mantine/core";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useState,
} from "react";
import { IoAdd } from "react-icons/io5";

const insertButtonBase: CSSProperties = {
  position: "absolute",
  zIndex: 10,
  opacity: 0.7,
  transition: "opacity 0.15s",
};

const insertButtonHover: CSSProperties = {
  opacity: 1,
};

function InsertButton({
  style,
  onClick,
  title,
}: {
  style: CSSProperties;
  onClick: () => void;
  title: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <ActionIcon
      size={16}
      radius="xl"
      variant="filled"
      color="blue"
      style={{
        ...insertButtonBase,
        ...style,
        ...(hovered ? insertButtonHover : undefined),
      }}
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <IoAdd size={12} />
    </ActionIcon>
  );
}

function DroppableCell({
  row,
  col,
  style,
  children,
  onInsertLeft,
  onInsertRight,
  onInsertTop,
  onInsertBottom,
}: {
  row: number;
  col: number;
  style?: CSSProperties;
  children: ReactNode;
  onInsertLeft?: () => void;
  onInsertRight?: () => void;
  onInsertTop?: () => void;
  onInsertBottom?: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${row}-${col}`,
    data: { row, col },
  });

  const { active } = useDndContext();
  const isAnyDragging = active != null;

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const showButtons = isHovered && !isAnyDragging;

  return (
    <td
      ref={setNodeRef}
      style={{
        ...style,
        position: "relative",
        overflow: "visible",
        outline: isOver ? "2px solid #228be6" : undefined,
        outlineOffset: "-2px",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showButtons && (
        <>
          {onInsertLeft && (
            <InsertButton
              style={{ left: -8, top: "50%", transform: "translateY(-50%)" }}
              onClick={onInsertLeft}
              title="ここにセルを挿入（右にシフト）"
            />
          )}
          {onInsertRight && (
            <InsertButton
              style={{ right: -8, top: "50%", transform: "translateY(-50%)" }}
              onClick={onInsertRight}
              title="右にセルを挿入（右にシフト）"
            />
          )}
          {onInsertTop && (
            <InsertButton
              style={{ top: -8, left: "50%", transform: "translateX(-50%)" }}
              onClick={onInsertTop}
              title="ここにセルを挿入（下にシフト）"
            />
          )}
          {onInsertBottom && (
            <InsertButton
              style={{ bottom: -8, left: "50%", transform: "translateX(-50%)" }}
              onClick={onInsertBottom}
              title="下にセルを挿入（下にシフト）"
            />
          )}
        </>
      )}
    </td>
  );
}

export default DroppableCell;
