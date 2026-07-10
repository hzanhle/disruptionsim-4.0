import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const md = fs.readFileSync(path.join(root, 'assets', 'GENERATION_PROMPTS.md'), 'utf8')

/** Default aspect ratio by top-level section heading */
const sectionDefaults = {
  '1.': '1:1',
  '2.': '1:1',
  '3.': '16:9',
  '4.': '16:9',
  '5.': '4:3',
  '6.': '16:9',
  '7.': '3:4',
  '8.': '1:1',
  '9.': '16:9',
}

const ratioMap = {
  '3:1': '16:9',
  '3:2': '4:3', // Imagen/Nano Banana không hỗ trợ 3:2
}

const headingPattern = /^##\s+(\d+)\.\s+/gm
const itemPattern =
  /###\s+(\d+)\.(\d+)\s+`([^`]+)`([\s\S]*?)(?=\n###\s+\d+\.\d+\s+`|\n##\s+\d+\.|\n## Checklist|$)/g

const items = []

for (const match of md.matchAll(itemPattern)) {
  const section = match[1]
  const filePath = match[3].trim()
  const body = match[4]

  const ratioMatch = body.match(/\*\*Tỷ lệ:\*\*\s*([^\s·]+)/)
  let ratio =
    ratioMatch?.[1]?.trim() ??
    sectionDefaults[`${section}.`] ??
    '1:1'

  if (ratioMap[ratio]) ratio = ratioMap[ratio]

  const promptMatch = body.match(/\*\*Prompt:\*\*\s*\n```\n([\s\S]*?)\n```/)
  if (!promptMatch) {
    console.warn(`Skip (no prompt): ${filePath}`)
    continue
  }

  const prompt = promptMatch[1].replace(/\s+/g, ' ').trim()
  items.push({
    Path: filePath,
    Ratio: ratio,
    Prompt: prompt,
  })
}

fs.writeFileSync(path.join(root, 'prompts.json'), JSON.stringify(items, null, 2) + '\n')
console.log(`Extracted ${items.length} prompts → prompts.json`)
console.log('Ratios:', [...new Set(items.map((i) => i.Ratio))])
