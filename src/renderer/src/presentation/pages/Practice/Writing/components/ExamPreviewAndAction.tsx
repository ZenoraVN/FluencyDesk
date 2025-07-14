import React from 'react'
import { Eye } from 'lucide-react'

import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

type ChartPreview = {
  chartType: string
  chartData: any
  chartOptions?: any
}
interface WritingPreviewData {
  text: string
  chart?: ChartPreview | null
}

interface ExamPreviewAndActionProps {
  preview: WritingPreviewData | null
  enabled: boolean
  onStartExam?: () => void
}

const ExamPreviewAndAction: React.FC<ExamPreviewAndActionProps> = ({
  preview,
  enabled,
  onStartExam
}) => {
  let chartContent: React.ReactNode = null
  if (preview && preview.chart && preview.chart.chartType && preview.chart.chartData) {
    const { chartType, chartData, chartOptions } = preview.chart
    if (chartType === 'bar') chartContent = <Bar data={chartData} options={chartOptions || {}} />
    else if (chartType === 'pie')
      chartContent = <Pie data={chartData} options={chartOptions || {}} />
    else if (chartType === 'line')
      chartContent = <Line data={chartData} options={chartOptions || {}} />
    else
      chartContent = (
        <div className="mt-4 text-yellow-600 text-xs">Unsupported chart type: {chartType}</div>
      )
  }

  return (
    <div className="bg-card rounded-xl p-4 mb-4 border w-full min-w-0">
      <div className="mb-2 text-lg font-bold flex items-center gap-2">
        <Eye className="w-5 h-5 text-primary" />
        Exam Preview
      </div>
      <div className="border rounded-md px-4 py-3 mb-4 min-h-[68px] whitespace-pre-line text-gray-700">
        {preview?.text
          ? preview.text
          : '(No exam has been generated. Please enter a prompt or create a random exam!)'}
      </div>
      {chartContent && (
        <div className="mb-4 flex flex-col items-center">
          <div className="text-sm font-medium mb-2 text-gray-500">Chart Data</div>
          <div className="w-full max-w-[480px] border rounded-lg p-2 bg-white dark:bg-gray-900">
            {chartContent}
          </div>
        </div>
      )}
      {preview && (
        <div className="flex justify-end">
          <button
            className="bg-green-600 text-white font-bold px-8 py-2 hover:bg-green-700 transition"
            style={{ borderRadius: 8 }}
            disabled={!enabled}
            onClick={onStartExam}
          >
            Start Exam
          </button>
        </div>
      )}
    </div>
  )
}

export default ExamPreviewAndAction
