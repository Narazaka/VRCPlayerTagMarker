import { Button, List, Popover, Stack, Table } from "@mantine/core";
import { memo } from "react";
import { IoHelpCircleOutline } from "react-icons/io5";

const tags: [tag: string, description: string][] = [
  ["<size=70%>", "文字サイズ（元のサイズに対する割合）"],
  ["<size=24>", "文字サイズ（px）"],
  ["<color=#f00>", "文字色"],
  ["<b>", "太字"],
  ["<font=フォント名>", "フォント"],
  ["<outlineWidth=4>", "ふち幅（px）"],
  ["<outlineColor=#000>", "ふち色"],
  ["<outlineType=thick>", "ふちの種類（thick / blur）"],
  ["<scaleX=1.2>", "横方向の伸縮率"],
];

function TagLegend() {
  return (
    <Popover position="bottom-end" withArrow shadow="md">
      <Popover.Target>
        <Button
          size="compact-xs"
          variant="subtle"
          leftSection={<IoHelpCircleOutline size={14} />}
        >
          タグ一覧
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs">
          <Table withRowBorders={false} verticalSpacing={2} fz="xs">
            <Table.Tbody>
              {tags.map(([tag, description]) => (
                <Table.Tr key={tag}>
                  <Table.Td>
                    <code>{tag}</code>
                  </Table.Td>
                  <Table.Td>{description}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <List size="xs" spacing={2}>
            <List.Item>
              閉じるときは <code>&lt;/size&gt;</code> のように書きます。閉じ忘れ
              た場合は末尾まで効きます
            </List.Item>
            <List.Item>
              割合指定はネストすると累積します（
              <code>&lt;size=50%&gt;&lt;size=50%&gt;</code> で 25%）
            </List.Item>
            <List.Item>
              解釈できないタグはそのまま文字として表示されます
            </List.Item>
            <List.Item>
              文字を選択すると出る Aa ボタンから、フォームでタグを付けられます
            </List.Item>
          </List>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default memo(TagLegend);
