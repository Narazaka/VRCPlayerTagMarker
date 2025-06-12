import { useEffect, useState } from "react";

type QueryLocalFonts = () => { fullName: string }[];

export async function getFonts() {
  try {
    if ("queryLocalFonts" in window) {
      const fonts = await (window.queryLocalFonts as QueryLocalFonts)();
      return fonts.map((font) => font.fullName);
    }
  } catch {
    // nop
  }
  return [];
}

let fonts = null as string[] | null;

export async function getFontsCached() {
  if (fonts) {
    return fonts;
  }
  fonts = await getFonts();
  return fonts;
}

export function useLocalFonts(allowLocalFonts: boolean) {
  const [fonts, setFonts] = useState<string[]>([
    "Meiryo",
    "Meiryo UI",
    "Arial",
    "Courier New",
    "Georgia",
    "Times New Roman",
    "Verdana",
  ]);
  useEffect(() => {
    if (allowLocalFonts) getFontsCached().then(setFonts);
  }, [allowLocalFonts]);
  return fonts;
}
