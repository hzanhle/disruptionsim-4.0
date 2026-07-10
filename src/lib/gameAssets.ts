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

export function requireAsset(relativePath: string): string {
  const url = assetUrl(relativePath)
  if (!url) {
    console.warn(`[assets] Missing: ${relativePath}`)
    return ''
  }
  return url
}

export const branding = {
  logo: () => assetUrl('branding/logo-disruptionsim.png'),
  smartGarment: () => assetUrl('branding/logo-smartgarment.png'),
  heroFactory: () => assetUrl('branding/hero-factory.png'),
  heroIndustry: () => assetUrl('branding/hero-industry-40.png'),
  bgPattern: () => assetUrl('branding/bg-pattern.png'),
}

export const concepts = {
  llsx: () => assetUrl('concepts/llsx-infographic.png'),
  qhsx: () => assetUrl('concepts/qhsx-infographic.png'),
  budget: () => assetUrl('concepts/budget-infographic.png'),
  balance: () => assetUrl('concepts/balance-diagram.png'),
  warning: () => assetUrl('concepts/warning-diagram.png'),
  breakdown: () => assetUrl('concepts/breakdown-diagram.png'),
  settlement: () => assetUrl('concepts/settlement-diagram.png'),
  endingsOverview: () => assetUrl('concepts/endings-overview.png'),
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
  type: 'sustainable_modernization' | 'technology_breakdown' | 'economic_lag',
): string | undefined {
  const map = {
    sustainable_modernization: 'endings/sustainable-modernization.png',
    technology_breakdown: 'endings/technology-breakdown.png',
    economic_lag: 'endings/economic-lag.png',
  } as const
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

export function deltaBadgeUrl(delta: number): string | undefined {
  if (delta >= 3) return assetUrl('ui/delta-breakdown.png')
  if (delta === 2) return assetUrl('ui/delta-warning.png')
  if (delta === 0) return assetUrl('ui/delta-balanced.png')
  return assetUrl('ui/delta-warning.png')
}

export function budgetBadgeUrl(budget: number): string | undefined {
  if (budget <= 0) return assetUrl('ui/budget-danger.png')
  if (budget <= 20) return assetUrl('ui/budget-tight.png')
  return assetUrl('ui/budget-healthy.png')
}

export function monthCharacterUrl(month: number): string | undefined {
  const map: Record<number, string> = {
    2: 'characters/eu-inspector.png',
    3: 'characters/robot-salesman.png',
    5: 'characters/government-official.png',
    7: 'characters/fie-executive.png',
    8: 'characters/international-buyer.png',
  }
  return assetUrl(map[month] ?? 'characters/player-director.png')
}

export function deltaConceptUrl(delta: number): string | undefined {
  if (delta >= 3) return concepts.breakdown()
  if (delta === 2) return concepts.warning()
  return concepts.balance()
}
