import { describe, expect, it } from "vitest";
import { parseRichText } from "../richText";
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
