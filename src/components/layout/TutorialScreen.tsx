import { ArrowLeft, BookOpenCheck, Scale, Wallet, Wrench, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetImage } from '@/components/shared/AssetImage'
import { concepts } from '@/lib/gameAssets'
import { useGameStore } from '@/store/gameStore'

const glossary = [
  {
    title: 'Ngân sách',
    icon: Wallet,
    image: () => concepts.budget(),
    body: 'Nguồn tài chính của nhà máy. Nếu ngân sách ≤ $0 sau bất kỳ sự kiện hoặc quyết toán tháng nào, bạn thua vì thất bại kinh tế.',
  },
  {
    title: 'Trình độ LLSX',
    icon: Wrench,
    image: () => concepts.llsx(),
    body: 'Lực lượng sản xuất — công nghệ và công cụ lao động: máy cắt laser, robot AI, IoT, tự động hóa, nền tảng dữ liệu.',
  },
  {
    title: 'Trình độ QHSX',
    icon: BookOpenCheck,
    image: () => concepts.qhsx(),
    body: 'Quan hệ sản xuất — trình độ người lao động, kỹ năng vận hành, quy trình quản lý, lương thưởng, phúc lợi, văn hóa nhà máy.',
  },
  {
    title: 'Chênh lệch (LLSX − QHSX)',
    icon: Scale,
    image: () => concepts.balance(),
    body: 'Chênh lệch = LLSX − QHSX. Khi chênh lệch = 2 sẽ phát sinh phạt mất cân bằng $15/tháng. Khi chênh lệch ≥ 3 kích hoạt kết cục Đứt gãy công nghệ ngay lập tức.',
  },
  {
    title: 'Quyết toán hàng tháng',
    icon: Wallet,
    image: () => concepts.settlement(),
    body: 'Doanh thu = LLSX × $25. Chi phí vận hành = QHSX × $10. Cộng/trừ các điều chỉnh sự kiện và phạt mất cân bằng để ra thay đổi ròng.',
  },
  {
    title: 'Chiến thắng',
    icon: Trophy,
    image: () => concepts.endingsOverview(),
    body: 'Sau tháng 10: ngân sách > 0, LLSX ≥ 4, QHSX ≥ 4, delta < 3 để đạt CNH-HĐH bền vững.',
  },
]

export function TutorialScreen() {
  const returnFromTutorial = useGameStore((state) => state.returnFromTutorial)
  const endingsOverview = concepts.endingsOverview()

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Hướng dẫn &amp; thuật ngữ</h1>
            <p className="mt-2 text-slate-400">
              Nắm vững các chỉ số cốt lõi trước khi điều hành SmartGarment Việt Nam.
            </p>
          </div>
          <Button variant="secondary" onClick={returnFromTutorial}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {glossary.map((item) => (
            <Card key={item.title} className="overflow-hidden">
              <AssetImage
                src={item.image()}
                alt={item.title}
                fit="contain"
                className="aspect-square max-h-48 border-b border-slate-800"
              />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-cyan-400" />
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-300">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden border-amber-500/30 bg-amber-950/10">
          <AssetImage
            src={endingsOverview}
            alt="Ba kết cục có thể xảy ra"
            fit="contain"
            className="aspect-video max-h-56 border-b border-amber-500/20"
          />
          <CardHeader>
            <CardTitle className="text-base">Ba kết cục có thể xảy ra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>
              <strong className="text-red-300">Đứt gãy công nghệ:</strong> chênh lệch ≥ 3 — công nghệ
              vượt quá năng lực con người và quản trị.
            </p>
            <p>
              <strong className="text-amber-300">Tụt hậu kinh tế:</strong> ngân sách ≤ 0 hoặc
              không đạt điều kiện thắng sau tháng 10.
            </p>
            <p>
              <strong className="text-emerald-300">CNH-HĐH bền vững:</strong> cân bằng LLSX,
              QHSX và tài chính sau 10 tháng (ngân sách &gt; 0, LLSX ≥ 4, QHSX ≥ 4, chênh lệch &lt; 3).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
