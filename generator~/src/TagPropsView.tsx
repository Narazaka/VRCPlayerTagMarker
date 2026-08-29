import { ActionIcon, Button, Popover, Stack, Text } from "@mantine/core";
import { memo, useCallback, useState } from "react";
import { IoText } from "react-icons/io5";
import { taggableProps } from "./util/richText";
import {
  type PartialVisualProps,
  stripVisualProps,
  type WithParentVisualProps,
} from "./util/VisualProps";
import VisualPropsFields from "./VisualPropsFields";

function TagPropsView({
  withParentVisualProps,
  fonts,
  onApply,
}: {
  withParentVisualProps: WithParentVisualProps;
  fonts: string[];
  onApply: (props: PartialVisualProps) => void;
}) {
  const [opened, setOpened] = useState(false);
  const [draft, setDraft] = useState<PartialVisualProps>({});
  // 入力のたびにフォームが作り直されないよう、識別子を固定する
  const setDraftProps = useCallback(
    (newProps: PartialVisualProps) =>
      setDraft((prev) => stripVisualProps({ ...prev, ...newProps })),
    [],
  );
  const hasDraft = Object.keys(draft).length > 0;
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      trapFocus
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <ActionIcon
          size="xs"
          variant="default"
          title="選択範囲にタグを付ける"
          onClick={() => setOpened((prev) => !prev)}
        >
          <IoText size={14} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Text size="xs" fw={500}>
            選択範囲に適用するスタイル（タグになります）
          </Text>
          <VisualPropsFields
            props={draft}
            setProps={setDraftProps}
            withParentVisualProps={withParentVisualProps}
            fonts={fonts}
            only={taggableProps}
          />
          <Text size="xs" c="dimmed">
            太字をOFFのまま適用すると、選択範囲の太字タグを外します。
          </Text>
          <Button
            size="xs"
            disabled={!hasDraft}
            onClick={() => {
              onApply(draft);
              setOpened(false);
            }}
          >
            適用
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default memo(TagPropsView);
