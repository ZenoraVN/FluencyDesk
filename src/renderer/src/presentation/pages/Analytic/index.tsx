import { Card } from '../../../components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  Brain,
  Book,
  Mic,
  Headphones,
  PenTool,
  Clock,
  Target,
  UserCog,
} from 'lucide-react'

const COLORS = {
  primary: '#52aaa5',
  secondary: '#6366f1',
  accent1: '#ec4899',
  accent2: '#f59e0b',
  accent3: '#10b981',
  accent4: '#8b5cf6',
}

const learningProgressData = [
  { name: 'T2', minutes: 45 },
  { name: 'T3', minutes: 60 },
  { name: 'T4', minutes: 30 },
  { name: 'T5', minutes: 75 },
  { name: 'T6', minutes: 45 },
  { name: 'T7', minutes: 90 },
  { name: 'CN', minutes: 60 },
]

const vocabularyData = [
  { category: 'Business', words: 120, color: COLORS.primary },
  { category: 'Travel', words: 85, color: COLORS.secondary },
  { category: 'Academic', words: 150, color: COLORS.accent1 },
  { category: 'Daily Life', words: 200, color: COLORS.accent2 },
  { category: 'Technology', words: 95, color: COLORS.accent3 },
]

const skillsData = [
  { name: 'Speaking', score: 75, color: COLORS.primary },
  { name: 'Listening', score: 82, color: COLORS.accent2 },
  { name: 'Writing', score: 68, color: COLORS.accent4 },
]

const studyHabitsData = [
  { value: 30, name: 'Sáng', color: COLORS.accent2 },
  { value: 25, name: 'Chiều', color: COLORS.accent3 },
  { value: 45, name: 'Tối', color: COLORS.accent4 },
]

const AnalyticPage = () => {
  return (
    <div className="min-h-screen bg-[#f6f6f0] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#2D3748]">Phân Tích Học Tập</h1>
        <p className="mt-2 text-[#718096]">
          Theo dõi tiến độ và hiệu quả học tập của bạn
        </p>
      </div>

      <div className="grid gap-8">
        {/* Tổng Quan Tiến Độ Học Tập */}
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-[#52aaa5]/10 p-2">
              <Brain className="h-6 w-6 text-[#52aaa5]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-[#2D3748]">
                Tổng Quan Tiến Độ Học Tập
              </h2>
              <p className="text-sm text-[#718096]">
                Thời gian học tập trong tuần qua
              </p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={learningProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  name="Phút"
                  stroke={COLORS.accent4}
                  strokeWidth={2}
                  dot={{ fill: COLORS.accent4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Phân Tích Từ Vựng */}
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-[#52aaa5]/10 p-2">
              <Book className="h-6 w-6 text-[#52aaa5]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-[#2D3748]">
                Phân Tích Từ Vựng
              </h2>
              <p className="text-sm text-[#718096]">
                Số từ vựng đã học theo chủ đề
              </p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vocabularyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="category" stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="words"
                  name="Số từ"
                  style={{ cursor: 'default' }}
                  className="!hover:opacity-100"
                >
                  {vocabularyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Kỹ Năng */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Phân Tích Kỹ Năng Nói */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-[#52aaa5]/10 p-2">
                <Mic className="h-6 w-6 text-[#52aaa5]" />
              </div>
              <h2 className="text-xl font-medium text-[#2D3748]">
                Phân Tích Kỹ Năng Nói
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#718096]">Phát âm</span>
                  <span className="font-medium text-[#2D3748]">85%</span>
                </div>
                <div className="h-2 rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: '85%', backgroundColor: COLORS.accent1 }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#718096]">Trôi chảy</span>
                  <span className="font-medium text-[#2D3748]">70%</span>
                </div>
                <div className="h-2 rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: '70%', backgroundColor: COLORS.accent2 }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#718096]">Ngữ điệu</span>
                  <span className="font-medium text-[#2D3748]">75%</span>
                </div>
                <div className="h-2 rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: '75%', backgroundColor: COLORS.accent3 }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Khả Năng Nghe Hiểu */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-[#52aaa5]/10 p-2">
                <Headphones className="h-6 w-6 text-[#52aaa5]" />
              </div>
              <h2 className="text-xl font-medium text-[#2D3748]">
                Khả Năng Nghe Hiểu
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#718096]">Hội thoại</span>
                  <span className="font-medium text-[#2D3748]">80%</span>
                </div>
                <div className="h-2 rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: '80%', backgroundColor: COLORS.accent4 }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#718096]">Tin tức</span>
                  <span className="font-medium text-[#2D3748]">65%</span>
                </div>
                <div className="h-2 rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: '65%', backgroundColor: COLORS.secondary }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#718096]">Học thuật</span>
                  <span className="font-medium text-[#2D3748]">60%</span>
                </div>
                <div className="h-2 rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: '60%', backgroundColor: COLORS.primary }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Hiệu Suất Viết */}
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-[#52aaa5]/10 p-2">
              <PenTool className="h-6 w-6 text-[#52aaa5]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-[#2D3748]">
                Hiệu Suất Viết
              </h2>
              <p className="text-sm text-[#718096]">
                Điểm số các kỹ năng
              </p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="score"
                  name="Điểm"
                  style={{ cursor: 'default' }}
                  className="!hover:opacity-100"
                >
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Thói Quen Học Tập */}
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-[#52aaa5]/10 p-2">
                <Clock className="h-6 w-6 text-[#52aaa5]" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-[#2D3748]">
                  Thói Quen Học Tập
                </h2>
                <p className="text-sm text-[#718096]">
                  Thời gian học theo khung giờ
                </p>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studyHabitsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    {studyHabitsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #E2E8F0'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Theo Dõi Mục Tiêu và Phân Tích Cá Nhân */}
          <Card className="space-y-8 p-6">
            {/* Theo Dõi Mục Tiêu */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-[#52aaa5]/10 p-2">
                  <Target className="h-6 w-6 text-[#52aaa5]" />
                </div>
                <h2 className="text-xl font-medium text-[#2D3748]">
                  Theo Dõi Mục Tiêu
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-[#718096]">IELTS 7.0</span>
                    <span className="font-medium text-[#2D3748]">60%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E2E8F0]">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: '60%', backgroundColor: COLORS.accent1 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-[#718096]">3000 từ vựng</span>
                    <span className="font-medium text-[#2D3748]">75%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E2E8F0]">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: '75%', backgroundColor: COLORS.accent4 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Phân Tích Cá Nhân */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-[#52aaa5]/10 p-2">
                  <UserCog className="h-6 w-6 text-[#52aaa5]" />
                </div>
                <h2 className="text-xl font-medium text-[#2D3748]">
                  Phân Tích Cá Nhân
                </h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-[#52aaa5]/10 p-4">
                  <h3 className="mb-2 font-medium text-[#2D3748]">
                    Phong cách học tập
                  </h3>
                  <p className="text-sm text-[#718096]">
                    Thị giác - Bạn học tốt nhất thông qua hình ảnh và video
                  </p>
                </div>
                <div className="rounded-lg border border-[#52aaa5]/10 p-4">
                  <h3 className="mb-2 font-medium text-[#2D3748]">
                    Đề xuất cải thiện
                  </h3>
                  <p className="text-sm text-[#718096]">
                    Tập trung vào luyện nghe học thuật để cải thiện điểm số
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AnalyticPage