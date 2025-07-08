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
export const CreatePhrasePartOfSpeechSection = ({
  control,
  index,
  partsOfSpeechOptions
}: Props) => (
  <FormField
    control={control}
    name={`definitions.${index}.parts_of_speech`}
    rules={{ required: 'Vui lòng chọn loại cụm từ' }}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <CustomCombobox
            label="Loại cụm từ"
            value={field.value}
            options={partsOfSpeechOptions.map((o) => ({
              value: o.value,
              label: o.label
            }))}
            onChange={field.onChange}
            className="mb-2"
            placeholder="Chọn loại cụm từ"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)
