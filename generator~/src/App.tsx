import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  Alert,
  Button,
  Container,
  Grid,
  NumberInput,
  Slider,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useLocalStorage } from "@mantine/hooks";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import CellPropsView from "./CellPropsView";
import DroppableCell from "./DroppableCell";
import RowActions from "./RowActions";
import type { CellProps } from "./util/CellProps";
import { assignCellIds as assignCellIdsImpl } from "./util/cellIdAssigner";
import { draw } from "./util/draw";
import { useFonts } from "./util/fonts";
import {
  canvasToPngWithDataBlob,
  loadPngDataFromBlob,
  saveBlobToFile,
} from "./util/pngHandler";
import {
  defaultVisualProps,
  genWithParentVisualProps,
  type PartialVisualProps,
  stripVisualProps,
} from "./util/VisualProps";
import VisualPropsView from "./VisualPropsView";

const fontsAllowedStatus = {
  ask: 0,
  allow: 1,
  deny: 2,
};

const cellStyle = {
  border: "1px solid #ccc",
};

function App() {
  const [fontsAllowed, setFontsAllowed] = useLocalStorage({
    key: "fonts-allowed",
    defaultValue: fontsAllowedStatus.ask,
  });
  const fonts = useFonts(fontsAllowed === fontsAllowedStatus.allow);

  const [fileName, setFileName] = useState("タグマーカー");
  const [col, setCol] = useState(3);
  const [row, setRow] = useState(4);
  const [cellWidth, setCellWidth] = useState(256);
  const [cellHeight, setCellHeight] = useState(64);
  const [spacing, setSpacing] = useState(6);
  const [baseVisual, setBaseVisual] = useReducer(
    (state, action: PartialVisualProps) => ({ ...state, ...action }),
    defaultVisualProps,
  );
  const withBaseVisual = useMemo(
    () => genWithParentVisualProps(baseVisual),
    [baseVisual],
  );
  const [colVisuals, setColVisuals] = useState<
    (PartialVisualProps | undefined)[]
  >([]);
  const setColVisual = useMemo(
    () =>
      Array.from({ length: col }).map(
        (_, index) => (props: PartialVisualProps) => {
          setColVisuals((prev) => {
            const newVisuals = [...prev];
            newVisuals[index] = stripVisualProps({
              ...newVisuals[index],
              ...props,
            });
            return newVisuals;
          });
        },
      ),
    [col],
  );
  const [rowVisuals, setRowVisuals] = useState<
    (PartialVisualProps | undefined)[]
  >([]);
  const setRowVisual = useMemo(
    () =>
      Array.from({ length: row }).map(
        (_, index) => (props: PartialVisualProps) => {
          setRowVisuals((prev) => {
            const newVisuals = [...prev];
            newVisuals[index] = stripVisualProps({
              ...newVisuals[index],
              ...props,
            });
            return newVisuals;
          });
        },
      ),
    [row],
  );
  const withRowColVisuals = useMemo(
    () =>
      Array.from({ length: row }).map((_, rowIndex) =>
        Array.from({ length: col }).map((_, colIndex) =>
          genWithParentVisualProps(
            withBaseVisual({
              ...rowVisuals[rowIndex],
              ...colVisuals[colIndex],
            }),
          ),
        ),
      ),
    [col, row, colVisuals, rowVisuals, withBaseVisual],
  );
  const [maxCellId, setMaxCellId] = useState(0);
  const [cells, setCells] = useState<(CellProps | undefined)[][]>([]);
  const setCell = useMemo(
    () =>
      Array.from({ length: row }).map((_, rowIndex) =>
        Array.from({ length: col }).map(
          (_, colIndex) => (props: Partial<CellProps>) => {
            setCells((prev) => {
              const newCells = [...prev];
              if (!newCells[rowIndex]) {
                newCells[rowIndex] = [];
              }
              newCells[rowIndex] = [...newCells[rowIndex]];
              newCells[rowIndex][colIndex] = stripVisualProps({
                ...(newCells[rowIndex][colIndex] || { text: "" }),
                ...props,
              });
              return newCells;
            });
          },
        ),
      ),
    [col, row],
  );
  const assignCellIds = useCallback(
    (cells: (CellProps | undefined)[][]) => assignCellIdsImpl(cells, maxCellId),
    [maxCellId],
  );
  const swapCells = useCallback(
    (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
      setCells((prev) => {
        const newCells = prev.map((row) => (row ? [...row] : []));
        if (!newCells[fromRow]) newCells[fromRow] = [];
        if (!newCells[toRow]) newCells[toRow] = [];
        const temp = newCells[fromRow][fromCol];
        newCells[fromRow][fromCol] = newCells[toRow][toCol];
        newCells[toRow][toCol] = temp;
        return newCells;
      });
    },
    [],
  );

  const insertRow = useCallback(
    (afterRowIndex: number) => {
      setRow((prev) => prev + 1);
      setCells((prev) => {
        const newCells = [...prev];
        newCells.splice(afterRowIndex + 1, 0, Array.from({ length: col }));
        return newCells;
      });
      setRowVisuals((prev) => {
        const newVisuals = [...prev];
        newVisuals.splice(afterRowIndex + 1, 0, undefined);
        return newVisuals;
      });
    },
    [col],
  );

  const deleteRow = useCallback(
    (rowIndex: number) => {
      if (row <= 1) return;
      if (!window.confirm(`行 ${rowIndex + 1} を削除しますか？`)) return;
      setRow((prev) => prev - 1);
      setCells((prev) => {
        const newCells = [...prev];
        newCells.splice(rowIndex, 1);
        return newCells;
      });
      setRowVisuals((prev) => {
        const newVisuals = [...prev];
        newVisuals.splice(rowIndex, 1);
        return newVisuals;
      });
    },
    [row],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = useCallback(() => {
    document.body.style.cursor = "grabbing";
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      document.body.style.cursor = "";
      const { over } = event;
      if (!over) return;
      const from = event.active.data.current as { row: number; col: number };
      const to = over.data.current as { row: number; col: number };
      if (from.row === to.row && from.col === to.col) return;
      swapCells(from.row, from.col, to.row, to.col);
    },
    [swapCells],
  );

  const targetRef = useRef<HTMLCanvasElement>(null);

  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    if (file) {
      setFile(null);
      loadPngDataFromBlob(file).then((data) => {
        if (data) {
          setFileName(
            file.name.replace(/(\.vrc-tag-marker)?\.png$/, "") ||
              "タグマーカー",
          );
          setCol(data.col || 3);
          setRow(data.row || 4);
          setCellWidth(data.cellWidth || 256);
          setCellHeight(data.cellHeight || 64);
          setSpacing(data.spacing || 6);
          setBaseVisual(data.baseVisual || defaultVisualProps);
          setColVisuals(data.colVisuals || []);
          setRowVisuals(data.rowVisuals || []);
          setCells(data.cells || []);
          setMaxCellId(data.maxCellId ?? 0);
        }
      });
    }
  }, [file]);
  const handleDownload = async () => {
    const target = targetRef.current;
    if (!target) return;
    const { cells: cellsWithIds, maxCellId: newMaxCellId } =
      assignCellIds(cells);
    setMaxCellId(newMaxCellId);
    setCells(cellsWithIds);
    const blob = await canvasToPngWithDataBlob(target, {
      version: 2,
      col,
      row,
      cellWidth,
      cellHeight,
      spacing,
      baseVisual,
      colVisuals,
      rowVisuals,
      cells: cellsWithIds,
      maxCellId: newMaxCellId,
    });
    if (!blob) return;
    saveBlobToFile(blob, `${fileName}.vrc-tag-marker.png`);
  };
  const canvasWidth = col * cellWidth;
  const canvasHeight = row * cellHeight;

  const drawParams = useMemo(
    () => ({
      col,
      row,
      cellWidth,
      cellHeight,
      spacing,
      baseVisual,
      cells: Array.from({ length: row }).map((_, rowIndex) =>
        Array.from({ length: col }).map((_, colIndex) =>
          withRowColVisuals[rowIndex][colIndex](
            cells[rowIndex]?.[colIndex] || { text: "" },
          ),
        ),
      ),
    }),
    [
      col,
      row,
      cellWidth,
      cellHeight,
      spacing,
      baseVisual,
      withRowColVisuals,
      cells,
    ],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: fonts
  useEffect(() => {
    const canvas = targetRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw({
      ctx,
      ...drawParams,
    });
  }, [drawParams, fonts]);

  return (
    <Container>
      <Stack>
        <Title>VRC Tag Marker generator</Title>
        <Text>
          <a
            href="https://github.com/Narazaka/VRCPlayerTagMarker"
            target="_blank"
            rel="noopener noreferrer"
          >
            VRC Tag Marker
          </a>
          用のアセットを作るやつです。
        </Text>
        {fontsAllowed !== fontsAllowedStatus.allow && (
          <Alert>
            <Title>ローカルフォント一覧を許可</Title>
            <p>
              PCにインストールされているフォントを名前補完するには、ローカルフォントの読み込みを許可してください。
            </p>
            <Button
              onClick={() => {
                setFontsAllowed(fontsAllowedStatus.allow);
              }}
            >
              Allow
            </Button>
          </Alert>
        )}
        <Grid align="center">
          <Grid.Col span={2}>
            <TextInput
              size="xs"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              label="名前"
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              size="xs"
              value={col}
              onChange={(e) => setCol(Number(e))}
              label="横の要素数"
              min={1}
              max={8}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              size="xs"
              value={row}
              onChange={(e) => setRow(Number(e))}
              label="縦の要素数"
              min={0}
              max={32}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              size="xs"
              value={cellWidth}
              onChange={(e) => setCellWidth(Number(e))}
              label="要素の幅"
            />
            <Slider
              value={cellWidth}
              onChange={(value) => setCellWidth(value)}
              min={1}
              max={512}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              size="xs"
              value={cellHeight}
              onChange={(e) => setCellHeight(Number(e))}
              label="要素の高さ"
              min={0}
            />
            <Slider
              value={cellHeight}
              onChange={(value) => setCellHeight(value)}
              min={1}
              max={512}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              size="xs"
              value={spacing}
              onChange={(e) => setSpacing(Number(e))}
              label="余白 ←→"
            />
            <Slider
              value={spacing}
              onChange={(value) => setSpacing(value)}
              min={0}
              max={128}
            />
          </Grid.Col>
          <Grid.Col span={2.5}>
            <Button w="100%" onClick={handleDownload}>
              画像をダウンロード
            </Button>
          </Grid.Col>
        </Grid>
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              ...cellStyle,
            }}
          >
            <tbody>
              <tr>
                <th style={cellStyle}>
                  <VisualPropsView
                    props={baseVisual}
                    setProps={setBaseVisual}
                    fonts={fonts}
                    required
                  />
                </th>
                {Array.from({ length: col }, (_, colIndex) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: no id
                  <th key={colIndex} style={cellStyle}>
                    <VisualPropsView
                      props={colVisuals[colIndex]}
                      setProps={setColVisual[colIndex]}
                      withParentVisualProps={withBaseVisual}
                      fonts={fonts}
                    />
                  </th>
                ))}
              </tr>
              {Array.from({ length: row }, (_, rowIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: no id
                <tr key={rowIndex}>
                  <th style={cellStyle}>
                    <VisualPropsView
                      props={rowVisuals[rowIndex]}
                      setProps={setRowVisual[rowIndex]}
                      withParentVisualProps={withBaseVisual}
                      fonts={fonts}
                    />
                    <RowActions
                      onInsertRow={() => insertRow(rowIndex)}
                      onDeleteRow={() => deleteRow(rowIndex)}
                    />
                  </th>
                  {Array.from({ length: col }, (_, colIndex) => {
                    const cell = cells[rowIndex]?.[colIndex];

                    return (
                      <DroppableCell
                        // biome-ignore lint/suspicious/noArrayIndexKey: no id
                        key={colIndex}
                        row={rowIndex}
                        col={colIndex}
                        style={cellStyle}
                      >
                        <CellPropsView
                          props={cell}
                          setProps={setCell[rowIndex][colIndex]}
                          withParentVisualProps={
                            withRowColVisuals[rowIndex][colIndex]
                          }
                          fonts={fonts}
                          row={rowIndex}
                          col={colIndex}
                        />
                      </DroppableCell>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </DndContext>
      </Stack>
      <div
        style={{
          marginTop: ".5em",
          paddingTop: ".5em",
          textAlign: "center",
          backgroundImage: `repeating-conic-gradient(from 0deg,
		#ffffff 0deg 90deg,
		#cccccc 90deg 180deg`,
          backgroundSize: "30px 30px",
          backgroundColor: "#fff",
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <canvas
          ref={targetRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ maxWidth: "100%" }}
        />
      </div>
      <Stack align="center" mt="xs">
        <Dropzone
          onDrop={(files) => {
            const file = files[0];
            if (file) {
              setFile(file);
            }
          }}
        >
          <Stack align="center">
            <Text>ここに画像をドロップ</Text>
            <Text size="xs" ta="center">
              このツールで生成した画像をドラッグ&ドロップすると、データが読み込まれます。
            </Text>
          </Stack>
        </Dropzone>
      </Stack>
    </Container>
  );
}

export default App;
