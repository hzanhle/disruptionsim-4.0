import fs from 'node:fs'
import path from 'node:path'

const videos = [
  {
    name: 'victory.mp4',
    url: 'https://cdn.pixabay.com/video/2021/04/12/70868-536477810_large.mp4',
    fallback: 'https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-operator-at-work-41551-large.mp4'
  },
  {
    name: 'breakdown.mp4',
    url: 'https://cdn.pixabay.com/video/2020/05/25/40149-425114771_large.mp4',
    fallback: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-laser-cutting-fabric-41549-large.mp4'
  },
  {
    name: 'economic_lag.mp4',
    url: 'https://cdn.pixabay.com/video/2019/04/23/23011-332306282_large.mp4',
    fallback: 'https://assets.mixkit.co/videos/preview/mixkit-empty-factory-floor-at-sunset-41550-large.mp4'
  }
]

const targetDir = path.join(process.cwd(), 'public', 'videos')
fs.mkdirSync(targetDir, { recursive: true })

async function download() {
  console.log('Downloading real-life short video clips for endings...')
  for (const item of videos) {
    const dest = path.join(targetDir, item.name)
    try {
      console.log(`Fetching ${item.name}...`)
      let res = await fetch(item.url)
      if (!res.ok) {
        console.log(`Primary URL failed (${res.status}), trying fallback for ${item.name}...`)
        res = await fetch(item.fallback)
      }
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer())
        fs.writeFileSync(dest, buffer)
        console.log(`Saved ${item.name} (${buffer.length} bytes)`)
      } else {
        console.error(`Failed to download ${item.name}`)
      }
    } catch (err) {
      console.error(`Error downloading ${item.name}:`, err.message)
    }
  }
}

download()
