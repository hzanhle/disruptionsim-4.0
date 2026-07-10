/**
 * DISRUPTIONSIM 4.0 — Asset Generator (Pollinations AI)
 *
 * Miễn phí, không cần Google API Key.
 * Engine: https://image.pollinations.ai
 *
 * Usage:
 *   node generate-assets.js
 *   node generate-assets.js --limit=2
 *   node generate-assets.js --force
 *   node generate-assets.js --start=10
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = __dirname
const PROMPTS_FILE = path.join(ROOT, 'prompts.json')
const OUTPUT_ROOT = path.join(ROOT, 'assets')
const DELAY_MS = 2000

const MASTER_STYLE =
  'Style: semi-flat isometric illustration, clean vector-like edges, educational game art, modern Industry 4.0 aesthetic, Vietnamese export garment factory setting, dark slate background (#0f172a), cyan tech accents (#22d3ee), violet management accents (#a78bfa), emerald success (#34d399), amber warning (#fbbf24), red danger (#f87171), soft ambient lighting, no photorealism, no 3D render look, no anime, professional edutainment mood, high readability at small sizes.'

const NEGATIVE_PROMPT =
  'text, watermark, logo text, letters, numbers, UI mockup, blurry, low quality, photorealistic, photograph, cluttered, messy, western-only setting without Asian context, cartoon chibi, anime, gore, violence, blood, scary horror, copyrighted characters, stock photo look, lens flare overload, oversaturated neon'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function parseArgs(argv) {
  const options = { force: false, start: 0, limit: Infinity }
  for (const arg of argv) {
    if (arg === '--force') options.force = true
    else if (arg.startsWith('--start=')) options.start = Number(arg.slice(8))
    else if (arg.startsWith('--limit=')) options.limit = Number(arg.slice(8))
  }
  return options
}

function sizeFromRatio(ratio) {
  switch (ratio) {
    case '16:9':
      return { width: 1024, height: 576 }
    case '4:3':
      return { width: 1024, height: 768 }
    case '3:4':
      return { width: 768, height: 1024 }
    case '9:16':
      return { width: 576, height: 1024 }
    case '1:1':
    default:
      return { width: 1024, height: 1024 }
  }
}

function resolveOutputPath(relativePath) {
  // Pollinations thường trả JPEG/PNG — đổi .webp → .png để Vite serve đúng
  const normalized = relativePath.replace(/\\/g, '/').replace(/\.webp$/i, '.png')
  return {
    relative: normalized,
    absolute: path.join(OUTPUT_ROOT, normalized),
  }
}

function buildApiUrl(fullPrompt, width, height, seed) {
  const encoded = encodeURIComponent(fullPrompt)
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&model=flux&nologo=true&enhance=true&seed=${seed}`
}

async function generateAssets() {
  const options = parseArgs(process.argv.slice(2))

  if (!fs.existsSync(PROMPTS_FILE)) {
    console.error('❌ Không tìm thấy file prompts.json ở thư mục gốc!')
    process.exit(1)
  }

  const promptList = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'))
  if (!Array.isArray(promptList) || promptList.length === 0) {
    console.error('❌ prompts.json rỗng hoặc không hợp lệ.')
    process.exit(1)
  }

  const start = Math.max(0, options.start || 0)
  const end = Math.min(
    promptList.length,
    start + (Number.isFinite(options.limit) ? options.limit : promptList.length),
  )
  const queue = promptList.slice(start, end)

  console.log('===================================================')
  console.log(' 🚀 DISRUPTIONSIM 4.0 — Asset Generator (Pollinations)')
  console.log('===================================================')
  console.log(' LƯU Ý: Miễn phí, không cần API Key.')
  console.log(` Queue  : ${queue.length} ảnh (index ${start} → ${end - 1})`)
  console.log(` Output : ${OUTPUT_ROOT}`)
  console.log(` Delay  : ${DELAY_MS}ms`)
  console.log('===================================================\n')

  let success = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i]
    const currentIdx = start + i + 1
    const { width, height } = sizeFromRatio(item.Ratio)
    const { relative, absolute } = resolveOutputPath(item.Path)

    console.log(
      `[ĐANG XỬ LÝ] [${currentIdx}/${promptList.length}] -> ${relative} (${item.Ratio} -> ${width}x${height})`,
    )

    if (!options.force && fs.existsSync(absolute)) {
      console.log(`[BỎ QUA] Đã tồn tại: assets/${relative}\n`)
      skipped += 1
      continue
    }

    try {
      const fullPrompt = `${MASTER_STYLE} Subject: ${item.Prompt}. Negative context to avoid: ${NEGATIVE_PROMPT}`
      const seed = Math.floor(Math.random() * 99999)
      const apiUrl = buildApiUrl(fullPrompt, width, height, seed)

      const response = await fetch(apiUrl, {
        headers: {
          // Một số CDN yêu cầu UA hợp lệ
          'User-Agent': 'DISRUPTIONSIM-AssetGenerator/1.0',
        },
      })

      if (!response.ok) {
        failed += 1
        console.error(
          `❌ [LỖI] HTTP ${response.status} cho file: ${relative}\n`,
        )
      } else {
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        if (buffer.length < 1000) {
          // Thường là HTML/error page thay vì ảnh thật
          failed += 1
          console.error(
            `❌ [LỖI] Response quá nhỏ (${buffer.length} bytes) — có thể không phải ảnh: ${relative}\n`,
          )
        } else {
          fs.mkdirSync(path.dirname(absolute), { recursive: true })
          fs.writeFileSync(absolute, buffer)
          console.log(
            `✅ [THÀNH CÔNG] Đã tải về: assets/${relative} (${buffer.length} bytes)\n`,
          )
          success += 1
        }
      }
    } catch (error) {
      failed += 1
      console.error(
        `💥 [LỖI HỆ THỐNG] Không thể tải file ${relative}:`,
        error instanceof Error ? error.message : error,
        '\n',
      )
    }

    if (i < queue.length - 1) {
      console.log(`[CHỜ] Nghỉ ${DELAY_MS}ms...\n`)
      await delay(DELAY_MS)
    }
  }

  console.log('═══════════════════════════════════════════════════')
  console.log(
    `🎉 Xong — Thành công: ${success} | Bỏ qua: ${skipped} | Lỗi: ${failed}`,
  )
  console.log('═══════════════════════════════════════════════════')

  if (failed > 0) process.exitCode = 1
}

generateAssets().catch((error) => {
  console.error('💥 [LỖI FATAL]', error)
  process.exit(1)
})
