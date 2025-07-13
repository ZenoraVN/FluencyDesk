import React from 'react'
import { SKILLS, SkillType } from '../types/questionDetail'
import * as LucideIcons from 'lucide-react'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs'

interface SkillTabsProps {
  selectedSkill: SkillType
  onSelect: (skill: SkillType) => void
}

// Map each skill to Lucide
const iconMap: Record<SkillType, keyof typeof LucideIcons> = {
  listening: 'LucideEar',
  reading: 'LucideBookOpen',
  grammar: 'LucideAtom',
  speaking: 'LucideMic',
  writing: 'LucidePen',
  vocabulary: 'LucideSpellCheck'
}

export const SkillTabs: React.FC<SkillTabsProps> = ({ selectedSkill, onSelect }) => (
  <Tabs
    value={selectedSkill}
    onValueChange={(val) => onSelect(val as SkillType)}
    className="w-full"
  >
    <TabsList className="w-full bg-transparent px-1 py-0 gap-2 flex justify-start border-b border-zinc-200 dark:border-zinc-800 mb-2 rounded-none">
      {SKILLS.map((skill) => {
        const IconComp = (LucideIcons as any)[iconMap[skill.value as SkillType]] as React.FC<{
          color?: string
          size?: number
        }>
        const isSelected = selectedSkill === skill.value
        return (
          <TabsTrigger
            key={skill.value}
            value={skill.value}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-base transition-colors data-[state=active]:bg-zinc-100 data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-primary/90 data-[state=active]:font-bold`}
            style={{
              color: isSelected ? skill.color : undefined
            }}
          >
            {IconComp && <IconComp size={19} color={skill.color} />}
            <span>{skill.label}</span>
          </TabsTrigger>
        )
      })}
    </TabsList>
    {/* Provide at least one TabsContent so Radix Tabs context isn't null */}
    <TabsContent value={selectedSkill} className="hidden" />
  </Tabs>
)
