import { Search } from 'lucide-react'
import React from 'react'

export function SearchBar() {
  return (
    <div className="w-full max-w-lg relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-5 h-5" />
      </span>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#52aaa5]/30 bg-white dark:bg-[#181d28] focus:outline-none focus:ring-2 focus:ring-[#52aaa5] transition text-base text-[#2D3748] placeholder-gray-400"
        placeholder="Tìm kiếm…"
        autoComplete="off"
      />
    </div>
  )
}
