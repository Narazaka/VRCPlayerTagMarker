import { ActionIcon, Popover } from "@mantine/core";
import { memo } from "react";
import { IoColorPalette } from "react-icons/io5";
import type {
  PartialVisualProps,
  VisualProps,
  WithParentVisualProps,
} from "./util/VisualProps";
import VisualPropsFields from "./VisualPropsFields";

function VisualPropsView({
  required,
  props = {},
  setProps,
  withParentVisualProps,
  fonts,
}:
  | {
      required?: false;
      props: PartialVisualProps | undefined;
      setProps: (newTitle: PartialVisualProps) => void;
      withParentVisualProps: WithParentVisualProps;
      fonts: string[];
    }
  | {
      required: true;
      props: VisualProps;
      setProps: (newTitle: PartialVisualProps) => void;
      withParentVisualProps?: never;
      fonts: string[];
    }) {
  return (
    <Popover
      position="right-start"
      trapFocus
      withArrow
      shadow="md"
      middlewares={{
        flip: { fallbackAxisSideDirection: "end" },
      }}
    >
      <Popover.Target>
        <ActionIcon
          size="xs"
          variant={
            Object.keys(props).filter((p) => p !== "text" && p !== "cellId")
              .length > 0
              ? "filled"
              : "default"
          }
        >
          <IoColorPalette size={16} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <VisualPropsFields
          required={required}
          props={props}
          setProps={setProps}
          withParentVisualProps={withParentVisualProps}
          fonts={fonts}
        />
      </Popover.Dropdown>
    </Popover>
  );
}

export default memo(VisualPropsView);
