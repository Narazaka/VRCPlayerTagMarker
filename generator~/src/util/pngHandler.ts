import imageCompression from "browser-image-compression";
import { decodeSync, encodeSync } from "png-chunk-itxt";
import encodePng from "png-chunks-encode";
import extractPng from "png-chunks-extract";
import { toUnityVisualData, type VisualData } from "./VisualData";

const jsKeyword = "vrcTagMarkerData";
const unityKeyword = "vrcTagMarkerDataUnity";

export function addDataText(
  png: Uint8Array,
  dataItems: { [keyword: string]: string },
) {
  const chunks = extractPng(png);
  for (const [keyword, data] of Object.entries(dataItems)) {
    const iTxtChunk = {
      name: "iTXt",
      data: encodeSync({
        keyword,
        compressionFlag: false,
        compressionMethod: 0,
        languageTag: "",
        translatedKeyword: "",
        text: data,
      }),
    };
    // Insert iTXt chunk before the first IDAT chunk
    chunks.splice(
      chunks.findIndex((p) => p.name === "IDAT"),
      0,
      iTxtChunk,
    );
  }
  const newPng = encodePng(chunks);
  return newPng;
}

export function getDataText<T extends string>(
  png: Uint8Array,
  ...keywords: T[]
) {
  const chunks = extractPng(png);
  const dataItems = {} as Record<T, string | undefined>;
  for (const chunk of chunks) {
    if (chunk.name === "iTXt") {
      const data = decodeSync(chunk.data);
      if (keywords.includes(data.keyword as T)) {
        dataItems[data.keyword as T] = data.text;
      }
    }
  }
  return dataItems;
}

export function addDataJson(
  png: Uint8Array,
  dataItems: { [keyword: string]: unknown },
) {
  const jsonDataItems: Record<string, string> = {};
  for (const [keyword, data] of Object.entries(dataItems)) {
    jsonDataItems[keyword] = JSON.stringify(data);
  }
  return addDataText(png, jsonDataItems);
}

export function getDataJson<K extends Record<string, unknown>>(
  png: Uint8Array,
  ...keywords: (keyof K)[]
) {
  const jsonStrings = getDataText(png, ...(keywords as string[]));
  const data: Partial<K> = {};
  if (jsonStrings) {
    for (const keyword of keywords) {
      const jsonString = jsonStrings[keyword as string];
      if (jsonString) {
        data[keyword] = JSON.parse(jsonString);
      }
    }
  }
  return data;
}

export async function canvasToPngWithDataBlob(
  canvas: HTMLCanvasElement,
  data: VisualData,
) {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) return;
  const compressedBlob = await imageCompression(blob as File, {
    alwaysKeepResolution: true,
  });
  const png = new Uint8Array(await compressedBlob.arrayBuffer());
  return new Blob(
    [
      addDataJson(png, {
        [jsKeyword]: data,
        [unityKeyword]: toUnityVisualData(data),
      }),
    ],
    {
      type: "image/png",
    },
  );
}

export function saveBlobToFile(blob: Blob, filename: string): void {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function loadFromBlob(file: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(new Uint8Array(event.target.result as ArrayBuffer));
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}

export async function loadPngDataFromBlob(file: Blob) {
  const png = await loadFromBlob(file);
  const data = getDataJson<{ [jsKeyword]: VisualData }>(png, jsKeyword);
  return data[jsKeyword];
}
