import { useDroppable } from "@dnd-kit/core";
import type { CSSProperties, ReactNode } from "react";

function DroppableCell({
  row,
  col,
  style,
  children,
}: {
  row: number;
  col: number;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${row}-${col}`,
    data: { row, col },
  });

  return (
    <td
      ref={setNodeRef}
      style={{
        ...style,
        outline: isOver ? "2px solid #228be6" : undefined,
        outlineOffset: "-2px",
      }}
    >
      {children}
    </td>
  );
}

export default DroppableCell;
