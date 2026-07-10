# DISRUPTIONSIM 4.0

DISRUPTIONSIM 4.0 là trò chơi mô phỏng giáo dục triết học kinh tế chính trị Mác — Lênin, mô phỏng hành trình công nghiệp hóa, hiện đại hóa (CNH-HĐH) và chuyển đổi số của nhà máy may xuất khẩu **SmartGarment Việt Nam**.

Người chơi cân bằng **LLSX (Lực lượng sản xuất)** và **QHSX (Quan hệ sản xuất)** trong 10 tháng sản xuất, với bài học cốt lõi:

> Quan hệ sản xuất phải phù hợp với trình độ phát triển của lực lượng sản xuất.

## Công nghệ

| Mục đích | Công nghệ |
| -------- | --------- |
| Framework | React + Vite |
| Ngôn ngữ | TypeScript |
| Styling | Tailwind CSS |
| UI | shadcn/ui (Radix + CVA) |
| Icons | Lucide React |
| Animation | Framer Motion |
| Charts | Recharts |
| State | Zustand |
| Sound | howler.js |
| Triển khai | Vercel (static) |

## Cài đặt cục bộ

```bash
npm install
npm run generate:sounds   # tạo file WAV cục bộ (chạy lần đầu hoặc khi thiếu âm thanh)
npm run dev
```

Mở trình duyệt tại địa chỉ Vite hiển thị (mặc định `http://localhost:5173`).

## Scripts

| Script | Mô tả |
| ------ | ----- |
| `npm run dev` | Chạy server phát triển |
| `npm run build` | Build production (`dist/`) |
| `npm run preview` | Xem trước bản build |
| `npm run typecheck` | Kiểm tra TypeScript |
| `npm run lint` | Chạy oxlint |
| `npm run test` | Chạy Vitest |
| `npm run generate:sounds` | Sinh hiệu ứng âm thanh WAV |

## Quy tắc trò chơi

### Chỉ số ban đầu

- **Ngân sách:** $100
- **LLSX:** 1
- **QHSX:** 1
- **Delta:** LLSX − QHSX

### Quyết toán hàng tháng

Sau khi áp dụng hiệu ứng sự kiện của tháng:

- Doanh thu cơ bản = LLSX × $25
- Chi phí vận hành = QHSX × $10
- Phạt mất cân bằng = $15 khi delta = 2
- Delta ≥ 3 → **Đứt gãy công nghệ** (kết thúc ngay, không quyết toán tiếp)

```
monthlyNet = baseRevenue + revenueAdjustments - operatingCost - imbalancePenalty + eventBudgetAdjustments
```

### Thứ tự xử lý lượt

1. Hiển thị ngữ cảnh tháng
2. Người chơi chọn (hoặc sự kiện tự động)
3. Xác nhận lựa chọn (nếu có)
4. Áp dụng hiệu ứng trực tiếp
5. Áp dụng hệ quả đặc biệt (nếu có)
6. Kiểm tra delta ≥ 3
7. Kiểm tra ngân sách ≤ 0
8. Quyết toán tháng **một lần duy nhất**
9. Kiểm tra lại kết thúc
10. Lưu lịch sử và hiển thị báo cáo

### Ba kết cục

1. **Đứt gãy công nghệ** — delta ≥ 3
2. **Tụt hậu kinh tế** — ngân sách ≤ 0, hoặc sau tháng 10 không đạt điều kiện thắng
3. **CNH-HĐH bền vững** — sau tháng 10: ngân sách > 0, LLSX ≥ 4, QHSX ≥ 4, delta < 3

Ưu tiên kết thúc: Đứt gãy công nghệ → Phá sản → Chiến thắng → Tụt hậu kinh tế (fallback).

## Kiến trúc

```
src/
  app/App.tsx                 # Điều hướng màn hình
  components/game/            # Dashboard, sự kiện, báo cáo, kết thúc, biểu đồ
  components/layout/          # Landing, tutorial, header
  components/shared/          # Stat cards, delta, âm thanh
  components/ui/              # shadcn/ui primitives
  data/monthEvents.ts         # 10 tháng sự kiện (typed)
  lib/gameEngine.ts           # Pipeline xử lý lượt (pure functions)
  lib/gameCalculations.ts     # Công thức kinh tế
  lib/storageValidation.ts    # Xác thực localStorage
  lib/soundManager.ts         # howler.js
  store/gameStore.ts          # Zustand + persist
  types/game.ts               # Type definitions
  test/                       # Vitest
```

Logic nghiệp vụ nằm trong `gameEngine.ts` và `gameCalculations.ts`. UI không tự tính lại quy tắc trò chơi.

## localStorage

- **Key:** `disruptionsim4-game-v1`
- **Schema version:** 1
- Lưu: tháng hiện tại, chỉ số, lịch sử, trạng thái game, kết thúc, báo cáo đang mở, tùy chọn âm thanh
- Dữ liệu hỏng hoặc phiên bản không hỗ trợ → fallback an toàn + thông báo tiếng Việt

## Kiểm thử

```bash
npm run test
```

Bao gồm: trạng thái ban đầu, công thức tháng, tháng 2/4/6/8, kết thúc, ưu tiên đứt gãy, persistence.

## Build production

```bash
npm run build
```

Output: thư mục `dist/` — static site, không cần biến môi trường.

## Triển khai Vercel

1. Import repository GitHub vào Vercel
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Không cần serverless functions hay biến môi trường

Hoặc dùng CLI:

```bash
npm i -g vercel
vercel --prod
```

## Giả định quan trọng

1. Hiệu ứng sự kiện tháng được áp dụng **trước** quyết toán hàng tháng thông thường.
2. Đứt gãy công nghệ được kiểm tra **trước** phá sản khi cả hai xảy ra cùng lúc.
3. Tháng 4 và tháng 6 là sự kiện tự động (không có lựa chọn).
4. Tháng 10 chỉ thực hiện quyết toán cuối và đánh giá kết thúc — không có hiệu ứng ẩn thêm.
5. Mọi trạng thái sống sót sau tháng 10 nhưng không đạt điều kiện thắng → kết thúc **Tụt hậu kinh tế**.
6. Tháng 8 lựa chọn B được biểu diễn bằng `revenueAdjustment: -15`.
7. Mỗi tháng chỉ được quyết toán **một lần**.

## Giấy phép

Dự án giáo dục — sử dụng nội bộ/lớp học.
