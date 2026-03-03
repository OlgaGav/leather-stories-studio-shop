import path from "path";
import TextToSVG from "text-to-svg";

import svgDeserializerPkg from "@jscad/svg-deserializer";
import stlSerializerPkg from "@jscad/stl-serializer";
import jscadModeling from "@jscad/modeling";

const { deserializer: svgDeserialize } = svgDeserializerPkg;
const { serialize } = stlSerializerPkg;

const { extrusions, booleans, transforms, primitives } = jscadModeling;
const { extrudeLinear } = extrusions;
const { union } = booleans;
const { translate } = transforms;
const { cuboid } = primitives;

export function generateStampSTL({
  text = "ОЛЕГ",
  fontFile = path.join(process.cwd(), "server/assets/fonts/Roboto-Regular.ttf"),
  fontSize = 22,
  raised = 2.2,
  baseThickness = 3.5,
  padding = 6,
} = {}) {

  const textToSVG = TextToSVG.loadSync(fontFile);
  const svgPath = textToSVG.getD(text, { fontSize, anchor: "top" });

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg">
      <path d="${svgPath}" />
    </svg>
  `;

  const shapes = svgDeserialize({ output: "geom2" }, svg);

  const text2D = union(shapes);
  const text3D = extrudeLinear({ height: raised }, text2D);

  const approxWidth = Math.max(30, text.length * fontSize * 0.7) + padding * 2;
  const approxDepth = fontSize * 1.4 + padding * 2;

  const base = cuboid({ size: [approxWidth, approxDepth, baseThickness] });
  const placedText = translate([padding, padding, baseThickness], text3D);

  const stamp = union(base, placedText);

  const stl = serialize({ binary: true }, stamp)[0];

  return Buffer.from(stl);
}