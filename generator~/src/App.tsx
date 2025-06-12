import {
  Alert,
  Button,
  Container,
  Grid,
  NumberInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState, useRef, useEffect, useMemo, useReducer } from "react";
import {
  defaultVisualProps,
  genWithParentVisualProps,
  stripVisualProps,
  type PartialVisualProps,
} from "./util/VisualProps";
import { useLocalStorage } from "@mantine/hooks";
import { useFonts } from "./util/fonts";
import { draw } from "./util/draw";
import type { CellProps } from "./util/CellProps";
import VisualPropsView from "./VisualPropsView";
import CellPropsView from "./CellPropsView";

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
  const [colVisuals, setColVisuals] = useState<PartialVisualProps[]>([]);
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
  const [rowVisuals, setRowVisuals] = useState<PartialVisualProps[]>([]);
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
  const [cells, setCells] = useState<CellProps[][]>([]);
  const setCell = useMemo(
    () =>
      Array.from({ length: row }).map((_, rowIndex) =>
        Array.from({ length: col }).map(
          (_, colIndex) => (props: PartialVisualProps) => {
            setCells((prev) => {
              const newCells = [...prev];
              if (!newCells[rowIndex]) {
                newCells[rowIndex] = [];
              }
              newCells[rowIndex][colIndex] = stripVisualProps({
                ...newCells[rowIndex][colIndex],
                ...props,
              });
              return newCells;
            });
          },
        ),
      ),
    [col, row],
  );
  const targetRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    const target = targetRef.current;
    if (!target) return;
    const link = document.createElement("a");
    link.href = target.toDataURL("image/png");
    link.download = `${"canvas"}.png`;
    link.click();
    link.remove();
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
            href="https://narazaka.booth.pm/items/6837074"
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
          <Grid.Col span={1.5}>
            <NumberInput
              size="xs"
              value={row}
              onChange={(e) => setRow(Number(e))}
              label="縦の要素数"
              min={0}
              max={32}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              size="xs"
              value={cellWidth}
              onChange={(e) => setCellWidth(Number(e))}
              label="要素の幅"
            />
          </Grid.Col>
          <Grid.Col span={1.5}>
            <NumberInput
              size="xs"
              value={cellHeight}
              onChange={(e) => setCellHeight(Number(e))}
              label="要素の高さ"
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              size="xs"
              value={spacing}
              onChange={(e) => setSpacing(Number(e))}
              label="余白 ←→"
            />
          </Grid.Col>
          <Grid.Col span={2.5}>
            <Button w="100%" onClick={handleDownload}>
              画像をダウンロード
            </Button>
          </Grid.Col>
        </Grid>
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
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <tr key={rowIndex}>
                <th style={cellStyle}>
                  <VisualPropsView
                    props={rowVisuals[rowIndex]}
                    setProps={setRowVisual[rowIndex]}
                    withParentVisualProps={withBaseVisual}
                    fonts={fonts}
                  />
                </th>
                {Array.from({ length: col }, (_, colIndex) => {
                  const cell = cells[rowIndex]?.[colIndex];

                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <td key={colIndex} style={cellStyle}>
                      <CellPropsView
                        props={cell}
                        setProps={setCell[rowIndex][colIndex]}
                        withParentVisualProps={
                          withRowColVisuals[rowIndex][colIndex]
                        }
                        fonts={fonts}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
    </Container>
  );
}

export default App;
