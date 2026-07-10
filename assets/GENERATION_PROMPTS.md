# DISRUPTIONSIM 4.0 — Image Generation Prompts

Tài liệu này chứa **1 prompt riêng cho từng ảnh** để gen bằng nano banana (hoặc bất kỳ AI image gen nào).

Sau khi gen xong, đặt file vào đúng thư mục và đúng tên file bên dưới. Mình sẽ gắn vào project theo mapping này.

---

## Quy ước chung

### Style Guide (áp dụng cho MỌI ảnh)

```
Style: semi-flat isometric illustration, clean vector-like edges, educational game art,
modern Industry 4.0 aesthetic, Vietnamese export garment factory setting,
dark slate background (#0f172a), cyan tech accents (#22d3ee), violet management accents (#a78bfa),
emerald success (#34d399), amber warning (#fbbf24), red danger (#f87171),
soft ambient lighting, no photorealism, no 3D render look, no anime,
professional edutainment mood, high readability at small sizes
```

### Negative Prompt (dùng chung cho tất cả)

```
text, watermark, logo text, letters, numbers, UI mockup, blurry, low quality,
photorealistic, photograph, cluttered, messy, western-only setting without Asian context,
cartoon chibi, anime, gore, violence, blood, scary horror, copyrighted characters,
stock photo look, lens flare overload, oversaturated neon
```

### Định dạng file

| Loại | Tỷ lệ | Kích thước đề xuất | Định dạng |
|------|-------|-------------------|-----------|
| Hero / Event / Ending / Factory | 16:9 | 1920×1080 | `.webp` hoặc `.png` |
| Choice thumbnail | 4:3 | 800×600 | `.webp` hoặc `.png` |
| Infographic / Icon | 1:1 | 1024×1024 | `.webp` hoặc `.png` |
| Character portrait | 3:4 | 768×1024 | `.webp` hoặc `.png` |
| UI badge | 1:1 | 512×512 | `.png` (nền trong suốt nếu có thể) |

### Cấu trúc thư mục

```
assets/
  branding/
  concepts/
  factory/
  events/
  choices/
  endings/
  characters/
  ui/
  reports/
```

---

## 1. Branding & Landing

### 1.1 `branding/logo-disruptionsim.png`
**Tỷ lệ:** 1:1 · **Dùng ở:** Landing header, favicon source

**Prompt:**
```
Game logo mark for "DISRUPTIONSIM 4.0", abstract smart garment factory symbol combined
with digital circuit lines and industry 4.0 nodes, semi-flat vector logo design,
cyan and violet gradient on dark slate background, centered composition,
iconic and minimal, no text letters, symbol only, crisp edges, app icon quality
```

---

### 1.2 `branding/logo-smartgarment.png`
**Tỷ lệ:** 3:1 · **Dùng ở:** Landing, dashboard header

**Prompt:**
```
Corporate logo emblem for a Vietnamese export garment company "SmartGarment",
stylized sewing needle merged with smart factory chip icon, semi-flat illustration,
elegant professional badge, cyan thread line motif, dark slate background,
horizontal logo mark, no readable text, symbol only, clean corporate game branding
```

---

### 1.3 `branding/hero-factory.webp`
**Tỷ lệ:** 16:9 · **Dùng ở:** Landing screen hero

**Prompt:**
```
Wide hero illustration of a modern Vietnamese garment export factory at dusk,
isometric semi-flat view, sewing floor with workers and automated cutting machines,
shipping containers and export trucks in background, subtle digital hologram overlays
showing IoT and AI, cinematic but not photorealistic, dark slate sky with cyan glow,
hopeful industrial modernization mood, spacious composition with room for UI text overlay
on the left third, educational strategy game art
```

---

### 1.4 `branding/bg-pattern.webp`
**Tỷ lệ:** 1:1 (tileable) · **Dùng ở:** Landing + dashboard background overlay

**Prompt:**
```
Seamless tileable industrial background pattern, subtle isometric grid with faint
circuit traces and sewing machine icons, very low contrast, dark slate and cyan lines,
minimal distraction, suitable as website background texture, repeatable tile, no focal object
```

---

### 1.5 `branding/hero-industry-40.webp`
**Tỷ lệ:** 16:9 · **Dùng ở:** Landing intro card

