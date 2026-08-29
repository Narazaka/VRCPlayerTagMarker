import chroma from "chroma-js";
import type { PartialVisualProps, VisualProps } from "./VisualProps";

export interface TextRun {
  text: string;
  props: VisualProps;
}

export interface RichTextTag {
  kind: "open" | "close";
  name: string;
  raw: string;
  start: number;
  end: number;
  /** open: このタグが上書きするプロパティ */
  applied: PartialVisualProps;
  /** このタグの直前・直後に有効なプロパティ */
  propsBefore: VisualProps;
  propsAfter: VisualProps;
  /** close: 閉じる開始タグの index（内側から。末尾が対応する開始タグ） */
  popped: number[];
}

/** 開始/終了タグ候補。値はクォート有無どちらも可 */
const TAG = /<(\/?)([a-zA-Z]+)(?:=("[^"]*"|[^>]*))?>/g;

type TagApplier = (
  value: string | undefined,
  current: VisualProps,
  scale: number,
) => PartialVisualProps | null;

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

/** タグとして書き出せるプロパティ（並びは外側→内側） */
export const taggableProps = [
  "fontSize",
  "textColor",
  "fontWeight",
  "fontFamily",
  "outlineWidth",
  "outlineColor",
  "outlineType",
  "scaleX",
] as const satisfies readonly (keyof VisualProps)[];

function writeTag(
  prop: (typeof taggableProps)[number],
  props: PartialVisualProps,
): string | null {
  switch (prop) {
    case "fontSize":
      return `<size=${props.fontSize}>`;
    case "textColor":
      return `<color=${props.textColor}>`;
    // normal に戻すタグは無いので、太字のときだけ書ける
    case "fontWeight":
      return props.fontWeight === "bold" ? "<b>" : null;
    // 値にクォートが含まれていても壊れないよう、書き出しでは付けない（読み取りは有無どちらも可）
    case "fontFamily":
      return `<font=${props.fontFamily}>`;
    case "outlineWidth":
      return `<outlineWidth=${props.outlineWidth}>`;
    case "outlineColor":
      return `<outlineColor=${props.outlineColor}>`;
    case "outlineType":
      return `<outlineType=${props.outlineType}>`;
    case "scaleX":
      return `<scaleX=${props.scaleX}>`;
  }
}

const tagName = (raw: string) =>
  (raw.match(/^<([a-zA-Z]+)/)?.[1] ?? "").toLowerCase();

/** 有効なタグだけを、テキスト中の位置とスタックの対応付きで拾う */
export function scanRichTextTags(
  text: string,
  base: VisualProps,
  scale = 1,
): RichTextTag[] {
  const tags: RichTextTag[] = [];
  const opened: number[] = [];
  let props = base;
  TAG.lastIndex = 0;
  let match = TAG.exec(text);
  while (match !== null) {
    const [raw, closing, rawName, rawValue] = match;
    const name = rawName.toLowerCase();
    const value = rawValue?.replace(/^"(.*)"$/, "$1");
    const start = match.index;
    const end = start + raw.length;
    if (closing) {
      let at = -1;
      for (let i = opened.length - 1; i >= 0; i--) {
        if (tags[opened[i]].name === name) {
          at = i;
          break;
        }
      }
      if (at >= 0 && value == null) {
        const target = opened[at];
        // 内側の開きっぱなしのタグもこの閉じタグで一緒に閉じられる
        const popped = opened.slice(at).reverse();
        opened.length = at;
        const propsBefore = props;
        props = tags[target].propsBefore;
        tags.push({
          kind: "close",
          name,
          raw,
          start,
          end,
          applied: {},
          propsBefore,
          propsAfter: props,
          popped,
        });
      }
    } else {
      const applied = appliers.get(name)?.(value, props, scale);
      if (applied) {
        const propsBefore = props;
        props = { ...props, ...applied };
        tags.push({
          kind: "open",
          name,
          raw,
          start,
          end,
          applied,
          propsBefore,
          propsAfter: props,
          popped: [],
        });
        opened.push(tags.length - 1);
      }
    }
    match = TAG.exec(text);
  }
  return tags;
}

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
  let props = base;
  let last = 0;
  for (const tag of scanRichTextTags(text, base, scale)) {
    const chunk = text.slice(last, tag.start);
    if (chunk) runs.push({ text: chunk, props });
    props = tag.propsAfter;
    last = tag.end;
  }
  const rest = text.slice(last);
  if (rest) runs.push({ text: rest, props });
  return runs;
}

/** プロパティの部分指定を開始タグ列・終了タグ列にする */
export function toRichTextTags(props: PartialVisualProps): {
  open: string;
  close: string;
} {
  const opens: string[] = [];
  for (const prop of taggableProps) {
    if (props[prop] == null) continue;
    const tag = writeTag(prop, props);
    if (tag) opens.push(tag);
  }
  return {
    open: opens.join(""),
    close: opens
      .map((tag) => `</${tagName(tag)}>`)
      .reverse()
      .join(""),
  };
}

