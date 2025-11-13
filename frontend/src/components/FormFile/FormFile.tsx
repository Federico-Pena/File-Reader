import { useState } from 'react'
import { useFileReader } from '@/hooks/useFileReader'
import { useLocalDataContext } from '@/hooks/useCustomContext'
import { getLocalStorageUsage } from '@/utils/updateLocalStorage'
import { MdSend, MdUploadFile } from 'react-icons/md'
import {
  Button,
  CloseButton,
  createListCollection,
  Dialog,
  Field,
  FieldHelperText,
  FileUpload,
  Flex,
  Icon,
  Input,
  Portal,
  Select,
  Stack,
  Text
} from '@chakra-ui/react'

type FormFileState = {
  file: File | null
  language: string
  initPage: string
  endPage: string
  show: boolean
}
export const FormFile = () => {
  const { clientMimeTypes, handleFileUpload } = useFileReader()
  const {
    state: { lastFiles }
  } = useLocalDataContext()
  const [state, setState] = useState<FormFileState>({
    file: null,
    language: 'spa',
    initPage: '',
    endPage: '',
    show: false
  })
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!state.file) return
    const initPageNumber = state.initPage
    const endPageNumber = state.endPage
    handleStateChange({ file: null, language: 'spa', initPage: '', endPage: '', show: false })
    await handleFileUpload(state.file, state.language, initPageNumber, endPageNumber)
  }

  const handleStateChange = (newState: Partial<FormFileState>) => {
    setState((prevState) => ({ ...prevState, ...newState }))
  }
  const ext = state.file?.name.split('.').pop()?.toLowerCase()
  const collection = createListCollection({
    items: [
      { label: 'Español', value: 'spa' },
      { label: 'Inglés', value: 'eng' }
    ]
  })
  return (
    <>
      <Dialog.Root size="md" placement="center" motionPreset="slide-in-bottom" open={state.show}>
        <Dialog.Trigger asChild>
          <Button
            disabled={window.speechSynthesis.speaking}
            onClick={() => handleStateChange({ show: true })}
            title="Cargar archivo"
            variant={'subtle'}
          >
            <MdUploadFile />
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Sube un archivo para leer</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" onClick={() => handleStateChange({ show: false })} />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <form onSubmit={handleUpload}>
                  <Stack gap={4} h={'full'} justifyContent={'space-between'}>
                    <Field.Root>
                      <FileUpload.Root
                        onFileChange={(file) => handleStateChange({ file: file.acceptedFiles[0] })}
                        aria-label="Sube un archivo para leer"
                        accept={clientMimeTypes.map((type: string) => `.${type.toLowerCase()}`)}
                      >
                        <FileUpload.Root
                          maxW="xl"
                          alignItems="stretch"
                          maxFiles={1}
                          onFileChange={(file) =>
                            handleStateChange({ file: file.acceptedFiles[0] })
                          }
                          aria-label="Sube un archivo para leer"
                          accept={clientMimeTypes.map((type: string) => `.${type.toLowerCase()}`)}
                        >
                          <FileUpload.HiddenInput />
                          <FileUpload.Dropzone>
                            <Icon size="md" color="fg.muted">
                              <MdUploadFile />
                            </Icon>
                            <FileUpload.DropzoneContent>
                              <Text>
                                Arrastra y suelta un archivo aquí, o haz clic para seleccionar
                              </Text>
                              <FieldHelperText>
                                Formatos: {clientMimeTypes.map((type: string) => type).join(' - ')}
                              </FieldHelperText>
                            </FileUpload.DropzoneContent>
                          </FileUpload.Dropzone>
                          <FileUpload.List />
                        </FileUpload.Root>
                      </FileUpload.Root>
                    </Field.Root>
                    <Field.Root>
                      <Select.Root
                        collection={collection}
                        onValueChange={(e) => handleStateChange({ language: e.items[0].value })}
                        value={[state.language]}
                      >
                        <Select.HiddenSelect />
                        <Select.Label>Idioma del archivo</Select.Label>
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select framework" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content zIndex={9999}>
                              {collection.items.map((item) => (
                                <Select.Item item={item} key={item.value}>
                                  {item.label}
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Field.Root>

                    {state.file && ext === 'pdf' && (
                      <>
                        <Flex gap={4}>
                          <Field.Root>
                            <Field.Label>Desde</Field.Label>
                            <Input
                              type="number"
                              min="1"
                              value={state.initPage}
                              onChange={(e) => handleStateChange({ initPage: e.target.value })}
                            />
                          </Field.Root>
                          <Field.Root>
                            <Field.Label>Hasta</Field.Label>
                            <Input
                              type="number"
                              min="1"
                              value={state.endPage}
                              onChange={(e) => handleStateChange({ endPage: e.target.value })}
                            />
                          </Field.Root>
                        </Flex>
                        <Text fontSize={'xs'} color={'InactiveCaptionText'}>
                          Para PDF escaneados se recomienda hacerlo de a pocas páginas.
                        </Text>
                      </>
                    )}

                    <Button type="submit" title="Cargar archivo">
                      Enviar <MdSend />
                    </Button>
                    <Flex w={'full'} justifyContent={'end'} gap={2}>
                      <Text fontSize={'xs'} color={'InactiveCaptionText'}>
                        Espacio: {getLocalStorageUsage()}
                      </Text>
                      <Text fontSize={'xs'} color={'InactiveCaptionText'}>
                        Archivos: {lastFiles.length}
                      </Text>
                    </Flex>
                  </Stack>
                </form>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