**Prompt:**
```
Illustration of Vietnam Industry 4.0 transformation in garment manufacturing,
split scene showing traditional sewing line evolving into smart factory with robots,
IoT sensors and data dashboards as holograms, semi-flat isometric style,
educational infographic mood, cyan technology highlights, dark background,
clear visual storytelling of digital transformation without text labels
```

---

## 2. Infographic khái niệm cốt lõi

### 2.1 `concepts/llsx-infographic.webp`
**Tỷ lệ:** 1:1 · **Dùng ở:** Stat card LLSX, tutorial

**Prompt:**
```
Educational infographic icon illustration representing "productive forces" in a garment factory,
robotic fabric cutter, AI camera inspection, automated conveyor, IoT sensor nodes,
laser cutting machine, technology and tools of production, semi-flat isometric,
cyan color theme, single centered concept cluster, dark slate background,
clear visual metaphor for technology level, no text
```

---

### 2.2 `concepts/qhsx-infographic.webp`
**Tỷ lệ:** 1:1 · **Dùng ở:** Stat card QHSX, tutorial

**Prompt:**
```
Educational infographic icon illustration representing "relations of production" in a factory,
skilled workers in training session, manager with clipboard, fair wage bonus envelope,
safety procedures board, team collaboration and labor relations, semi-flat isometric,
violet and soft purple color theme, dark slate background, human-centered composition,
clear visual metaphor for management and labor relations level, no text
```

---

### 2.3 `concepts/budget-infographic.webp`
**Tỷ lệ:** 1:1 · **Dùng ở:** Stat card Ngân sách, tutorial

**Prompt:**
```
Educational infographic illustration of factory cash flow and budget management,
coins and dollar bills flowing into and out of a small garment factory building,
green emerald positive flow arrows and red outgoing cost arrows, semi-flat isometric style,
financial health metaphor, dark slate background, clean and readable, no numbers or text
```

---

### 2.4 `concepts/balance-diagram.webp`
**Tỷ lệ:** 1:1 · **Dùng ở:** Tutorial, delta indicator (balanced state)

**Prompt:**
```
Educational balance scale diagram illustration, left side shows technology machines (LLSX),
right side shows workers and management (QHSX), perfectly balanced scale in center,
semi-flat isometric style, harmonious emerald glow, dark slate background,
visual metaphor for equilibrium between technology and labor relations, no text labels
```

---

### 2.5 `concepts/warning-diagram.webp`
**Tỷ lệ:** 1:1 · **Dùng ở:** Delta = 2 warning state

**Prompt:**
```
Educational warning diagram illustration, unbalanced scale tipping toward heavy technology side,
advanced machines overwhelming confused workers on the lighter side, amber warning glow,
semi-flat isometric style, operational risk mood, dark slate background,
visual metaphor for technology outpacing human capability, no text
```

---

### 2.6 `concepts/breakdown-diagram.webp`
**Tỷ lệ:** 1:1 · **Dùng ở:** Delta ≥ 3 danger state

**Prompt:**
```
Educational crisis diagram illustration, technology breakdown in garment factory,
malfunctioning AI cutting machine producing damaged fabric rolls, workers panicking,
red danger accents, broken digital screen sparks as stylized icons not realistic fire,
semi-flat isometric, dark slate background, clear "technological fracture" metaphor, no text
```

---

### 2.7 `concepts/settlement-diagram.webp`
**Tỷ lệ:** 3:2 · **Dùng ở:** Tutorial quyết toán tháng

**Prompt:**
```
Educational flowchart-style illustration of monthly factory settlement without readable text,
three visual blocks connected by arrows: revenue from production output, operating costs
from management, and penalty from imbalance, semi-flat isometric infographic,
cyan and emerald accents, dark slate background, clean left-to-right flow, icon-based only
```

---

### 2.8 `concepts/endings-overview.webp`
**Tỷ lệ:** 16:9 · **Dùng ở:** Tutorial — 3 kết cục

**Prompt:**
```
Triptych illustration showing three factory outcomes side by side in one image,
left: thriving green smart factory (success), center: broken machines and chaos (tech breakdown),
right: closed dark factory gate and empty yard (economic lag), semi-flat isometric,
educational comparison layout, consistent style across three panels, dark slate background, no text
```