/** タグを取り除く（暗黙に閉じていた分は明示的に閉じ直す） */
function removeTags(
  text: string,
  tags: RichTextTag[],
  removed: Set<number>,
): string {
  if (removed.size === 0) return text;
  let result = "";
  let last = 0;
  tags.forEach((tag, index) => {
    if (tag.kind === "open") {
      if (!removed.has(index)) return;
      result += text.slice(last, tag.start);
      last = tag.end;
      return;
    }
    const target = tag.popped[tag.popped.length - 1];
    if (!removed.has(target)) return;
    result += text.slice(last, tag.start);
    result += tag.popped
      .filter((popped) => popped !== target && !removed.has(popped))
      .map((popped) => `</${tags[popped].name}>`)
      .join("");
    last = tag.end;
  });
  return result + text.slice(last);
}

/** 指定プロパティを上書きしているタグを取り除く */
function removeTagsFor(
  text: string,
  keys: (keyof VisualProps)[],
  base: VisualProps,
  scale: number,
): string {
  const tags = scanRichTextTags(text, base, scale);
  const removed = new Set<number>();
  tags.forEach((tag, index) => {
    if (tag.kind !== "open") return;
    if (keys.some((key) => tag.applied[key] != null)) removed.add(index);
  });
  return removeTags(text, tags, removed);
}

/** 位置 pos で開いたままになっている開始タグの index（外側から） */
function openTagsAt(tags: RichTextTag[], pos: number): number[] {
  const opened: number[] = [];
  for (const [index, tag] of tags.entries()) {
    if (tag.end > pos) break;
    if (tag.kind === "open") {
      opened.push(index);
      continue;
    }
    const at = opened.indexOf(tag.popped[tag.popped.length - 1]);
    if (at >= 0) opened.length = at;
  }
  return opened;
}

/**
 * 選択範囲にタグを被せる。タグをまたぐ選択でも対応が壊れないよう、
 * 選択端をタグの外へ寄せ、境界でタグを閉じ直してから被せる。
 */
export function applyTagsToSelection({
  text,
  start,
  end,
  props,
  base,
  scale = 1,
}: {
  text: string;
  start: number;
  end: number;
  props: PartialVisualProps;
  base: VisualProps;
  scale?: number;
}): { text: string; start: number; end: number } {
  const tags = scanRichTextTags(text, base, scale);
  // タグ文字列の途中で切れている選択端は、そのタグの外側へ寄せる
  const inside = (pos: number) =>
    tags.find((tag) => tag.start < pos && pos < tag.end);
  const from = inside(start)?.start ?? start;
  const to = inside(end)?.end ?? end;

  const openedBefore = openTagsAt(tags, from);
  const openedAfter = openTagsAt(tags, to);

  // 選択範囲をちょうど覆っている同種タグは、入れ子にせず置き換える
  const closeStartOf = (index: number) =>
    tags.find(
      (tag) =>
        tag.kind === "close" && tag.popped[tag.popped.length - 1] === index,
    )?.start ?? text.length;
  const hasTextIn = (a: number, b: number) => {
    let last = a;
    let plain = "";
    for (const tag of tags) {
      if (tag.end <= a || tag.start >= b) continue;
      plain += text.slice(last, tag.start);
      last = tag.end;
    }
    return plain.length + text.slice(last, b).length > 0;
  };
  const covering = openedBefore.filter(
    (index) =>
      (Object.keys(tags[index].applied) as (keyof VisualProps)[]).every(
        (key) => props[key] != null,
      ) &&
      !hasTextIn(tags[index].end, from) &&
      !hasTextIn(to, closeStartOf(index)),
  );
  if (covering.length > 0) {
    const shift = covering.reduce(
      (sum, index) => sum + (tags[index].end - tags[index].start),
      0,
    );
    return applyTagsToSelection({
      text: removeTags(text, tags, new Set(covering)),
      start: from - shift,
      end: to - shift,
      props,
      base,
      scale,
    });
  }
  // 選択内で閉じられるタグ: 選択の前で閉じ、選択の中で開き直す
  const closedInside = openedBefore.filter(
    (index) => !openedAfter.includes(index),
  );
  // 選択内で開かれるタグ: 選択の中で閉じ、選択の後で開き直す
  const openedInside = openedAfter.filter(
    (index) => !openedBefore.includes(index),
  );
  const closesFor = (indexes: number[]) =>
    indexes
      .map((index) => `</${tags[index].name}>`)
      .reverse()
      .join("");

  const fragment =
    closedInside.map((index) => tags[index].raw).join("") +
    text.slice(from, to) +
    closesFor(openedInside);
  const keys = (Object.keys(props) as (keyof VisualProps)[]).filter(
    (key) => props[key] != null,
  );
  const { open, close } = toRichTextTags(props);
  const cleaned = removeTagsFor(fragment, keys, base, scale);
  const head = text.slice(0, from) + closesFor(closedInside) + open;
  const tail =
    close +
    openedInside.map((index) => tags[index].raw).join("") +
    text.slice(to);
  return {
    text: head + cleaned + tail,
    start: head.length,
    end: head.length + cleaned.length,
  };
}
