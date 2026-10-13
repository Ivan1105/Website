import { useHttp, unwrap, type Envelope } from './http'

export interface UploadImageDTO {
  path: string
}

export type ImageUploadModule = 'icon' | 'banner'

export const useCommonApi = () => {
  const { $api } = useHttp()

  const commonApi = {
    async uploadImage(file: Blob, module: ImageUploadModule): Promise<UploadImageDTO> {
      const body = new FormData()
      body.append('file', file, module === 'icon' ? 'avatar.webp' : 'banner-upload')
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