---

## 3. Nhà máy theo giai đoạn & trạng thái

### 3.1 `factory/stage-early.webp`
**Tỷ lệ:** 16:9 · **Dùng ở:** Dashboard — LLSX/QHSX thấp (tháng 1–3)

**Prompt:**
```
Isometric semi-flat illustration of a basic traditional Vietnamese garment workshop,
old sewing machines, manual fabric cutting tables, small team of workers,
modest factory building, low technology level, warm but dated equipment,
dark slate environment, subtle cyan hints of future upgrade, humble starting phase mood
```

---

### 3.2 `factory/stage-modernizing.webp`
**Tỷ lệ:** 16:9 · **Dùng ở:** Dashboard — trung bình (tháng 4–7)

**Prompt:**
```
Isometric semi-flat illustration of a garment factory in modernization transition,
mix of traditional sewing stations and new automated cutting line being installed,
workers learning new machines, ERP dashboard screen on wall, balanced activity,
cyan technology accents growing, dark slate background, mid-game progress mood
```

---

### 3.3 `factory/stage-smart.webp`
**Tỷ lệ:** 16:9 · **Dùng ở:** Dashboard — cao (tháng 8–10)

**Prompt:**
```
Isometric semi-flat illustration of a fully modern smart garment factory,
robotic arms, AI quality inspection cameras, IoT energy sensors, digital twin hologram,
efficient worker teams in harmony with automation, emerald and cyan glow,
high technology level, dark slate background, advanced Industry 4.0 mood
```

---

### 3.4 `factory/state-warning.webp`
**Tỷ lệ:** 16:9 · **Dùng ở:** Factory status — delta = 2

**Prompt:**
```
Isometric semi-flat illustration of garment factory under operational stress warning,
fast running automated machines while workers look confused and overwhelmed,
amber warning lights as simple icons, fabric pile mistakes visible,
imbalance between machine speed and human skill, dark slate background, tense but not catastrophic
```

---

### 3.5 `factory/state-breakdown.webp`
**Tỷ lệ:** 16:9 · **Dùng ở:** Factory status — delta ≥ 3

**Prompt:**
```
Isometric semi-flat illustration of technological breakdown in garment factory,
AI cutter jammed with tangled fabric, error screens flashing red, production line stopped,
workers unable to operate advanced machines, red danger accents, chaotic but stylized,
dark slate background, critical failure mood, educational game art not horror
```

---

### 3.6 `factory/state-bankrupt.webp`
**Tỷ lệ:** 16:9 · **Dùng ở:** Factory status — budget ≤ 0

**Prompt:**
```
Isometric semi-flat illustration of economically failed garment factory,
dim lights, closed production lines, empty sewing stations, locked gate,
unused machines covered with cloth, somber amber and gray tones, dark slate background,
economic stagnation and bankruptcy mood, quiet and deserted, no text
```

---

### 3.7 `factory/state-victory.webp`
**Tỷ lệ:** 16:9 · **Dùng ở:** Factory status — chiến thắng / ending win

**Prompt:**
```
Isometric semi-flat illustration of sustainably modernized Vietnamese garment export factory,
green ESG elements, efficient robotics with happy skilled workers, solar panels on roof,
export trucks loading finished goods, emerald success glow, bright but still dark-theme compatible,
triumphant sustainable industrialization mood, dark slate sky with green-cyan highlights
```

---

## 4. Ảnh sự kiện theo tháng (10 ảnh)

### 4.1 `events/month-01.webp`
**Tháng 1:** Khởi động làn sóng 4.0

**Prompt:**
```
Event scene illustration for garment factory digital transformation launch,
Vietnamese factory manager standing at crossroads between old sewing line and futuristic AI production,
government digitalization banner as abstract blue glow shapes without readable text,
national Industry 4.0 campaign mood, semi-flat isometric 16:9, cyan highlights, dark slate background
```

---

### 4.2 `events/month-02.webp`
**Tháng 2:** Áp lực EVFTA

