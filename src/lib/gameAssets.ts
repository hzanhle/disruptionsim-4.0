import type { EndingType } from '@/types/game'

/**
 * Game art registry — loads files from /assets via Vite.
 * Paths are relative to the assets/ folder, e.g. "events/month-01.png".
 */

const modules = import.meta.glob('../../assets/**/*.{png,webp,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const byRelativePath: Record<string, string> = {}

for (const [key, url] of Object.entries(modules)) {
  const normalized = key.replace(/\\/g, '/')
  const marker = '/assets/'
  const idx = normalized.lastIndexOf(marker)
  if (idx === -1) continue
  const relative = normalized.slice(idx + marker.length)
  byRelativePath[relative] = url
}

/** Resolve an asset URL. Accepts .webp paths even if files were saved as .png. */
export function assetUrl(relativePath: string): string | undefined {
  const path = relativePath.replace(/\\/g, '/').replace(/^\//, '')
  return (
    byRelativePath[path] ??
    byRelativePath[path.replace(/\.webp$/i, '.png')] ??
    byRelativePath[path.replace(/\.png$/i, '.webp')]
  )
}

export const branding = {
  logo: () => assetUrl('branding/logo-disruptionsim.png'),
  heroFactory: () => assetUrl('branding/hero-factory.png'),
  heroIndustry: () => assetUrl('branding/hero-industry-40.png'),
  bgPattern: () => assetUrl('branding/bg-pattern.png'),
}

export const concepts = {
  llsx: () => assetUrl('concepts/llsx-infographic.png'),
  qhsx: () => assetUrl('concepts/qhsx-infographic.png'),
  budget: () => assetUrl('concepts/budget-infographic.png'),
  balance: () => assetUrl('concepts/balance-diagram.png'),
  settlement: () => assetUrl('concepts/settlement-diagram.png'),
  endingsOverview: () => assetUrl('concepts/endings-overview.png'),
}

export function characterUrl(characterId: string): string | undefined {
  return assetUrl(`characters/${characterId}.png`)
}

export const characters = {
  director: () => characterUrl('player-director'),
  official: () => characterUrl('government-official'),
  inspector: () => characterUrl('eu-inspector'),
  salesman: () => characterUrl('robot-salesman'),
  fie: () => characterUrl('fie-executive'),
  buyer: () => characterUrl('international-buyer'),
}

export function eventSceneUrl(month: number): string | undefined {
  const padded = String(month).padStart(2, '0')
  return assetUrl(`events/month-${padded}.png`)
}

export function choiceImageUrl(choiceId: string): string | undefined {
  // choiceId: "month-1-a" → "choices/month-01-a.png"
  const match = choiceId.match(/^month-(\d+)-([a-z])$/i)
  if (!match) return assetUrl(`choices/${choiceId}.png`)
  const month = match[1].padStart(2, '0')
  const letter = match[2].toLowerCase()
  return assetUrl(`choices/month-${month}-${letter}.png`)
}

export function endingImageUrl(
  type: EndingType,
): string | undefined {
  const map: Record<EndingType, string> = {
    sustainable_modernization: 'endings/sustainable-modernization.png',
    technology_breakdown: 'endings/technology-breakdown.png',
    economic_lag: 'endings/economic-lag.png',
    esg_utopia: 'endings/sustainable-modernization.png',
  }
  return assetUrl(map[type])
}

export function factoryVisualUrl(input: {
  budget: number
  llsx: number
  qhsx: number
  delta: number
  isVictory?: boolean
}): string | undefined {
  if (input.isVictory) return assetUrl('factory/state-victory.png')
  if (input.budget <= 0) return assetUrl('factory/state-bankrupt.png')
  if (input.delta >= 3) return assetUrl('factory/state-breakdown.png')
  if (input.delta === 2) return assetUrl('factory/state-warning.png')

  const level = Math.max(input.llsx, input.qhsx)
  if (level >= 4) return assetUrl('factory/stage-smart.png')
  if (level >= 2) return assetUrl('factory/stage-modernizing.png')
  return assetUrl('factory/stage-early.png')
}

