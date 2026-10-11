export const useAssetUrl = () => {
  const config = useRuntimeConfig()
  const baseUrl = String(config.public.ossUrl || '').replace(/\/+$/, '')

  const assetUrl = (
    path?: string | null,
    directory?: string | null,
  ): string => {
    const value = path?.trim()
    if (!value) return ''

    if (/^(?:https?:)?\/\//i.test(value) || /^(?:data|blob):/i.test(value)) {
      return value
    }

    const normalizedPath = value.replace(/^\/+/, '')
    const normalizedDirectory = directory
      ?.trim()
      .replace(/^\/+|\/+$/g, '')

    const objectPath = normalizedDirectory
      && normalizedPath !== normalizedDirectory
      && !normalizedPath.startsWith(`${normalizedDirectory}/`)
      ? `${normalizedDirectory}/${normalizedPath}`
      : normalizedPath

    return `${baseUrl}/${objectPath}`
  }

  return { assetUrl }
}
