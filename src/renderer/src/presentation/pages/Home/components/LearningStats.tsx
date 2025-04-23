import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Trophy, Flame, Target } from 'lucide-react'
import { learningStatsData } from '../data/mockData'

interface TooltipFormatterResult {
  value: number
  name: string
}

const LearningStats = () => {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold text-[#2D3748]">Learning Statistics</h2>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Weekly Progress Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={learningStatsData.weeklyStudyTime}>
                  <XAxis 
                    dataKey="day" 
                    stroke="#718096"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#718096"
                    fontSize={12}
                    tickFormatter={(value: number) => `${value}m`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} minutes`, 'Study Time']}
                  />
                  <Bar 
                    dataKey="minutes" 
                    fill="#52aaa5"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-orange-100 p-3">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Learning Streak</p>
                <p className="text-2xl font-bold text-[#2D3748]">
                  {learningStatsData.streak} Days
                </p>
              </div>
            </div>
            <div className="h-16 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ value: learningStatsData.streak }]}>
                  <Bar dataKey="value" fill="#52aaa5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Weekly Goals</p>
                <p className="text-2xl font-bold text-[#2D3748]">
                  {learningStatsData.weeklyGoals.completed}/{learningStatsData.weeklyGoals.total}
                </p>
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <p className="text-lg font-semibold text-blue-500">
                {Math.round((learningStatsData.weeklyGoals.completed / learningStatsData.weeklyGoals.total) * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LearningStats