import { ActionIcon, Group } from "@mantine/core";
import { memo } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";
import type { EditMode } from "./EditMode";

function RowActions({
  mode,
  onInsertRow,
  onDeleteRow,
}: {
  mode: EditMode;
  onInsertRow: () => void;
  onDeleteRow: () => void;
}) {
  return (
    <Group gap={2} justify="flex-end">
      {mode === "delete" && (
        <ActionIcon
          size="xs"
          variant="subtle"
          color="red"
          onClick={onDeleteRow}
          title="行を削除"
        >
          <IoRemove size={14} />
        </ActionIcon>
      )}
      {mode === "insert" && (
        <ActionIcon
          size="xs"
          variant="subtle"
          onClick={onInsertRow}
          title="行を下に挿入"
        >
          <IoAdd size={14} />
        </ActionIcon>
      )}
    </Group>
  );
}

export default memo(RowActions);
