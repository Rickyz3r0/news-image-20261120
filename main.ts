import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576;
const MAX_DIMENSION = 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_IEND = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);

function assertValidPng(bytes: Buffer): { width: number; height: number } {
  if (bytes.length < 33 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('entry.png does not carry a valid PNG signature');
  }
  if (!bytes.subarray(bytes.length - 12).equals(PNG_IEND)) {
    throw new Error('entry.png does not terminate with a valid PNG IEND chunk');
  }
  if (bytes.length > MAX_BYTES) {
    throw new Error(`entry.png exceeds 1 MiB limit (${bytes.length} bytes)`);
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width < 1 || height < 1 || width > MAX_DIMENSION || height > MAX_DIMENSION) {
    throw new Error(`entry.png dimensions ${width}x${height} exceed ${MAX_DIMENSION}x${MAX_DIMENSION}`);
  }
  return { width, height };
}

function main(): void {
  const rootDir = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(rootDir, 'entry.png');
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const targetPath = join(outputDir, 'entry.png');

  const pngBytes = readFileSync(sourcePath);
  assertValidPng(pngBytes);

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(targetPath, pngBytes);
}

main();
