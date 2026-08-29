import chroma from "chroma-js";
import type { VisualProps } from "./VisualProps";

export interface TextRun {
  text: string;
  props: VisualProps;
}

/** 開始/終了タグ候補。値はクォート有無どちらも可 */
const TAG = /<(\/?)([a-zA-Z]+)(?:=("[^"]*"|[^>]*))?>/g;

type TagApplier = (
  value: string | undefined,
  current: VisualProps,
  scale: number,
) => Partial<VisualProps> | null;

const num = (value: string | undefined) => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * タグ名(小文字) → プロパティ上書き。
 * null は不正な値を意味し、その場合タグは文字列としてそのまま描画される。
 */
const appliers = new Map<string, TagApplier>([
  [
    "size",
    (value, current, scale) => {
      if (value?.endsWith("%")) {
        const percent = num(value.slice(0, -1));
        return percent == null
          ? null
          : { fontSize: (current.fontSize * percent) / 100 };
      }
      const size = num(value);
      return size == null ? null : { fontSize: size * scale };
    },
  ],
  ["color", (value) => (chroma.valid(value) ? { textColor: value } : null)],
  ["b", (value) => (value == null ? { fontWeight: "bold" } : null)],
  ["font", (value) => (value ? { fontFamily: value } : null)],
  [
    "outlinewidth",
    (value, _current, scale) => {
      const width = num(value);
      return width == null ? null : { outlineWidth: width * scale };
    },
  ],
  [
    "outlinecolor",
    (value) => (chroma.valid(value) ? { outlineColor: value } : null),
  ],
  [
    "outlinetype",
    (value) =>
      value === "thick" || value === "blur" ? { outlineType: value } : null,
  ],
  [
    "scalex",
    (value) => {
      const scaleX = num(value);
      return scaleX == null ? null : { scaleX };
    },
  ],
]);

/**
 * Unityリッチテキスト風のタグを含む文字列を、スタイル付きの断片に分解する。
 * scale は解像度倍率で、px指定のタグ値(size/outlineWidth)に掛かる。
 */
export function parseRichText(
  text: string,
  base: VisualProps,
  scale = 1,
): TextRun[] {
  const runs: TextRun[] = [];
  const opened: { name: string; props: VisualProps }[] = [];
  let props = base;
  let last = 0;
  const pushRun = (end: number) => {
    const chunk = text.slice(last, end);
    if (chunk) runs.push({ text: chunk, props });
  };

  TAG.lastIndex = 0;
  let match = TAG.exec(text);
  while (match !== null) {
    const [tag, closing, rawName, rawValue] = match;
    const name = rawName.toLowerCase();
    const value = rawValue?.replace(/^"(.*)"$/, "$1");
    if (closing) {
      let index = -1;
      for (let i = opened.length - 1; i >= 0; i--) {
        if (opened[i].name === name) {
          index = i;
          break;
        }
      }
      if (index >= 0 && value == null) {
        pushRun(match.index);
        props = opened[index].props;
        opened.length = index;
        last = match.index + tag.length;
      }
    } else {
      const applied = appliers.get(name)?.(value, props, scale);
      if (applied) {
        pushRun(match.index);
        opened.push({ name, props });
        props = { ...props, ...applied };
        last = match.index + tag.length;
      }
    }
    match = TAG.exec(text);
  }
  pushRun(text.length);
  return runs;
}
