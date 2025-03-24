const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:1234/api/v1'
    : 'https://file-reader-nu.vercel.app/api/v1'
const POST_FILE_URL = `${BASE_URL}/upload-file`
const GET_MIME_TYPES_URL = `${BASE_URL}/get-mime-types`

const requestFile = async (file: File): Promise<{ data?: TextPages[]; error?: string }> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(POST_FILE_URL, {
      method: 'POST',
      body: formData
    })
    if (response.status !== 200) {
      return {
        error: 'Ocurrió un error inesperado, inténtelo más tarde.'
      }
    }
    const { data, error } = await response.json()
    if (error || !data) {
      return {
        error: 'Ocurrió un error inesperado, inténtelo más tarde.'
      }
    }
    return { data }
  } catch (error) {
    return {
      error: 'Ocurrió un error inesperado, inténtelo más tarde.'
    }
  }
}

const getMimeTypes = async (): Promise<{ data?: string[]; error?: string }> => {
  try {
    const response = await fetch(GET_MIME_TYPES_URL)

    const { data, error } = await response.json()

    if (error || !data) {
      return {
        error: 'Ocurrió un error inesperado, inténtelo más tarde.'
      }
    }
    return { data }
  } catch (error) {
    return {
      error: 'Ocurrió un error inesperado, inténtelo más tarde.'
    }
  }
}
export { requestFile, getMimeTypes }
