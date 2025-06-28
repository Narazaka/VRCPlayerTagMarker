import { uniq } from "es-toolkit";
import { useMemo } from "react";
import { useLoadFonts } from "./loadFonts";
import { useLocalFonts } from "./localFonts";

export function useFonts(allowLocalFonts: boolean) {
  const localFonts = useLocalFonts(allowLocalFonts);
  const loadFonts = useLoadFonts();
  const fonts = useMemo(
    () => uniq([...localFonts, ...loadFonts]),
    [localFonts, loadFonts],
  );
  return fonts;
}
