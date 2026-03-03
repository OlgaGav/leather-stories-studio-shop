// for Cyrillic, can't rely on JSCAD's built-in vectorText 
// TTF/OTF font → SVG path (Unicode/Cyrillic) → 2D geometry → extrude → STL
/**
* Recommended stack for Cyrillic text → STL
* 1) Text → SVG Path (Cyrillic supported)
* Use a font-based library that supports Unicode glyphs:
* text-to-svg (uses fonts, outputs SVG path)
* Or newer svg-text-to-path (converts SVG <text> into <path>)
* For a stamp generator, text-to-svg is usually the simplest because you feed it a .ttf file and get path data.
* 2) SVG → geometry → extrude → STL
* Use JSCAD’s SVG deserializer to convert SVG path into JSCAD geometry:
* Then extrude and export STL using @jscad/stl-serializer (we discussed earlier).
*/


const { text, geometries, extrusions, transforms, booleans, primitives } = require('@jscad/modeling');
const { serialize } = require('@jscad/stl-serializer');

const { vectorText } = text;
const { geom2, path2 } = geometries;
const { extrudeLinear } = extrusions;
const { translate } = transforms;
const { union } = booleans;
const { cuboid } = primitives;

/**
 * Minimal stamp: raised letters on a rectangular base.
 * Note: vectorText supports ASCII characters only. :contentReference[oaicite:5]{index=5}
 */
function generateStampSTL({
  label = 'WALLET',
  fontHeight = 18,       // visual size of letters (mm-ish)
  textThickness = 2,     // raised height (mm)
  baseThickness = 3,     // base plate thickness (mm)
  padding = 6,           // padding around text (mm)
} = {}) {
  // 1) vectorText -> segments (lines)
  const segments = vectorText({ height: fontHeight }, label); // :contentReference[oaicite:6]{index=6}

  // 2) Convert segments -> paths -> geom2 outlines
  // Each character is an array of polylines ("segments"); make each segment a path2
  const paths = segments
    .flat()
    .map(seg => path2.fromPoints({ close: false }, seg));

  // Turn open paths into a 2D geometry (approx outline union).
  // For a true filled outline you typically need closed paths; for simple “line stamp”
  // we can "thicken" by extruding rectangles along segments, but minimal example:
  // We'll instead approximate by converting each polyline to a thin rectangle stroke.
  const strokeWidth = Math.max(1, Math.round(fontHeight * 0.12));

  const strokes2D = paths.map(p => extrusions.expand({ delta: strokeWidth / 2, corners: 'round' }, p));
  const text2D = union(strokes2D);

  // 3) Extrude text to 3D
  const raisedText = extrudeLinear({ height: textThickness }, text2D);

  // 4) Base plate sized from bounding box of text
  const bounds = geom2.measureBoundingBox(text2D);
  const width = (bounds[1][0] - bounds[0][0]) + padding * 2;
  const depth = (bounds[1][1] - bounds[0][1]) + padding * 2;

  const base = cuboid({ size: [width, depth, baseThickness] });

  // 5) Center text on base, place text on top surface
  const textCenterX = (bounds[0][0] + bounds[1][0]) / 2;
  const textCenterY = (bounds[0][1] + bounds[1][1]) / 2;

  const placedText = translate(
    [width / 2 - textCenterX, depth / 2 - textCenterY, baseThickness],
    raisedText
  );

  const stamp = union(base, placedText);

  // 6) Serialize to STL (binary)
  const stlData = serialize({ binary: true }, stamp)[0]; // returns Uint8Array :contentReference[oaicite:7]{index=7}
  return Buffer.from(stlData);
}

module.exports = { generateStampSTL };