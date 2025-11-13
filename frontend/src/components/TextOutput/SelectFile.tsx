import { useLocalDataContext } from '@/hooks/useCustomContext'
import { createListCollection, Portal, Select } from '@chakra-ui/react'

export const SelectFile = () => {
  const {
    state: { lastFiles, nameFile },
    dispatch
  } = useLocalDataContext()

  const handleChangeFile = (fileName: string) => {
    if (fileName) {
      dispatch({ type: 'CHANGE_FILE', payload: { nameFile: fileName } })
    }
  }
  const collection = createListCollection({
    items: lastFiles.map((file) => ({ label: file.nameFile, value: file.nameFile }))
  })
  return (
    <Select.Root
      disabled={window.speechSynthesis.speaking}
      collection={collection}
      onValueChange={(e) => handleChangeFile(e.items[0].value)}
      value={[nameFile]}
    >
      <Select.HiddenSelect />
      <Select.Label>Archivos guardados</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Archivos guardados" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content zIndex={9999}>
            {collection.items.map((item, i) => (
              <Select.Item item={item} key={`${item.value}-${i}`}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}
