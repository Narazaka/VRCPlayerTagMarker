import { useEffect, useState } from "react";

const roundedMgenPlusWeights = [
  "black",
  "bold",
  "heavy",
  "light",
  "medium",
  "regular",
  "thin",
];
const roundedMgenPlusTypes = [
  "1c",
  "1cp",
  // "1m",
  // "1mn",
  "1p",
  "1pp",
  "2c",
  "2cp",
  // "2m",
  "2p",
  "2pp",
];

const newFontFace = (name: string, url: string) => {
  const urlStr = `local("${name}"), url("${url}")`;
  let fontface = new FontFace(name, urlStr);
  if (fontface.family === "") {
    fontface = new FontFace(name.replace(/[+ ]/g, ""), urlStr);
  }
  return fontface;
};

const fontfaces = [
  newFontFace("GenEi POPle Black", "/GenEiPOPle_v1.0/GenEiPOPle-Bk.ttf"),
  newFontFace("GenEi POPle Pw Black", "/GenEiPOPle_v1.0/GenEiPOPlePw-Bk.ttf"),
  newFontFace(
    "GenEi Nu Gothic EB",
    "/GenEiNuGothic-EB_v1.1/GenEiNuGothic-EB.ttf",
  ),
  newFontFace(
    "GenEi M Gothic v2 Black",
    "/GenEiMGothic_v2.0/GenEiMGothic2-Black.ttf",
  ),
  newFontFace(
    "GenEi M Gothic v2 Bold",
    "/GenEiMGothic_v2.0/GenEiMGothic2-Bold.ttf",
  ),
  newFontFace(
    "GenEi M Gothic v2 Heavy",
    "/GenEiMGothic_v2.0/GenEiMGothic2-Heavy.ttf",
  ),
  newFontFace(
    "GenEi M Gothic v2 Medium",
    "/GenEiMGothic_v2.0/GenEiMGothic2-Medium.ttf",
  ),
  newFontFace(
    "GenEi M Gothic v2 Regular",
    "/GenEiMGothic_v2.0/GenEiMGothic2-Regular.ttf",
  ),
  newFontFace(
    "GenEi LateGo v2 Medium",
    "/GenEiLatin-Separate_v2.1/GenEiLateGoN_v2.ttf",
  ),
  newFontFace(
    "GenEi LateGo P v2 Medium",
    "/GenEiLatin-Separate_v2.1/GenEiLateGoP_v2.ttf",
  ),
  newFontFace(
    "GenEi LateMin v2 Medium",
    "/GenEiLatin-Separate_v2.1/GenEiLateMinN_v2.ttf",
  ),
  newFontFace(
    "GenEi LateMin P v2 Medium",
    "/GenEiLatin-Separate_v2.1/GenEiLateMinP_v2.ttf",
  ),
  newFontFace(
    "GenEi Antique v5 Medium",
    "/GenEiAntique_v5.1a/GenEiAntiqueNv5-M.ttf",
  ),
  newFontFace(
    "GenEi Antique Pv5 Medium",
    "/GenEiAntique_v5.1a/GenEiAntiquePv5-M.ttf",
  ),
  ...roundedMgenPlusWeights.flatMap((weight) =>
    roundedMgenPlusTypes.map((type) => {
      return newFontFace(
        `Rounded-X Mgen+ ${type} ${weight}`,
        `/rounded-x-mgenplus-20150602/rounded-x-mgenplus-${type}-${weight}.ttf`,
      );
    }),
  ),
];

async function* loadFonts() {
  for (const fontface of fontfaces) {
    yield await fontface.load().then((fontface) => {
      document.fonts.add(fontface);
      return fontface;
    });
  }
}

const setFontsEvents = new Set<
  React.Dispatch<React.SetStateAction<string[]>>
>();

async function loadFontsAndReport() {
  const fonts = [];
  for await (const fontface of loadFonts()) {
    fonts.push(fontface.family);
    const newFonts = [...fonts];
    for (const setFonts of setFontsEvents) {
      setFonts(newFonts);
    }
  }
}

let loading: Promise<void>;

function loadFontsAndReportCached(
  setFonts: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setFontsEvents.add(setFonts);
  if (loading) {
    return loading;
  }
  loading = loadFontsAndReport();
  return loading;
}

export function useLoadFonts() {
  const [fonts, setFonts] = useState<string[]>([]);
  useEffect(() => {
    loadFontsAndReportCached(setFonts);
  }, []);
  return fonts;
}
