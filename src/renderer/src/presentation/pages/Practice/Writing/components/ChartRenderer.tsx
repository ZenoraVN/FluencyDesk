import React from 'react'
import { Bar, Pie, Line } from 'react-chartjs-2'

type ChartPreview = {
  chartType: string
  chartData: any
  chartOptions?: any
}

const ChartRenderer: React.FC<{ chart?: ChartPreview | null }> = ({ chart }) => {
  if (!chart || !chart.chartType || !chart.chartData) return null
  if (chart.chartType === 'bar')
    return <Bar data={chart.chartData} options={chart.chartOptions || {}} />
  if (chart.chartType === 'pie')
    return <Pie data={chart.chartData} options={chart.chartOptions || {}} />
  if (chart.chartType === 'line')
    return <Line data={chart.chartData} options={chart.chartOptions || {}} />
  return (
    <div className="my-2 text-yellow-600 text-xs">Unsupported chart type: {chart.chartType}</div>
  )
}

export default ChartRenderer
