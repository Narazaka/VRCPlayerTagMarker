import { Group, Switch, Text } from "@mantine/core";
import {
  defaultVisualProps,
  type PartialVisualProps,
  type VisualProps,
  type WithParentVisualProps,
} from "./util/VisualProps";
import { useCallback } from "react";

const useWithPartial = ({
  required,
  setProps,
  withParentVisualProps,
}: {
  required?: boolean;
  setProps: (newTitle: PartialVisualProps) => void;
  withParentVisualProps: WithParentVisualProps | undefined;
}) => {
  const CheckBoxFor = useCallback(
    ({ prop, value }: { prop: keyof PartialVisualProps; value: unknown }) =>
      required ? null : (
        <Switch
          size="xs"
          checked={value != null}
          onChange={(e) => {
            if (e.currentTarget.checked) {
              setProps({
                [prop]: withParentVisualProps
                  ? withParentVisualProps(undefined)[prop]
                  : defaultVisualProps[prop],
              });
            } else {
              setProps({ [prop]: undefined });
            }
          }}
        />
      ),
    [required, setProps, withParentVisualProps],
  );
  const WithPartial = useCallback(
    ({
      label,
      prop,
      value,
      children,
    }: React.PropsWithChildren<{
      label?: string;
      prop: keyof VisualProps;
      value: unknown;
    }>) => (
      <div>
        <Group mb={3}>
          <Text size="xs" fw={500}>
            {label}
          </Text>
          <CheckBoxFor prop={prop} value={value} />
        </Group>
        {children}
      </div>
    ),
    [CheckBoxFor],
  );
  return WithPartial;
};

export default useWithPartial;