**Prompt:**
```
Event scene illustration of EU trade delegation inspecting Vietnamese garment factory,
inspectors with clipboards reviewing labor standards, workers in organized safe stations,
export certification and international compliance mood, European and Vietnamese flags as color hints only,
semi-flat isometric 16:9, professional tense atmosphere, dark slate background, no readable text
```

---

### 4.3 `events/month-03.webp`
**Tháng 3:** Robot giá rẻ

**Prompt:**
```
Event scene illustration of foreign salesman offering cheap used robotic sewing automation line,
old robot machines with foreign language warning stickers as abstract symbols,
factory owner evaluating risky low-cost upgrade, temptation vs caution mood,
semi-flat isometric 16:9, amber and cyan contrast, dark slate background, no readable text
```

---

### 4.4 `events/month-04.webp`
**Tháng 4:** Khủng hoảng mất kỹ năng

**Prompt:**
```
Event scene illustration of skills crisis in automated garment factory,
workers struggling to operate new AI fabric cutter, damaged fabric rolls on floor,
training gap between fast technology adoption and worker skills, semi-flat isometric 16:9,
amber warning mood, dark slate background, educational storytelling, no text
```

---

### 4.5 `events/month-05.webp`
**Tháng 5:** Gói hỗ trợ Chính phủ

**Prompt:**
```
Event scene illustration of government industrial modernization support program,
Ministry representative presenting ERP software package and digital skills training,
factory team attending upskilling workshop with laptops and tablets,
semi-flat isometric 16:9, hopeful institutional support mood, cyan and violet accents, dark slate background
```

---

### 4.6 `events/month-06.webp`
**Tháng 6:** Đứt gãy chuỗi cung ứng

**Prompt:**
```
Event scene illustration of supply chain disruption via blockchain platform migration,
foreign material supplier demanding API data connection, factory IT team connecting systems,
shipping containers and digital blockchain chain as abstract glowing links,
semi-flat isometric 16:9, high stakes global supply chain mood, dark slate background, no text
```

---

### 4.7 `events/month-07.webp`
**Tháng 7:** Chảy máu chất xám

**Prompt:**
```
Event scene illustration of talent drain competition, large foreign-invested smart factory
opening next door to smaller Vietnamese garment plant, attractive salary offers pulling engineers away,
brain drain mood, semi-flat isometric 16:9, violet human resource theme, dark slate background, no text
```

---

### 4.8 `events/month-08.webp`
**Tháng 8:** Xu hướng ESG xanh hóa

**Prompt:**
```
Event scene illustration of ESG green manufacturing pressure on garment export factory,
international buyer reviewing environmental compliance, IoT sensors monitoring energy usage,
green leaf tech motif, sustainability standards mood, semi-flat isometric 16:9,
emerald and cyan palette, dark slate background, no readable text
```

---

### 4.9 `events/month-09.webp`
**Tháng 9:** Tăng tốc về đích

**Prompt:**
```
Event scene illustration of massive holiday season export order rush in garment factory,
production floor at peak capacity, machines running at maximum speed, stacked order boxes,
deadline pressure mood, semi-flat isometric 16:9, energetic cyan and amber accents, dark slate background
```

---

### 4.10 `events/month-10.webp`
**Tháng 10:** Tổng kết CNH-HĐH

**Prompt:**
```
Event scene illustration of final evaluation month for industrialization and modernization journey,
panoramic smart garment factory with timeline hologram showing 10-month progress as abstract dots,
reflective strategic summary mood, semi-flat isometric 16:9, balanced emerald and cyan glow, dark slate background
```

---

## 5. Ảnh lựa chọn (14 ảnh)

### 5.1 `choices/month-01-a.webp`
**Chạy theo công nghệ** — Đầu tư dàn máy cắt vải AI

**Prompt:**
```
Choice card illustration, investing in newest AI fabric cutting machine for garment factory,
futuristic cutter scanning textile roll, expensive high-tech upgrade, cyan glow,
semi-flat isometric 4:3, dark slate background, focused single object composition, no text
```

---

### 5.2 `choices/month-01-b.webp`
**Duy trì truyền thống** — Giữ dây chuyền cũ

**Prompt:**
```
Choice card illustration, keeping traditional old sewing production line running,
manual machines and conservative cost-saving strategy, muted gray-blue tones,
semi-flat isometric 4:3, dark slate background, steady but outdated mood, no text
```

