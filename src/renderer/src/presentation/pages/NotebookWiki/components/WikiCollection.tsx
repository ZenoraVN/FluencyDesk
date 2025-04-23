import { useState } from 'react'
import { Card, CardContent } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import {
  Search,
  Plus,
  Volume2,
  Clock,
  Brain,
  CheckCircle2,
  Filter,
  SortAsc
} from 'lucide-react'
import { notebookWikis, filterOptions, sortOptions } from '../data/mockData'
import type { Wiki } from '../data/mockData'

const WikiCollection = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const getLevelIcon = (level: Wiki['level']) => {
    switch (level) {
      case 'new':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'learning':
        return <Brain className="h-5 w-5 text-orange-500" />
      case 'mastered':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
    }
  }

  const getLevelStyle = (level: Wiki['level']) => {
    switch (level) {
      case 'new':
        return 'bg-blue-50 text-blue-600'
      case 'learning':
        return 'bg-orange-50 text-orange-600'
      case 'mastered':
        return 'bg-green-50 text-green-600'
    }
  }

  const filteredWikis = notebookWikis.filter(wiki => {
    const matchesSearch = wiki.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wiki.definition.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || wiki.level === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#2D3748]">Danh sách từ vựng</h2>
            <p className="text-sm text-[#718096]">{filteredWikis.length} từ vựng</p>
          </div>
          <Button 
            className="bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90"
            onClick={() => console.log('Add new word')}
          >
            <Plus className="mr-2 h-5 w-5" />
            Thêm từ mới
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#718096]" />
              <Input
                className="pl-10"
                placeholder="Tìm kiếm từ vựng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-5 w-5" />
              <select 
                className="bg-transparent"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Button>
            <Button variant="outline" className="gap-2">
              <SortAsc className="h-5 w-5" />
              <select className="bg-transparent">
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Button>
          </div>
        </div>

        {/* Words List */}
        <div className="space-y-4">
          {filteredWikis.map((wiki) => (
            <div
              key={wiki.id}
              className="group cursor-pointer rounded-xl border border-[#52aaa5]/10 p-4 transition-all hover:border-[#52aaa5]/30 hover:bg-[#52aaa5]/5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="text-lg font-medium text-[#2D3748]">{wiki.term}</h3>
                    <Badge variant="secondary" className={getLevelStyle(wiki.level)}>
                      {wiki.level === 'new' ? 'Chưa học' : wiki.level === 'learning' ? 'Đang học' : 'Đã thuộc'}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#718096]">{wiki.pronunciation}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => console.log('Play pronunciation')}
                >
                  <Volume2 className="h-5 w-5 text-[#52aaa5]" />
                </Button>
              </div>

              <div className="mb-3 space-y-2">
                <p className="text-[#2D3748]">{wiki.definition}</p>
                <p className="text-sm italic text-[#718096]">{wiki.example}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {wiki.tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="secondary" 
                      className="bg-[#52aaa5]/10 text-[#52aaa5]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#718096]">
                  {getLevelIcon(wiki.level)}
                  <span>
                    {wiki.lastReviewed 
                      ? `Ôn tập ${new Date(wiki.lastReviewed).toLocaleDateString('vi-VN')}` 
                      : 'Chưa học'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default WikiCollection