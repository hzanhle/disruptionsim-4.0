/**
 * Visual audit — captures each major screen for UX review.
 * Run: node scripts/audit-screens.mjs
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '..', 'tmp-audit')
const BASE = 'http://localhost:5173'

fs.mkdirSync(OUT, { recursive: true })

const persistedPlaying = {
  state: {
    schemaVersion: 1,
    gameStatus: 'playing',
    currentMonth: 2,
    budget: 75,
    llsx: 2,
    qhsx: 1,
    history: [
      {
        month: 1,
        eventId: 'month-1',
        eventTitle: 'Khởi động làn sóng 4.0',
        selectedChoiceId: 'month-1-a',
        selectedChoiceTitle: 'Chạy theo công nghệ',
        eventMessage: 'Dây chuyền AI giúp tăng năng suất vượt trội!',
        before: { budget: 100, llsx: 1, qhsx: 1 },
        directEffects: { budget: -30, llsx: 1, qhsx: 0 },
        settlement: {
          baseRevenue: 50,
          revenueAdjustment: 0,
          operatingCost: 10,
          imbalancePenalty: 0,
          eventBudgetAdjustment: -30,
          monthlyNet: 10,
          imbalanceWarning: null,
        },
        after: { budget: 80, llsx: 2, qhsx: 1, delta: 1 },
        endingTriggered: null,
      },
    ],
    currentResolution: null,
    pendingChoiceId: null,
    choiceLocked: false,
    ending: null,
    soundEnabled: false,
  },
  version: 0,
}

const persistedReport = {
  state: {
    ...persistedPlaying.state,
    gameStatus: 'report',
    currentMonth: 2,
    budget: 80,
    llsx: 2,
    qhsx: 2,
    currentResolution: {
      month: 2,
      eventId: 'month-2',
      eventTitle: 'Áp lực từ Hội nhập Quốc tế (EVFTA)',
      selectedChoiceId: 'month-2-a',
      selectedChoiceTitle: 'Đáp ứng tiêu chuẩn lao động',
      eventMessage: 'Nhà máy đáp ứng tiêu chuẩn lao động quốc tế.',
      before: { budget: 100, llsx: 2, qhsx: 1 },
      directEffects: { budget: -25, llsx: 0, qhsx: 1 },
      specialBudgetChange: 0,
      specialMessage: null,
      revenueAdjustment: 0,
      revenueAdjustmentMessage: null,
      settlement: {
        baseRevenue: 50,
        revenueAdjustment: 0,
        operatingCost: 20,
        imbalancePenalty: 0,
        eventBudgetAdjustment: -25,
        monthlyNet: 5,
        imbalanceWarning: null,
      },
      after: { budget: 80, llsx: 2, qhsx: 2, delta: 0 },
      endingTriggered: null,
      endingReason: null,
    },
  },
  version: 0,
}

const persistedEnding = {
  state: {
    ...persistedPlaying.state,
    gameStatus: 'ended',
    budget: 120,
    llsx: 5,
    qhsx: 5,
    ending: {
      type: 'sustainable_modernization',
      message: 'SmartGarment đạt CNH-HĐH bền vững.',
      reason: 'Đạt đủ điều kiện thắng sau tháng 10.',
    },
    currentResolution: null,
  },
  version: 0,
}

async function ready(page) {
  await page.waitForFunction(
    () => !document.body.innerText.includes('Đang tải tiến trình'),
    { timeout: 8000 },
  )
  await page.waitForTimeout(300)
}

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  console.log('saved', file)
}

async function openWithSave(context, data) {
  const page = await context.newPage()
  await page.addInitScript((payload) => {
    localStorage.setItem('disruptionsim4-game-v1', JSON.stringify(payload))
  }, data)
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await ready(page)
  return page
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  })

  // Landing
  {
    const page = await context.newPage()
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await ready(page)
    await shot(page, '01-landing')
    await page.getByRole('button', { name: /Hướng dẫn/ }).click()
    await page.getByRole('heading', { name: /Hướng dẫn/ }).waitFor()
    await shot(page, '02-tutorial')
    await page.getByRole('button', { name: /Quay lại/ }).click()
    await page.getByRole('button', { name: /Bắt đầu trò chơi/ }).first().click()
    const wipe = page.getByRole('button', { name: /Xóa và bắt đầu mới/ })
    if (await wipe.isVisible().catch(() => false)) await wipe.click()
    await page.getByText('Khởi động làn sóng 4.0').waitFor({ timeout: 5000 })
    await shot(page, '03-dashboard-month1')
    await page.close()
  }

  // Dashboard month 2
  {
    const page = await openWithSave(context, persistedPlaying)
    const cont = page.getByRole('button', { name: /Tiếp tục trò chơi/ })
    if (await cont.isVisible().catch(() => false)) await cont.click()
    await page.getByText('Áp lực từ Hội nhập').waitFor({ timeout: 5000 })
    await shot(page, '04-dashboard-month2')
    await page.close()
  }

  // Report
  {
    const page = await openWithSave(context, persistedReport)
    const cont = page.getByRole('button', { name: /Tiếp tục trò chơi/ })
    if (await cont.isVisible().catch(() => false)) await cont.click()
    await page.getByText('Báo cáo tháng').waitFor({ timeout: 5000 })
    await shot(page, '05-report')
    await page.close()
  }

  // Ending
  {
    const page = await openWithSave(context, persistedEnding)
    const cont = page.getByRole('button', { name: /Tiếp tục trò chơi/ })
    if (await cont.isVisible().catch(() => false)) await cont.click()
    await page.getByRole('heading', { name: 'CNH-HĐH Bền vững' }).waitFor({ timeout: 5000 })
    await shot(page, '06-ending')
    await page.close()
  }

  await browser.close()
  console.log('Audit complete →', OUT)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