---

### 5.3 `choices/month-02-a.webp`
**Đáp ứng tiêu chuẩn lao động**

**Prompt:**
```
Choice card illustration, upgrading labor standards with full insurance and fair wage increase,
happy workers in safe compliant factory stations, EU standard compliance mood,
emerald and violet accents, semi-flat isometric 4:3, dark slate background, no text
```

---

### 5.4 `choices/month-02-b.webp`
**Tiếp tục gia công giá rẻ**

**Prompt:**
```
Choice card illustration, continuing cheap labor outsourcing production model,
high output focus with minimal worker benefits, cost-cutting mood,
muted amber-gray tones, semi-flat isometric 4:3, dark slate background, no text
```

---

### 5.5 `choices/month-03-a.webp`
**Tham năng suất** — Mua robot cũ giá rẻ

**Prompt:**
```
Choice card illustration, buying cheap imported used automation line immediately,
old foreign robots installed quickly for productivity boost, risky bargain mood,
cyan machine glow with amber risk hints, semi-flat isometric 4:3, dark slate background, no text
```

---

### 5.6 `choices/month-03-b.webp`
**Thận trọng** — Tối ưu xưởng hiện tại

**Prompt:**
```
Choice card illustration, cautious factory optimization with maintenance and process improvement,
technician tuning existing machines with wrench and checklist, prudent investment mood,
balanced cyan-violet palette, semi-flat isometric 4:3, dark slate background, no text
```

---

### 5.7 `choices/month-05-a.webp`
**Đổi mới đồng bộ** — ERP + đào tạo kỹ năng số

**Prompt:**
```
Choice card illustration, synchronized digital transformation with ERP software rollout
and worker digital skills training classroom, integrated tech and people upgrade,
semi-flat isometric 4:3, cyan and violet harmony, dark slate background, no text
```

---

### 5.8 `choices/month-05-b.webp`
**Tự bơi** — Không tham gia chương trình hỗ trợ

**Prompt:**
```
Choice card illustration, factory going alone without government support program,
small team managing outdated processes independently, short-term savings mood,
desaturated slate tones, semi-flat isometric 4:3, dark slate background, no text
```

---

### 5.9 `choices/month-07-a.webp`
**Cải tiến quan hệ phân phối** — Giữ nhân tài

**Prompt:**
```
Choice card illustration, improving compensation with profit sharing and benefits to retain engineers,
talented workers staying at Vietnamese garment factory, human capital investment mood,
violet and emerald accents, semi-flat isometric 4:3, dark slate background, no text
```

---

### 5.10 `choices/month-07-b.webp`
**Giữ chính sách cũ** — Nhân sự rời đi

**Prompt:**
```
Choice card illustration, engineers leaving factory for better foreign competitor offers,
workers walking out gate toward shiny neighboring plant, talent loss mood,
cool gray and faded violet tones, semi-flat isometric 4:3, dark slate background, no text
```

---

### 5.11 `choices/month-08-a.webp`
**Đầu tư hệ sinh thái IoT** — ESG

**Prompt:**
```
Choice card illustration, installing IoT sensor ecosystem for energy and process transparency,
green manufacturing monitoring dashboard as hologram, ESG compliance mood,
emerald and cyan palette, semi-flat isometric 4:3, dark slate background, no text
```

---

### 5.12 `choices/month-08-b.webp`
**Phớt lờ xu hướng xanh**

**Prompt:**
```
Choice card illustration, ignoring green trend and maximizing raw production output only,
smoky inefficient machines and dissatisfied international buyer silhouette,
gray-amber negative mood, semi-flat isometric 4:3, dark slate background, no text
```

---

### 5.13 `choices/month-09-a.webp`
**Overclock hệ thống**

**Prompt:**
```
Choice card illustration, overclocking production machines to maximum capacity for big order,
machines overheating with speed lines and stress indicators, aggressive output push mood,
intense cyan and amber accents, semi-flat isometric 4:3, dark slate background, no text
```

---

### 5.14 `choices/month-09-b.webp`
**Chuẩn hóa quy trình** — An toàn lao động

