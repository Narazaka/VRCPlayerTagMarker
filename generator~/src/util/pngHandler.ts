import imageCompression from "browser-image-compression";
import { decodeSync, encodeSync } from "png-chunk-itxt";
import encodePng from "png-chunks-encode";
import extractPng from "png-chunks-extract";
import type { VisualData } from "./VisualData";

const keyword = "vrcTagMarkerData";

export function addDataText(png: Uint8Array, data: string) {
  const chunks = extractPng(png);
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
  const newPng = encodePng(chunks);
  return newPng;
}

export function getDataText(png: Uint8Array) {
  const chunks = extractPng(png);
  for (const chunk of chunks) {
    if (chunk.name === "iTXt") {
      const data = decodeSync(chunk.data);
      if (data.keyword === keyword) {
        return data.text;
      }
    }
  }
}

export function addDataJson(png: Uint8Array, data: unknown) {
  const jsonString = JSON.stringify(data);
  return addDataText(png, jsonString);
}

export function getDataJson<T = unknown>(png: Uint8Array) {
  const jsonString = getDataText(png);
  if (jsonString) {
    return JSON.parse(jsonString) as T;
  }
  return null;
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
  return new Blob(
    [addDataJson(new Uint8Array(await compressedBlob.arrayBuffer()), data)],
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
  const data = getDataJson<VisualData>(png);
  return data;
}
