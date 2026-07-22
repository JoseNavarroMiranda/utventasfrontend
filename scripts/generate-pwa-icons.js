import { writeFileSync } from 'fs'
import { deflateSync } from 'zlib'

function createPNG(width, height, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  const ihdrChunk = makeChunk('IHDR', ihdr)

  const raw = Buffer.alloc(height * (width * 3 + 1))
  const radius = width * 0.22
  const cx = width / 2
  const cy = height / 2
  for (let y = 0; y < height; y++) {
    const row = y * (width * 3 + 1)
    raw[row] = 0
    for (let x = 0; x < width; x++) {
      const dx = x < cx ? cx - x - (width / 2 - radius) : x - cx - (width / 2 - radius)
      const dy = y < cy ? cy - y - (height / 2 - radius) : y - cy - (height / 2 - radius)
      const dist = Math.sqrt(Math.max(0, dx) ** 2 + Math.max(0, dy) ** 2)
      const outside = x < radius && y < radius ? dist > radius
        : x >= width - radius && y < radius ? dist > radius
        : x < radius && y >= height - radius ? dist > radius
        : x >= width - radius && y >= height - radius ? dist > radius
        : false

      const offset = row + 1 + x * 3
      if (outside) {
        raw[offset] = 15
        raw[offset + 1] = 23
        raw[offset + 2] = 42
      } else {
        raw[offset] = r
        raw[offset + 1] = g
        raw[offset + 2] = b
      }
    }
  }

  const compressed = deflateSync(raw)
  const idatChunk = makeChunk('IDAT', compressed)
  const iendChunk = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk])
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeB = Buffer.from(type, 'ascii')
  const crcData = Buffer.concat([typeB, data])
  const crc = crc32(crcData)
  const crcB = Buffer.alloc(4)
  crcB.writeUInt32BE(crc, 0)
  return Buffer.concat([len, typeB, data, crcB])
}

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

const icon192 = createPNG(192, 192, 34, 211, 238)
const icon512 = createPNG(512, 512, 34, 211, 238)
const iconMaskable192 = createPNG(192, 192, 30, 41, 59)
const iconMaskable512 = createPNG(512, 512, 30, 41, 59)

writeFileSync('public/pwa-icon-192.png', icon192)
writeFileSync('public/pwa-icon-512.png', icon512)
writeFileSync('public/pwa-icon-maskable-192.png', iconMaskable192)
writeFileSync('public/pwa-icon-maskable-512.png', iconMaskable512)

console.log('PWA icons generated successfully')