**Prompt:**
```
Choice card illustration, standardizing occupational safety procedures across factory,
safety checklist, protective equipment, organized calm production flow,
emerald stable mood, semi-flat isometric 4:3, dark slate background, no text
```

---

## 6. Kết cục (3 ảnh hero)

### 6.1 `endings/sustainable-modernization.webp`
**CNH-HĐH Bền vững — Chiến thắng**

**Prompt:**
```
Ending hero illustration, sustainable industrialization victory for Vietnamese garment factory,
harmonious smart production with skilled workers and green ESG technology,
export success and stable growth mood, emerald and cyan celebration glow,
semi-flat isometric 16:9, dark slate background, uplifting educational game ending art, no text
```

---

### 6.2 `endings/technology-breakdown.webp`
**Đứt gãy công nghệ — Thất bại**

**Prompt:**
```
Ending hero illustration, technological breakdown failure ending,
advanced machines failed and mismatched with workforce capabilities,
damaged fabric and production halt, red danger accents, dramatic but stylized,
semi-flat isometric 16:9, dark slate background, cautionary failure mood, no text
```

---

### 6.3 `endings/economic-lag.webp`
**Tụt hậu kinh tế — Thất bại**

**Prompt:**
```
Ending hero illustration, economic lag failure ending,
closed underinvested garment factory falling behind global competition,
empty production floor and missed export opportunities, somber amber-gray palette,
semi-flat isometric 16:9, dark slate background, stagnation and decline mood, no text
```

---

## 7. Nhân vật NPC (6 ảnh)

### 7.1 `characters/government-official.webp`
**Đại diện Bộ Công Thương**

**Prompt:**
```
Character portrait illustration, Vietnamese government industry official in formal attire,
friendly authoritative presence, holding digital modernization tablet,
semi-flat style bust portrait, cyan institutional accents, dark slate background,
visual novel game character art, no text, 3:4 vertical
```

---

### 7.2 `characters/eu-inspector.webp`
**Thanh tra EU**

**Prompt:**
```
Character portrait illustration, EU trade compliance inspector with clipboard,
professional European business traveler in Vietnamese factory context,
semi-flat style bust portrait, neutral blue-gray suit, dark slate background,
visual novel game character art, no text, 3:4 vertical
```

---

### 7.3 `characters/robot-salesman.webp`
**Đối tác bán robot cũ**

**Prompt:**
```
Character portrait illustration, foreign used-equipment salesman offering old industrial robots,
persuasive but shady bargain dealer mood, semi-flat style bust portrait,
amber accent lighting, dark slate background, visual novel game character art, no text, 3:4 vertical
```

---

### 7.4 `characters/fie-executive.webp`
**Đại diện tập đoàn FIE**

**Prompt:**
```
Character portrait illustration, foreign-invested enterprise executive recruiting talent,
polished corporate leader with competitive hiring offer vibe, semi-flat bust portrait,
violet and cyan accents, dark slate background, visual novel game character art, no text, 3:4 vertical
```

---

### 7.5 `characters/international-buyer.webp`
**Khách hàng quốc tế ESG**

**Prompt:**
```
Character portrait illustration, international fashion brand buyer evaluating ESG compliance,
professional global client with sustainability checklist tablet, semi-flat bust portrait,
emerald accent tones, dark slate background, visual novel game character art, no text, 3:4 vertical
```

---

### 7.6 `characters/player-director.webp`
**Giám đốc SmartGarment (người chơi)**

**Prompt:**
```
Character portrait illustration, Vietnamese garment factory director as player avatar,
confident mid-career manager, smart business casual with factory badge,
approachable leadership presence, semi-flat bust portrait, cyan accent, dark slate background,
visual novel protagonist style, no text, 3:4 vertical
```

---

## 8. UI badges & icons (8 ảnh)

> Nên gen **nền trong suốt** nếu model hỗ trợ.

### 8.1 `ui/budget-healthy.png`
**Ngân sách dư**

**Prompt:**
```
UI game icon, healthy factory budget status, full coin stack with emerald upward arrow,
semi-flat icon design, transparent background, centered, crisp edges, 512x512
```

---

### 8.2 `ui/budget-tight.png`
**Ngân sách căng**

**Prompt:**
```
UI game icon, tight budget warning status, small coin pile with amber caution triangle,
semi-flat icon design, transparent background, centered, crisp edges, 512x512
```

