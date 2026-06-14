import fs from "fs";

const width = 256;
const height = 256;
const rowSize = Math.floor((width * 3 + 3) / 4) * 4;
const pixelArraySize = rowSize * height;
const fileSize = 54 + pixelArraySize;

const buffer = Buffer.alloc(fileSize);

// BMP Header
buffer.write("BM", 0);
buffer.writeUInt32LE(fileSize, 2);
buffer.writeUInt32LE(0, 6);
buffer.writeUInt32LE(54, 10);

// DIB Header
buffer.writeUInt32LE(40, 14);
buffer.writeInt32LE(width, 18);
buffer.writeInt32LE(height, 22); // positive for bottom-to-top
buffer.writeUInt16LE(1, 26); // planes
buffer.writeUInt16LE(24, 28); // bits per pixel
buffer.writeUInt32LE(0, 30); // compression
buffer.writeUInt32LE(pixelArraySize, 34);
buffer.writeInt32LE(2835, 38);
buffer.writeInt32LE(2835, 42);
buffer.writeUInt32LE(0, 46);
buffer.writeUInt32LE(0, 50);

// For primitiveUnits="objectBoundingBox", scale represents a fraction of the bounding box.
// We use a scale of 0.5 in SVG.
const k = -1;
const scale = 0.8;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const u = x / (width - 1);
    const v = (height - 1 - y) / (height - 1); // SVG top-down mapping

    const du = u - 0.5;
    const dv = v - 0.5;
    const r2 = du * du + dv * dv;

    // To bulge center, edge pixels must sample closer to center
    // u_src - u = du * (-k * r2)
    // We want R such that scale * (R - 0.5) = u_src - u
    let r = 0.5 + (du * (-k * r2)) / scale;
    let g = 0.5 + (dv * (-k * r2)) / scale;

    r = Math.max(0, Math.min(1, r));
    g = Math.max(0, Math.min(1, g));

    const R = Math.round(r * 255);
    const G = Math.round(g * 255);
    const B = 0;

    const offset = 54 + y * rowSize + x * 3;
    buffer[offset] = B;
    buffer[offset + 1] = G;
    buffer[offset + 2] = R;
  }
}

fs.writeFileSync("public/lens-map.bmp", buffer);
console.log("Created public/lens-map.bmp");