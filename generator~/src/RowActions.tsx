import { ActionIcon, Group } from "@mantine/core";
import { memo } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";

function RowActions({
  onInsertRow,
  onDeleteRow,
}: {
  onInsertRow: () => void;
  onDeleteRow: () => void;
}) {
  return (
    <Group gap={2} justify="flex-end">
      <ActionIcon
        size="xs"
        variant="subtle"
        onClick={onInsertRow}
        title="行を下に挿入"
      >
        <IoAdd size={14} />
      </ActionIcon>
      <ActionIcon
        size="xs"
        variant="subtle"
        color="red"
        onClick={onDeleteRow}
        title="行を削除"
      >
        <IoRemove size={14} />
      </ActionIcon>
    </Group>
  );
}

export default memo(RowActions);
