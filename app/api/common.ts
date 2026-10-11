import { useHttp, unwrap, type Envelope } from './http'

export interface UploadImageDTO {
  path: string
}

export const useCommonApi = () => {
  const { $api } = useHttp()

  const commonApi = {
    async uploadImage(file: Blob, module: 'icon'): Promise<UploadImageDTO> {
      const body = new FormData()
      body.append('file', file, 'avatar.webp')
      body.append('module', module)

      const resp = await $api<UploadImageDTO | Envelope<UploadImageDTO>>('/common/uploadImage', {
        method: 'POST',
        body,
      })
      return unwrap(resp)
    },
  }

  return { commonApi }
}
