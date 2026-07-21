import type {
  AutomaticMonthEvent,
  ChoiceMonthEvent,
  FinaleMonthEvent,
  MonthEvent,
} from '@/types/game'

export const monthEvents: MonthEvent[] = [
  {
    id: 'month-1',
    month: 1,
    type: 'choice',
    title: 'Khởi động làn sóng 4.0',
    context:
      'Nhà nước phát động chiến lược Chuyển đổi số doanh nghiệp sản xuất.',
    speaker: {
      id: 'government-official',
      name: 'Bà Trần Thị Thanh',
      role: 'Chuyên viên Bộ Công Thương',
      dialogue:
        'Chuyển đổi số là chìa khóa để ngành may xuất khẩu Việt Nam bứt phá trong kỷ nguyên Công nghiệp 4.0!',
    },
    choices: [
      {
        id: 'month-1-a',
        title: 'Chạy theo công nghệ',
        description: 'Đầu tư dàn máy cắt vải bằng AI mới nhất.',
        effects: { budget: -30, llsx: 1, qhsx: 0 },
        logMessage: 'Dây chuyền AI giúp tăng năng suất vượt trội!',
        icon: 'Cpu',
      },
      {
        id: 'month-1-b',
        title: 'Duy trì truyền thống',
        description: 'Giữ nguyên dây chuyền cũ để tích lũy vốn.',
        effects: { budget: 0, llsx: 0, qhsx: 0 },
        logMessage:
          'Xưởng hoạt động bình thường, nhưng bắt đầu tụt lại so với đối thủ.',
        icon: 'Factory',
      },
    ],
  },
  {
    id: 'month-2',
    month: 2,
    type: 'choice',
    title: 'Áp lực từ Hội nhập Quốc tế (EVFTA)',
    context:
      'Phái đoàn EU đến kiểm tra nhà máy để cấp chứng nhận xuất khẩu với thuế suất 0%.',
    speaker: {
      id: 'eu-inspector',
      name: 'Ông Henrik Weber',
      role: 'Trưởng đoàn kiểm tra EVFTA (Liên minh Châu Âu)',
      dialogue:
        'Chúng tôi đánh giá cao quy mô nhà máy, nhưng tiêu chuẩn an toàn và phúc lợi lao động mới là yếu tố quyết định thuế suất 0%.',
    },
    choices: [
      {
        id: 'month-2-a',
        title: 'Đáp ứng tiêu chuẩn lao động',
        description:
          'Nâng cấp quy trình quản lý, đóng bảo hiểm đầy đủ và tăng lương để giữ chân công nhân theo chuẩn EU.',
        effects: { budget: -25, llsx: 0, qhsx: 1 },
        logMessage:
          'Nhà máy đáp ứng tiêu chuẩn lao động quốc tế, tạo niềm tin với đối tác EU.',
        icon: 'ShieldCheck',
      },
      {
        id: 'month-2-b',
        title: 'Tiếp tục gia công giá rẻ',
        description:
          'Bỏ qua yêu cầu nâng cấp và tiếp tục tập trung vào mô hình gia công giá rẻ.',
        effects: { budget: 0, llsx: 0, qhsx: 0 },
        logMessage:
          'Xưởng duy trì mô hình giá rẻ, nhưng tiềm ẩn rủi ro về tiêu chuẩn lao động.',
        icon: 'TrendingDown',
      },
    ],
    consequences: [
      {
        type: 'budget_penalty_if_qhsx_below',
        choiceId: 'month-2-b',
        threshold: 2,
        budget: -20,
        message:
          'Xưởng bị xử phạt vì vi phạm tiêu chuẩn lao động quốc tế.',
      },
    ],
  },
  {
    id: 'month-3',
    month: 3,
    type: 'choice',
    title: 'Cám dỗ "Robot giá rẻ"',
    context:
      'Một đối tác chào bán dây chuyền tự động hóa cũ của nước ngoài với giá rẻ nhưng không có hướng dẫn sử dụng tiếng Việt.',
    speaker: {
      id: 'robot-salesman',
      name: 'Mr. Tanaka',
      role: 'Đại diện Nhà cung cấp Thiết bị Tự động hóa',
      dialogue:
        'Dàn robot may tự động này có mức giá rất hấp dẫn! Năng suất sản xuất sẽ tăng gấp đôi ngay lập tức.',
    },
    choices: [
      {
        id: 'month-3-a',
        title: 'Tham năng suất',
        description: 'Mua ngay dây chuyền để tăng mạnh sản lượng.',
        effects: { budget: -40, llsx: 2, qhsx: 0 },
        logMessage:
          'Dây chuyền tự động hóa giúp tăng sản lượng, nhưng đòi hỏi kỹ năng vận hành cao hơn.',
        icon: 'Bot',
      },
      {
        id: 'month-3-b',
        title: 'Thận trọng',
        description:
          'Từ chối dây chuyền cũ và dành nguồn lực để tối ưu hóa xưởng hiện tại.',
        effects: { budget: -15, llsx: 0, qhsx: 1 },
        logMessage:
          'Xưởng tối ưu quy trình và nâng cao năng lực quản lý, tránh rủi ro công nghệ lỗi thời.',
        icon: 'Wrench',
      },
    ],
  },
  {
    id: 'month-4',
    month: 4,
    type: 'automatic',
    title: 'Khủng hoảng "Mất kỹ năng"',
    context:
      'Sự phát triển quá nhanh của máy móc khiến kỹ năng hiện tại của người lao động có nguy cơ trở nên lỗi thời.',
    speaker: {
      id: 'player-director',
      name: 'Giám đốc Nguyễn Văn Minh',
      role: 'Giám đốc Điều hành SmartGarment',
      dialogue:
        'Máy móc hiện đại đã về xưởng, nhưng nếu đội ngũ công nhân chưa được làm chủ công nghệ thì nguy cơ đứt gãy vận hành rất cao!',
    },
    conditions: [
      {
        id: 'month-4-delta-2',
        when: (state) => state.llsx - state.qhsx === 2,
        effects: { budget: -30, llsx: 0, qhsx: 0 },
        message:
          'Công nhân không biết vận hành dàn máy AI mới, bấm nhầm nút khiến hàng loạt cây vải bị hỏng. Xưởng phải đền bù hợp đồng.',
      },
      {
        id: 'month-4-balanced',
        when: (state) => state.llsx === state.qhsx,
        effects: { budget: 20, llsx: 0, qhsx: 0 },
        message:
          'Công nghệ, con người và quy trình quản lý phối hợp nhịp nhàng. Nhà máy vận hành cực kỳ trơn tru và nhận được thưởng năng suất.',
      },
    ],
    neutralMessage:
      'Nhà máy chưa rơi vào khủng hoảng nghiêm trọng, nhưng mức độ phối hợp giữa công nghệ và con người vẫn cần được theo dõi.',
  },
  {
    id: 'month-5',
    month: 5,
    type: 'choice',
    title: 'Gói hỗ trợ CNH rút ngắn của Chính phủ',
    context:
      'Bộ Công Thương tung gói hỗ trợ doanh nghiệp thực hiện công nghiệp hóa, hiện đại hóa bền vững.',
    speaker: {
      id: 'government-official',
      name: 'Ông Lê Hoàng Nam',
      role: 'Chuyên gia CNH-HĐH Bộ Công Thương',
      dialogue:
        'Chương trình hỗ trợ của Nhà nước sẽ giúp doanh nghiệp nâng cấp hệ thống ERP và đào tạo kỹ năng số cho công nhân.',
    },
    choices: [
      {
        id: 'month-5-a',
        title: 'Đổi mới đồng bộ',
        description:
          'Tham gia gói hỗ trợ, mua phần mềm quản lý ERP và cho công nhân học kỹ năng số.',
        effects: { budget: -40, llsx: 1, qhsx: 1 },
        logMessage:
          'ERP và đào tạo kỹ năng số giúp đồng bộ công nghệ với năng lực quản lý.',
        icon: 'Network',
      },
      {
        id: 'month-5-b',
        title: 'Tự bơi',
        description:
          'Không tham gia chương trình hỗ trợ để tiết kiệm chi phí trước mắt.',
        effects: { budget: 0, llsx: 0, qhsx: 0 },
        logMessage:
          'Xưởng tiết kiệm chi phí ngắn hạn, nhưng bỏ lỡ cơ hội hiện đại hóa đồng bộ.',
        icon: 'Anchor',
      },
    ],
  },
  {
    id: 'month-6',
    month: 6,
    type: 'automatic',
    title: 'Cú sốc Đứt gãy Chuỗi cung ứng',
    context:
      'Đối tác cung ứng nguyên liệu nước ngoài chuyển sang nền tảng quản lý bằng Blockchain và yêu cầu nhà máy kết nối API dữ liệu để tiếp tục nhận đơn.',
    speaker: {
      id: 'international-buyer',
      name: 'Bà Sarah Jenkins',
      role: 'Đại diện Chuỗi cung ứng Dệt may Toàn cầu',
      dialogue:
        'Hệ thống mới của chúng tôi yêu cầu toàn bộ dữ liệu nguyên liệu và tiến độ phải được đồng bộ qua API Blockchain.',
    },
    conditions: [
      {
        id: 'month-6-connected',
        when: (state) => state.llsx >= 3,
        effects: { budget: 40, llsx: 0, qhsx: 0 },
        message:
          'Hệ thống của xưởng kết nối thành công với nền tảng mới. SmartGarment Việt Nam giành được một hợp đồng lớn.',
      },
      {
        id: 'month-6-disconnected',
        when: (state) => state.llsx < 3,
        effects: { budget: -25, llsx: 0, qhsx: 0 },
        message:
          'Công nghệ lỗi thời khiến xưởng không thể kết nối với hệ thống của đối tác. Đơn hàng bị chuyển sang doanh nghiệp khác.',
      },
    ],
    neutralMessage: '',
  },
  {
    id: 'month-7',
    month: 7,
    type: 'choice',
    title: 'Làn sóng "Chảy máu chất xám"',
    context:
      'Các tập đoàn FIE mở nhà máy thông minh bên cạnh và tuyển dụng nhân sự chất lượng cao với mức lương hấp dẫn.',
    speaker: {
      id: 'fie-executive',
      name: 'Ms. Clara Vance',
      role: 'Giám đốc Nhân sự Tập đoàn FIE',
      dialogue:
        'Chúng tôi đưa ra mức lương và chế độ đãi ngộ vượt trội cho các kỹ sư vận hành máy móc hiện đại tại khu công nghiệp mới.',
    },
    choices: [
      {
        id: 'month-7-a',
        title: 'Cải tiến quan hệ phân phối',
        description:
          'Tăng phúc lợi và thưởng cổ phần để giữ chân các kỹ sư vận hành máy.',
        effects: { budget: -30, llsx: 0, qhsx: 2 },
        logMessage:
          'Chính sách đãi ngộ mới giúp giữ chân nhân sự chất lượng cao.',
        icon: 'Users',
      },
      {
        id: 'month-7-b',
        title: 'Giữ chính sách cũ',
        description: 'Không thay đổi chính sách đãi ngộ hiện tại.',
        effects: { budget: 0, llsx: 0, qhsx: -1 },
        logMessage:
          'Các nhân sự có trình độ cao rời bỏ nhà máy, làm suy giảm năng lực tổ chức và quản lý.',
        icon: 'UserMinus',
      },
    ],
  },
  {
    id: 'month-8',
    month: 8,
    type: 'choice',
    title: 'Xu hướng "Xanh hóa" sản xuất (ESG)',
    context:
      'Khách hàng quốc tế yêu cầu nhà máy minh bạch quy trình và giảm phát thải.',
    speaker: {
      id: 'international-buyer',
      name: 'Bà Sarah Jenkins',
      role: 'Giám đốc Thu mua Nhãn hàng Thời trang Quốc tế',
      dialogue:
        'Thị trường Âu Mỹ ưu tiên hợp tác với các nhà máy đáp ứng chứng chỉ sản xuất xanh ESG và tối ưu điện năng.',
    },
    choices: [
      {
        id: 'month-8-a',
        title: 'Đầu tư hệ sinh thái IoT',
        description:
          'Cài đặt cảm biến IoT để đo lường và tối ưu năng lượng tiêu thụ.',
        effects: { budget: -20, llsx: 1, qhsx: 0 },
        logMessage:
          'Hệ thống IoT giúp minh bạch quy trình và đáp ứng tiêu chuẩn ESG.',
        icon: 'Leaf',
      },
      {
        id: 'month-8-b',
        title: 'Phớt lờ xu hướng',
        description:
          'Tiếp tục tập trung vào sản lượng và không đầu tư cho sản xuất xanh.',
        effects: { budget: 0, llsx: 0, qhsx: 0 },
        logMessage:
          'Xưởng ưu tiên sản lượng, nhưng khách hàng quốc tế đặt áp lực về giá.',
        icon: 'EyeOff',
      },
    ],
    consequences: [
      {
        type: 'revenue_adjustment',
        choiceId: 'month-8-b',
        amount: -15,
        message:
          'Khách hàng ép giá vì sản phẩm không đáp ứng tiêu chuẩn sản xuất xanh.',
      },
    ],
  },
  {
    id: 'month-9',
    month: 9,
    type: 'choice',
    title: 'Tăng tốc về đích',
    context:
      'SmartGarment Việt Nam có cơ hội nhận một đơn hàng khổng lồ cho mùa lễ hội cuối năm.',
    speaker: {
      id: 'player-director',
      name: 'Giám đốc Nguyễn Văn Minh',
      role: 'Giám đốc Điều hành SmartGarment',
      dialogue:
        'Đơn hàng mùa lễ hội là cơ hội tăng doanh thu lớn, nhưng chúng ta phải lựa chọn giữa ép công suất máy hay chuẩn hóa an toàn vận hành.',
    },
    choices: [
      {
        id: 'month-9-a',
        title: 'Overclock hệ thống',
        description: 'Ép máy móc chạy hết công suất để tăng năng lực sản xuất.',
        effects: { budget: -15, llsx: 1, qhsx: 0 },
        logMessage:
          'Máy móc vận hành tối đa, tăng năng lực sản xuất cho mùa cao điểm.',
        icon: 'Zap',
      },
      {
        id: 'month-9-b',
        title: 'Chuẩn hóa quy trình',
        description: 'Đầu tư chuẩn hóa toàn bộ quy trình an toàn lao động.',
        effects: { budget: -15, llsx: 0, qhsx: 1 },
        logMessage:
          'Quy trình an toàn được chuẩn hóa, nâng cao năng lực quản lý và vận hành.',
        icon: 'ClipboardCheck',
      },
    ],
  },
  {
    id: 'month-10',
    month: 10,
    type: 'finale',
    title: 'Tổng kết tiến trình CNH-HĐH',
    context:
      'SmartGarment Việt Nam bước vào tháng sản xuất cuối cùng. Hệ thống tiến hành tổng kết toàn bộ quá trình công nghiệp hóa, hiện đại hóa.',
    speaker: {
      id: 'player-director',
      name: 'Giám đốc Nguyễn Văn Minh',
      role: 'Giám đốc Điều hành SmartGarment',
      dialogue:
        'Chặng đường 10 tháng đã hoàn tất. Hãy cùng xem kết quả của sự kết hợp giữa công nghệ, quản trị và con người!',
    },
  },
]

export function getMonthEvent(month: number): MonthEvent | undefined {
  return monthEvents.find((event) => event.month === month)
}

export function isChoiceEvent(event: MonthEvent): event is ChoiceMonthEvent {
  return event.type === 'choice'
}

export function isAutomaticEvent(
  event: MonthEvent,
): event is AutomaticMonthEvent {
  return event.type === 'automatic'
}

export function isFinaleEvent(event: MonthEvent): event is FinaleMonthEvent {
  return event.type === 'finale'
}
