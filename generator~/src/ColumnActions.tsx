import { ActionIcon, Group } from "@mantine/core";
import { memo } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";
import type { EditMode } from "./EditMode";

function ColumnActions({
  mode,
  onInsertColumn,
  onDeleteColumn,
}: {
  mode: EditMode;
  onInsertColumn: () => void;
  onDeleteColumn: () => void;
}) {
  return (
    <Group gap={2} justify="flex-end">
      {mode === "delete" && (
        <ActionIcon
          size="xs"
          variant="subtle"
          color="red"
          onClick={onDeleteColumn}
          title="列を削除"
        >
          <IoRemove size={14} />
        </ActionIcon>
      )}
      {mode === "insert" && (
        <ActionIcon
          size="xs"
          variant="subtle"
          onClick={onInsertColumn}
          title="列を右に挿入"
        >
          <IoAdd size={14} />
        </ActionIcon>
      )}
    </Group>
  );
}

export default memo(ColumnActions);