---

### 8.3 `ui/budget-danger.png`
**Ngân sách nguy hiểm**

**Prompt:**
```
UI game icon, critical budget danger status, empty wallet with red downward arrow,
semi-flat icon design, transparent background, centered, crisp edges, 512x512
```

---

### 8.4 `ui/llsx-levels.png`
**LLSX levels 1–5 (sprite sheet 5 icon)**

**Prompt:**
```
UI sprite sheet of 5 technology level icons for LLSX progression in garment factory,
from basic sewing machine to advanced AI robotics, left to right increasing complexity,
semi-flat icons on one row, transparent background, consistent size, game UI asset, no text
```

---

### 8.5 `ui/qhsx-levels.png`
**QHSX levels 1–5 (sprite sheet 5 icon)**

**Prompt:**
```
UI sprite sheet of 5 labor relations level icons for QHSX progression,
from basic worker group to advanced trained team with management systems,
left to right increasing sophistication, semi-flat icons on one row, transparent background, no text
```

---

### 8.6 `ui/delta-balanced.png`
**Delta cân bằng**

**Prompt:**
```
UI game icon, balanced scale symbol with emerald glow, harmony status badge,
semi-flat icon, transparent background, 512x512, no text
```

---

### 8.7 `ui/delta-warning.png`
**Delta cảnh báo**

**Prompt:**
```
UI game icon, tilted unbalanced scale with amber warning triangle, risk status badge,
semi-flat icon, transparent background, 512x512, no text
```

---

### 8.8 `ui/delta-breakdown.png`
**Delta đứt gãy**

**Prompt:**
```
UI game icon, broken scale and cracked machine cog with red danger symbol, critical status badge,
semi-flat icon, transparent background, 512x512, no text
```

---

## 9. Báo cáo tháng & Dashboard (4 ảnh)

### 9.1 `reports/monthly-header.webp`
**Header báo cáo tháng**

**Prompt:**
```
Wide decorative header illustration for monthly factory performance report screen,
clipboard dashboard with charts as abstract shapes, garment factory mini scene,
semi-flat isometric 16:9, cyan and emerald accents, dark slate background,
top banner composition for UI header, no readable text
```

---

### 9.2 `reports/history-chart-deco.webp`
**Trang trí biểu đồ lịch sử**

**Prompt:**
```
Decorative illustration companion for history line chart, rising trend of technology and management
over time shown as dual glowing lines with factory silhouette background,
semi-flat style 16:9, subtle and non-distracting, dark slate background, no numbers or text
```

---

### 9.3 `reports/before-after-split.webp`
**Panel trước / sau lựa chọn**

**Prompt:**
```
Split before-and-after comparison illustration template for monthly choice impact,
left panel slightly dimmer "before" factory state, right panel brighter "after" state,
semi-flat isometric 16:9, clear vertical divide, dark slate background, no text labels
```

---

### 9.4 `reports/imbalance-banner.webp`
**Banner cảnh báo mất cân bằng**

**Prompt:**
```
Wide warning banner illustration for production imbalance alert in garment factory,
amber alert stripe composition with unbalanced machine and worker icons,
semi-flat 16:9 horizontal banner, dark slate background, strong but clean visual, no readable text
```

---

## Checklist sau khi gen

- [ ] Đúng tên file (không đổi tên, dùng đúng path)
- [ ] Đúng tỷ lệ và đủ độ phân giải
- [ ] Không có chữ / watermark trong ảnh
- [ ] Tone màu đồng bộ giữa các ảnh cùng nhóm
- [ ] Ưu tiên `.webp` cho ảnh lớn (nhẹ hơn), `.png` cho icon UI

### Thứ tự gen đề xuất (chất lượng đồng bộ tốt nhất)

1. Gen **1 ảnh mẫu** trước: `events/month-01.webp`
2. Nếu ưng style → gen tiếp toàn bộ `events/`, rồi `choices/`, rồi `factory/`
3. Gen `concepts/` và `ui/` sau
4. Gen `characters/` và `endings/` cuối

---

**Tổng: 65 ảnh** · Khi đặt đủ vào `assets/`, nhắn mình để tích hợp vào project.
