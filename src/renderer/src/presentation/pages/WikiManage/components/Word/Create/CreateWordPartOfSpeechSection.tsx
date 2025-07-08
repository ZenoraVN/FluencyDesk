// FluencyDev/src/presentation/pages/WikiManage/components/Word/Create/CreateWordPartOfSpeechSection.tsx
import { FormField, FormItem, FormControl, FormMessage } from '../../../../../components/ui/form'
import CustomCombobox from '../../../../../componentsCombobox/CustomCombobox'

export type PartOfSpeechOption = {
  value: string
  label: string
  color: string
}

interface Props {
  control: any
  index: number
  partsOfSpeechOptions: PartOfSpeechOption[]
}

export const CreateWordPartOfSpeechSection = ({ control, index, partsOfSpeechOptions }: Props) => (
  <FormField
    control={control}
    name={`definitions.${index}.parts_of_speech`}
    rules={{ required: 'Vui lòng chọn loại từ' }}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <CustomCombobox
            label="Loại từ"
            value={field.value}
            options={partsOfSpeechOptions.map((o) => ({
              value: o.value,
              label: o.label
            }))}
            onChange={field.onChange}
            className="mb-2"
            placeholder="Chọn loại từ"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)
