import { describe, expect, it } from "vitest";
import {
  applyTagsToSelection,
  parseRichText,
  toRichTextTags,
} from "../richText";
import { defaultVisualProps } from "../VisualProps";

const base = defaultVisualProps;
const parse = (text: string, scale = 1) => parseRichText(text, base, scale);
const texts = (text: string, scale = 1) =>
  parse(text, scale).map((r) => r.text);

describe("parseRichText", () => {
  it("タグが無ければ丸ごと1断片", () => {
    const runs = parse("タグ");
    expect(runs).toHaveLength(1);
    expect(runs[0].text).toBe("タグ");
    expect(runs[0].props).toBe(base);
  });

  it("空文字列は断片を生まない", () => {
    expect(parse("")).toEqual([]);
  });

  it("size=% は継承値からの相対", () => {
    const runs = parse("あ<size=50%>い</size>う");
    expect(texts("あ<size=50%>い</size>う")).toEqual(["あ", "い", "う"]);
    expect(runs[0].props.fontSize).toBe(base.fontSize);
    expect(runs[1].props.fontSize).toBe(base.fontSize / 2);
    expect(runs[2].props.fontSize).toBe(base.fontSize);
  });

  it("size=% はネストで累積する", () => {
    const runs = parse("<size=50%><size=50%>あ");
    expect(runs[0].props.fontSize).toBe(base.fontSize / 4);
  });

  it("size のpx指定には解像度倍率が掛かる（%には掛からない）", () => {
    expect(parse("<size=24>あ", 2)[0].props.fontSize).toBe(48);
    expect(parse("<size=50%>あ", 2)[0].props.fontSize).toBe(base.fontSize / 2);
  });

  it("閉じ忘れたタグは末尾まで効く", () => {
    const runs = parse("あ<b>い");
    expect(runs[0].props.fontWeight).toBe("normal");
    expect(runs[1].props.fontWeight).toBe("bold");
  });

  it("color / font / ふち / 伸縮率を上書きする", () => {
    const [run] = parse(
      '<color=#ff0000><font="My Font"><outlineWidth=4><outlineColor=#0f0><outlineType=thick><scaleX=1.5>あ',
    );
    expect(run.props.textColor).toBe("#ff0000");
    expect(run.props.fontFamily).toBe("My Font");
    expect(run.props.outlineWidth).toBe(4);
    expect(run.props.outlineColor).toBe("#0f0");
    expect(run.props.outlineType).toBe("thick");
    expect(run.props.scaleX).toBe(1.5);
  });

  it("outlineWidth のpx指定にも解像度倍率が掛かる", () => {
    expect(parse("<outlineWidth=4>あ", 2)[0].props.outlineWidth).toBe(8);
  });

  it("フォント名のクォートは省略でき、書き出したタグを読み直せる", () => {
    expect(parse("<font=My Font>あ")[0].props.fontFamily).toBe("My Font");
    const { open } = toRichTextTags({ fontFamily: 'My "Font"' });
    expect(parse(`${open}あ`)[0].props.fontFamily).toBe('My "Font"');
  });

  it("タグ名は大文字小文字を区別しない", () => {
    expect(parse("<SIZE=50%>あ")[0].props.fontSize).toBe(base.fontSize / 2);
  });

  it("未知のタグ・不正な値・孤立した閉じタグは文字として残る", () => {
    expect(texts("<hoge>あ")).toEqual(["<hoge>あ"]);
    expect(texts("<color=zzz>あ")).toEqual(["<color=zzz>あ"]);
    expect(texts("<size=%>あ")).toEqual(["<size=%>あ"]);
    expect(texts("<b=1>あ")).toEqual(["<b=1>あ"]);
    expect(texts("</size>あ")).toEqual(["</size>あ"]);
    expect(texts("<b>あ</size>")).toEqual(["あ</size>"]);
  });

  it("閉じタグは対応する開始タグまで戻す", () => {
    const runs = parse("<b><size=50%>あ</b>い");
    expect(runs[1].props.fontWeight).toBe("normal");
    expect(runs[1].props.fontSize).toBe(base.fontSize);
  });

  it("改行はそのまま断片に含まれる", () => {
    expect(texts("あ\nい")).toEqual(["あ\nい"]);
  });
});

