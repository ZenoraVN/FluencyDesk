import { Label } from '../../../../../components/ui/label'
import { Minus, Plus } from 'lucide-react'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '../../../../../components/ui/form'
import { CustomInput } from '../../../../../componentsInput/CustomInput'
import { CreateWordFormData } from './CreateWordDrawer'
import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form'
import {
  CreateWordPartOfSpeechSection,
  PartOfSpeechOption
} from '../Create/CreateWordPartOfSpeechSection'
import { CustomButton } from '../../../../../componentsButton/CustomButton'

interface Props {
  form: UseFormReturn<CreateWordFormData>
  definitionFields: UseFieldArrayReturn<CreateWordFormData, 'definitions'>['fields']
  appendDefinition: UseFieldArrayReturn<CreateWordFormData, 'definitions'>['append']
  removeDefinition: UseFieldArrayReturn<CreateWordFormData, 'definitions'>['remove']
  partsOfSpeechOptions: PartOfSpeechOption[]
  isVietnamese: (text: string) => boolean
  isEnglish: (text: string) => boolean
}

export function CreateWordDefinitionSection({
  form,
  definitionFields,
  appendDefinition,
  removeDefinition,
  partsOfSpeechOptions,
  isVietnamese,
  isEnglish
}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Label className="text-[#2D3748] font-medium text-base">Định nghĩa</Label>
        <CustomButton
          type="button"
          onClick={() => {
            appendDefinition({
              parts_of_speech: '',
              definition: '',
              examples: [{ example_sentence: '', mean_example_sentence: '' }]
            })
            form.trigger('definitions')
          }}
          templateStyle="tealGhost"
          size="sm"
          className={`flex items-center gap-1 ${
            form.formState.errors.definitions ? 'border-red-500' : ''
          }`}
        >
          <Plus className="h-4 w-4" /> Thêm định nghĩa
        </CustomButton>
      </div>
      <div className="space-y-6">
        {definitionFields.map((field, index) => (
          <div
            key={field.id}
            className={`border rounded-lg p-4 space-y-4 relative ${
              form.formState.errors.definitions?.[index]?.parts_of_speech ||
              form.formState.errors.definitions?.[index]?.definition ||
              form.formState.errors.definitions?.[index]?.examples ||
              form.formState.errors.definitions?.root
                ? 'border-red-500'
                : 'border-[#52aaa5]/20'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              {/* Definition Index Button */}
              <CustomButton
                type="button"
                templateStyle="tealNumber"
                size="icon"
                className="w-8 h-8"
                tabIndex={-1}
              >
                {index + 1}
              </CustomButton>
              {/* Remove Definition Button */}
              {definitionFields.length > 1 && (
                <CustomButton
                  type="button"
                  size="sm"
                  onClick={() => removeDefinition(index)}
                  templateStyle="tealDanger"
                  className="flex items-center gap-1"
                >
                  <Minus className="h-4 w-4 mr-1" /> Xóa định nghĩa
                </CustomButton>
              )}
            </div>
            <div className="space-y-4">
              <CreateWordPartOfSpeechSection
                control={form.control}
                index={index}
                partsOfSpeechOptions={partsOfSpeechOptions}
              />
              {/* Definition Field */}
              <FormField
                control={form.control}
                name={`definitions.${index}.definition`}
                rules={{
                  required: 'Vui lòng nhập định nghĩa',
                  validate: {
                    notEmpty: (value) => (!value?.trim() ? 'Vui lòng nhập định nghĩa' : true),
                    vietnameseOnly: (value) =>
                      !isVietnamese(value) ? 'Vui lòng nhập định nghĩa bằng tiếng Việt' : true
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel className="text-[#2D3748] font-medium">Định nghĩa</FormLabel>
                    <FormControl>
                      <CustomInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        className={`min-h-[32px] bg-transparent border rounded-lg ${
                          error ? 'border-red-500' : 'border-[#52aaa5]'
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Example Section */}
              <div className="space-y-4">
                {form.watch(`definitions.${index}.examples`)?.map((_, exampleIndex) => (
                  <div key={exampleIndex} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      {/* Example Index Button */}
                      <CustomButton
                        type="button"
                        templateStyle="tealNumber"
                        size="icon"
                        className="w-7 h-7 text-xs"
                        tabIndex={-1}
                      >
                        {exampleIndex + 1}
                      </CustomButton>
                      {/* Remove Example Button */}
                      {form.watch(`definitions.${index}.examples`)?.length > 1 && (
                        <CustomButton
                          type="button"
                          size="sm"
                          onClick={() => {
                            const examples = form.getValues(`definitions.${index}.examples`)
                            form.setValue(
                              `definitions.${index}.examples`,
                              examples.filter((_: any, i: number) => i !== exampleIndex)
                            )
                          }}
                          templateStyle="tealDanger"
                          className="flex items-center gap-1"
                        >
                          <Minus className="h-4 w-4 mr-1" /> Xóa ví dụ
                        </CustomButton>
                      )}
                    </div>
                    <div className="space-y-2 p-4 border border-[#ddd] hover:border-[#52aaaf] rounded-lg">
                      <FormField
                        control={form.control}
                        name={`definitions.${index}.examples.${exampleIndex}.example_sentence`}
                        rules={{
                          required: 'Vui lòng nhập câu ví dụ',
                          validate: {
                            notEmpty: (value) =>
                              !value?.trim() ? 'Vui lòng nhập câu ví dụ' : true,
                            englishOnly: (value) =>
                              !isEnglish(value) ? 'Vui lòng nhập câu ví dụ bằng tiếng Anh' : true
                          }
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <FormItem>
                            <FormLabel className="text-[#2D3748] font-medium">Câu ví dụ</FormLabel>
                            <FormControl>
                              <CustomInput
                                value={field.value || ''}
                                onChange={field.onChange}
                                className={`min-h-[28px] bg-transparent border rounded-lg ${
                                  error ? 'border-red-500' : 'border-[#52aaa5]'
                                }`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`definitions.${index}.examples.${exampleIndex}.mean_example_sentence`}
                        rules={{
                          required: 'Vui lòng nhập nghĩa của câu',
                          validate: {
                            notEmpty: (value) =>
                              !value?.trim() ? 'Vui lòng nhập nghĩa của câu' : true,
                            vietnameseOnly: (value) =>
                              !isVietnamese(value) ? 'Vui lòng nhập nghĩa bằng tiếng Việt' : true
                          }
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <FormItem>
                            <FormLabel className="text-[#2D3748] font-medium">
                              Nghĩa của câu
                            </FormLabel>
                            <FormControl>
                              <CustomInput
                                value={field.value || ''}
                                onChange={field.onChange}
                                className={`min-h-[28px] bg-transparent border rounded-lg ${
                                  error ? 'border-red-500' : 'border-[#52aaa5]'
                                }`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                <CustomButton
                  type="button"
                  onClick={() => {
                    const examples = form.getValues(`definitions.${index}.examples`) || []
                    form.setValue(`definitions.${index}.examples`, [
                      ...examples,
                      { example_sentence: '', mean_example_sentence: '' }
                    ])
                  }}
                  templateStyle="tealGhost"
                  size="sm"
                  className="w-full flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Thêm ví dụ
                </CustomButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
