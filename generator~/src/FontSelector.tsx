import { Combobox, Text, TextInput, useCombobox } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useVirtualizer } from "@tanstack/react-virtual";
import Fuse from "fuse.js";
import { memo, useMemo, useRef } from "react";

function FontOption({
  font,
}: {
  font: string;
}) {
  return (
    <Combobox.Option value={font}>
      <Text component="span" ff={`"${font}"`}>
        あ愛A1
      </Text>{" "}
      <Text component="span" size="xs">
        {font}
      </Text>
    </Combobox.Option>
  );
}

function FontSelector({
  fonts,
  fontFamily,
  setFontFamily,
  disabled,
}: {
  fonts: string[];
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
  disabled?: boolean;
}) {
  const combobox = useCombobox();
  const fuse = useMemo(() => new Fuse(fonts), [fonts]);
  const filteredFonts = fuse.search(fontFamily);
  const scrollRef = useRef<HTMLDivElement>(null);
  const options =
    fontFamily === ""
      ? fonts
      : fonts.indexOf(fontFamily) !== -1 // exact match
        ? [fontFamily, ""].concat(fonts)
        : filteredFonts.map((font) => font.item);
  const rowVirtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 36,
  });
  return (
    <Combobox
      disabled={disabled}
      store={combobox}
      onOptionSubmit={(optionValue) => {
        setFontFamily(optionValue);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <TextInput
          disabled={disabled}
          size="xs"
          w="100%"
          value={fontFamily}
          onChange={(event) => {
            setFontFamily(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options
          mah={380}
          style={{ overflowY: "auto" }}
          ref={scrollRef}
        >
          {options.length === 0 ? (
            <Combobox.Empty>なし</Combobox.Empty>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const font = options[virtualRow.index];
                return (
                  <div
                    key={font}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {font === "" ? (
                      <div style={{ padding: "10px 0" }}>
                        <hr />
                      </div>
                    ) : (
                      <FontOption font={font} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

const FontSelectorMemo = memo(FontSelector);

function FontSelectorDebounced({
  fonts,
  fontFamily,
  setFontFamily,
  disabled,
}: {
  fonts: string[];
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
  disabled?: boolean;
}) {
  return (
    <FontSelectorMemo
      fonts={useDebouncedValue(fonts, 100)[0]}
      fontFamily={fontFamily}
      setFontFamily={setFontFamily}
      disabled={disabled}
    />
  );
}

export default FontSelectorDebounced;