describe("toRichTextTags", () => {
  it("指定したプロパティだけを外側→内側の順で書き出す", () => {
    expect(toRichTextTags({ fontSize: 24, textColor: "#f00" })).toEqual({
      open: "<size=24><color=#f00>",
      close: "</color></size>",
    });
  });

  it("太字はONのときだけタグになる（normalに戻すタグは無い）", () => {
    expect(toRichTextTags({ fontWeight: "bold" }).open).toBe("<b>");
    expect(toRichTextTags({ fontWeight: "normal" })).toEqual({
      open: "",
      close: "",
    });
  });

  it("ふち・フォント・伸縮率も書き出せる", () => {
    expect(
      toRichTextTags({
        fontFamily: "My Font",
        outlineWidth: 4,
        outlineColor: "#0f0",
        outlineType: "thick",
        scaleX: 1.5,
      }).open,
    ).toBe(
      "<font=My Font><outlineWidth=4><outlineColor=#0f0><outlineType=thick><scaleX=1.5>",
    );
  });
});

describe("applyTagsToSelection", () => {
  const apply = (text: string, start: number, end: number) =>
    applyTagsToSelection({
      text,
      start,
      end,
      props: { textColor: "#f00" },
      base,
    });

  it("選択範囲をタグで囲み、囲んだ範囲を選択として返す", () => {
    const result = apply("あいう", 1, 2);
    expect(result.text).toBe("あ<color=#f00>い</color>う");
    expect(result.text.slice(result.start, result.end)).toBe("い");
  });

  it("選択端がタグ文字列の途中なら、そのタグの外側へ寄せる", () => {
    // "<b>あい</b>" の <b> の内部から </b> の内部までを選択
    expect(apply("<b>あい</b>", 1, 6).text).toBe(
      "<color=#f00><b>あい</b></color>",
    );
  });

  it("タグの対応をまたぐ選択では、境界でタグを閉じ直す", () => {
    expect(apply("<b>あい</b>う", 4, 10).text).toBe(
      "<b>あ</b><color=#f00><b>い</b>う</color>",
    );
  });

  it("選択内で開かれるタグは選択末尾で閉じ、選択の後で開き直す", () => {
    // "あ<b>いう" の "あ<b>い" を選択
    const result = apply("あ<b>いう", 0, 5);
    expect(result.text).toBe("<color=#f00>あ<b>い</b></color><b>う");
  });

  it("同じ種類のタグが選択内にあれば取り除いてから被せる", () => {
    expect(apply("<color=#0f0>あ</color>い", 0, 23).text).toBe(
      "<color=#f00>あい</color>",
    );
  });

  it("同種タグの除去で暗黙に閉じていたタグは明示的に閉じ直す", () => {
    expect(apply("<color=#0f0><b>あ</color>い", 0, 26).text).toBe(
      "<color=#f00><b>あ</b>い</color>",
    );
  });

  const applySize = (text: string, start: number, end: number) =>
    applyTagsToSelection({
      text,
      start,
      end,
      props: { fontSize: 32 },
      base,
    });

  it("選択範囲をちょうど覆っている同種タグは置き換える", () => {
    expect(applySize("<size=31>あります</size>", 9, 13).text).toBe(
      "<size=32>あります</size>",
    );
  });

  it("間に別のタグがあっても、覆う文字が同じなら置き換える", () => {
    expect(applySize("<size=31><b>あ</b></size>", 12, 13).text).toBe(
      "<b><size=32>あ</size></b>",
    );
  });

  it("覆う範囲に選択外の文字があるときは入れ子のままにする", () => {
    expect(applySize("<size=31>あい</size>", 10, 11).text).toBe(
      "<size=31>あ<size=32>い</size></size>",
    );
  });

  it("種類が違うタグは置き換えない", () => {
    expect(applySize("<b>あ</b>", 3, 4).text).toBe("<b><size=32>あ</size></b>");
  });

  it("適用後に読み直すと選択範囲だけが指定のスタイルになる", () => {
    const result = apply("<b>あい</b>う", 4, 10);
    const runs = parseRichText(result.text, base);
    const colored = runs.filter((run) => run.props.textColor === "#f00");
    expect(colored.map((run) => run.text).join("")).toBe("いう");
    expect(runs.find((run) => run.text === "あ")?.props.textColor).toBe(
      base.textColor,
    );
  });
});
