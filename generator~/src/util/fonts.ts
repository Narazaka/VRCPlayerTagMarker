import { useMemo } from "react";
import { useLoadFonts } from "./loadFonts";
import { useLocalFonts } from "./localFonts";
import { uniq } from "es-toolkit";

export function useFonts(allowLocalFonts: boolean) {
  const localFonts = useLocalFonts(allowLocalFonts);
  const loadFonts = useLoadFonts();
  const fonts = useMemo(
    () => uniq([...localFonts, ...loadFonts]),
    [localFonts, loadFonts],
  );
  return fonts;
}
