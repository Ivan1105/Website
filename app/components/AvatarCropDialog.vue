<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  imageSrc: string
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [file: Blob]
  replace: []
}>()

const cropContainer = useTemplateRef<HTMLDivElement>('crop-container')
const cropImage = useTemplateRef<HTMLImageElement>('crop-image')
const previewCanvas = useTemplateRef<HTMLCanvasElement>('preview-canvas')

const initializing = ref(false)
const processing = ref(false)
const localError = ref<string | null>(null)
const cropReady = ref(false)

let cropper: import('cropperjs').default | null = null
let selection: import('cropperjs').CropperSelection | null = null
let cropperImage: import('cropperjs').CropperImage | null = null
let previewFrame: number | null = null
let boundaryFrame: number | null = null
let initializationId = 0
let constrainingSelection = false

const maxUploadSize = 10 * 1024 * 1024
const outputQualities = [0.92, 0.82, 0.72, 0.62, 0.52, 0.5]

const cropperTemplate = `
  <cropper-canvas background>
    <cropper-image rotatable scalable skewable translatable></cropper-image>
    <cropper-shade hidden></cropper-shade>
    <cropper-selection initial-aspect-ratio="1" aspect-ratio="1" initial-coverage="0.8" movable resizable precise>
      <cropper-grid role="grid" bordered covered></cropper-grid>
      <cropper-crosshair centered></cropper-crosshair>
      <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
      <cropper-handle action="n-resize"></cropper-handle>
      <cropper-handle action="e-resize"></cropper-handle>
      <cropper-handle action="s-resize"></cropper-handle>
      <cropper-handle action="w-resize"></cropper-handle>
      <cropper-handle action="ne-resize"></cropper-handle>
      <cropper-handle action="nw-resize"></cropper-handle>
      <cropper-handle action="se-resize"></cropper-handle>
      <cropper-handle action="sw-resize"></cropper-handle>
    </cropper-selection>
  </cropper-canvas>
`

const visibleError = computed(() => localError.value || props.error)
const busy = computed(() => props.loading || processing.value)

const waitForImage = async (image: HTMLImageElement) => {
  if (!image.complete) {
    await new Promise<void>((resolve, reject) => {
      image.addEventListener('load', () => resolve(), { once: true })
      image.addEventListener('error', () => reject(new Error('图片无法解码，请重新选择')), { once: true })
    })
  }

  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error('图片无法解码，请重新选择')
  }

  if (typeof image.decode === 'function') {
    await image.decode()
  }
}

const clearPreview = () => {
  const canvas = previewCanvas.value
  const context = canvas?.getContext('2d')
  if (canvas && context) {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}

interface CropBounds {
  x: number
  y: number
  width: number
  height: number
}

interface SelectionRect extends CropBounds {}

const getImageBounds = (): CropBounds | null => {
  const canvas = cropper?.getCropperCanvas()
  if (!canvas || !cropperImage) return null

  const canvasRect = canvas.getBoundingClientRect()
  const imageRect = cropperImage.getBoundingClientRect()
  if (!canvasRect.width || !canvasRect.height || !imageRect.width || !imageRect.height) return null

  const left = Math.max(imageRect.left, canvasRect.left)
  const top = Math.max(imageRect.top, canvasRect.top)
  const right = Math.min(imageRect.right, canvasRect.right)
  const bottom = Math.min(imageRect.bottom, canvasRect.bottom)
  if (right <= left || bottom <= top) return null

  const scaleX = canvas.offsetWidth / canvasRect.width
  const scaleY = canvas.offsetHeight / canvasRect.height

  return {
    x: (left - canvasRect.left) * scaleX,
    y: (top - canvasRect.top) * scaleY,
    width: (right - left) * scaleX,
    height: (bottom - top) * scaleY,
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const getConstrainedSelection = (candidate: SelectionRect): SelectionRect | null => {
  const bounds = getImageBounds()
  if (!bounds) return null

  const size = Math.min(candidate.width, candidate.height, bounds.width, bounds.height)
  if (!Number.isFinite(size) || size <= 0) return null

  return {
    x: clamp(candidate.x, bounds.x, bounds.x + bounds.width - size),
    y: clamp(candidate.y, bounds.y, bounds.y + bounds.height - size),
    width: size,
    height: size,
  }
}

const getConstrainedResize = (candidate: SelectionRect, current: SelectionRect): SelectionRect | null => {
  const bounds = getImageBounds()
  if (!bounds) return null

  const tolerance = 1.5
  const currentRight = current.x + current.width
  const currentBottom = current.y + current.height
  const currentCenterX = current.x + current.width / 2
  const currentCenterY = current.y + current.height / 2
  const candidateRight = candidate.x + candidate.width
  const candidateBottom = candidate.y + candidate.height
  const candidateCenterX = candidate.x + candidate.width / 2
  const candidateCenterY = candidate.y + candidate.height / 2

  const keepsLeft = Math.abs(candidate.x - current.x) <= tolerance
  const keepsRight = Math.abs(candidateRight - currentRight) <= tolerance
  const keepsTop = Math.abs(candidate.y - current.y) <= tolerance
  const keepsBottom = Math.abs(candidateBottom - currentBottom) <= tolerance
  const keepsCenterX = Math.abs(candidateCenterX - currentCenterX) <= tolerance
  const keepsCenterY = Math.abs(candidateCenterY - currentCenterY) <= tolerance

  const maxWidth = keepsLeft
    ? bounds.x + bounds.width - current.x
    : keepsRight
      ? currentRight - bounds.x
      : keepsCenterX
        ? 2 * Math.min(currentCenterX - bounds.x, bounds.x + bounds.width - currentCenterX)
        : bounds.width
  const maxHeight = keepsTop
    ? bounds.y + bounds.height - current.y
    : keepsBottom
      ? currentBottom - bounds.y
      : keepsCenterY
        ? 2 * Math.min(currentCenterY - bounds.y, bounds.y + bounds.height - currentCenterY)
        : bounds.height
  const size = Math.min(candidate.width, candidate.height, maxWidth, maxHeight, bounds.width, bounds.height)
  if (!Number.isFinite(size) || size <= 0) return null

  const x = keepsLeft
    ? current.x
    : keepsRight
      ? currentRight - size
      : keepsCenterX
        ? currentCenterX - size / 2
        : candidate.x
  const y = keepsTop
    ? current.y
    : keepsBottom
      ? currentBottom - size
      : keepsCenterY
        ? currentCenterY - size / 2
        : candidate.y

  return getConstrainedSelection({ x, y, width: size, height: size })
}

const hasSelectionChanged = (current: SelectionRect, next: SelectionRect) => {
  return Math.abs(current.x - next.x) > 0.25
    || Math.abs(current.y - next.y) > 0.25
    || Math.abs(current.width - next.width) > 0.25
    || Math.abs(current.height - next.height) > 0.25
}

const constrainSelectionToImage = () => {
  if (!selection || constrainingSelection) return

  const current = {
    x: selection.x,
    y: selection.y,
    width: selection.width,
    height: selection.height,
  }
  const constrained = getConstrainedSelection(current)
  if (!constrained) return

  if (hasSelectionChanged(current, constrained)) {
    constrainingSelection = true
    selection.$change(constrained.x, constrained.y, constrained.width, constrained.height, 1, true)
    constrainingSelection = false
  }
}

const initializeSelectionWithinImage = () => {
  if (!selection) return
  const bounds = getImageBounds()
  if (!bounds) return

  const size = Math.min(bounds.width, bounds.height) * 0.8
  const x = bounds.x + (bounds.width - size) / 2
  const y = bounds.y + (bounds.height - size) / 2

  constrainingSelection = true
  selection.$change(x, y, size, size, 1, true)
  constrainingSelection = false
  renderPreview()
}

const scheduleBoundaryConstraint = () => {
  if (!import.meta.client) return
  if (boundaryFrame !== null) cancelAnimationFrame(boundaryFrame)

  boundaryFrame = requestAnimationFrame(() => {
    boundaryFrame = null
    constrainSelectionToImage()
    renderPreview()
  })
}

const handleSelectionChange = (event: Event) => {
  if (!selection || constrainingSelection) {
    renderPreview()
    return
  }

  const detail = (event as CustomEvent<SelectionRect>).detail
  const current = {
    x: selection.x,
    y: selection.y,
    width: selection.width,
    height: selection.height,
  }
  const isResize = detail
    && (Math.abs(detail.width - current.width) > 0.25 || Math.abs(detail.height - current.height) > 0.25)
  const constrained = detail
    ? isResize
      ? getConstrainedResize(detail, current)
      : getConstrainedSelection(detail)
    : null
  if (detail && constrained && hasSelectionChanged(detail, constrained)) {
    event.preventDefault()
    constrainingSelection = true
    selection.$change(constrained.x, constrained.y, constrained.width, constrained.height, 1, true)
    constrainingSelection = false
  }
  renderPreview()
}

const renderPreview = () => {
  if (!selection || !previewCanvas.value || !import.meta.client) return

  if (previewFrame !== null) {
    cancelAnimationFrame(previewFrame)
  }

  previewFrame = requestAnimationFrame(async () => {
    previewFrame = null
    if (!selection || !previewCanvas.value) return

    try {
      const source = await selection.$toCanvas({ width: 160, height: 160 })
      const context = previewCanvas.value.getContext('2d')
      if (!context) return
      context.clearRect(0, 0, 160, 160)
      context.drawImage(source, 0, 0, 160, 160)
    }
    catch {
      clearPreview()
    }
  })
}

const destroyCropper = () => {
  initializationId += 1
  if (previewFrame !== null && import.meta.client) {
    cancelAnimationFrame(previewFrame)
    previewFrame = null
  }
  if (boundaryFrame !== null && import.meta.client) {
    cancelAnimationFrame(boundaryFrame)
    boundaryFrame = null
  }
  selection?.removeEventListener('change', handleSelectionChange)
  cropperImage?.removeEventListener('transform', scheduleBoundaryConstraint)
  selection = null
  cropperImage = null
  cropper?.destroy()
  cropper = null
  cropReady.value = false
  clearPreview()
}

const initializeCropper = async () => {
  if (!import.meta.client || !props.modelValue || !props.imageSrc) return

  destroyCropper()
  const currentInitialization = initializationId
  initializing.value = true
  localError.value = null

  try {
    await nextTick()
    const image = cropImage.value
    const container = cropContainer.value
    if (!image || !container) return

    await waitForImage(image)
    if (currentInitialization !== initializationId || !props.modelValue) return

    const { default: Cropper } = await import('cropperjs')
    if (currentInitialization !== initializationId || !props.modelValue) return

    cropper = new Cropper(image, {
      container,
      template: cropperTemplate,
    })
    selection = cropper.getCropperSelection()
    cropperImage = cropper.getCropperImage()
    if (!selection || !cropperImage) throw new Error('裁剪区域初始化失败，请重新选择图片')

    selection.aspectRatio = 1
    selection.initialAspectRatio = 1
    selection.addEventListener('change', handleSelectionChange)
    cropperImage.addEventListener('transform', scheduleBoundaryConstraint)
    await cropperImage.$ready()
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    if (currentInitialization !== initializationId || !props.modelValue) return

    initializeSelectionWithinImage()
    cropReady.value = true
  }
  catch (error) {
    if (currentInitialization !== initializationId) return
    localError.value = error instanceof Error ? error.message : '图片加载失败，请重新选择'
    destroyCropper()
    initializing.value = false
  }
  finally {
    if (currentInitialization === initializationId) {
      initializing.value = false
    }
  }
}

const zoom = (scale: number) => {
  selection?.$zoom(scale)
}

const reset = () => {
  cropperImage?.$resetTransform()
  requestAnimationFrame(initializeSelectionWithinImage)
}

const canvasToWebp = (canvas: HTMLCanvasElement, quality: number) => new Promise<Blob>((resolve, reject) => {
  canvas.toBlob((blob) => {
    if (blob) resolve(blob)
    else reject(new Error('当前浏览器无法生成 WebP 图片'))
  }, 'image/webp', quality)
})

const createAvatarBlob = async () => {
  if (!selection) throw new Error('裁剪区域尚未准备完成')

  constrainSelectionToImage()
  const canvas = await selection.$toCanvas({ width: 512, height: 512 })
  let output: Blob | null = null

  for (const quality of outputQualities) {
    output = await canvasToWebp(canvas, quality)
    if (output.size <= maxUploadSize) return output
  }

  throw new Error('裁剪后的图片超过 10 MB，请选择内容更简单的图片')
}

const confirmCrop = async () => {
  if (!cropReady.value || busy.value) return

  processing.value = true
  localError.value = null
  try {
    emit('confirm', await createAvatarBlob())
  }
  catch (error) {
    localError.value = error instanceof Error ? error.message : '头像处理失败，请重试'
  }
  finally {
    processing.value = false
  }
}

const updateDialog = (value: boolean) => {
  if (!value && !busy.value) emit('update:modelValue', false)
}

watch(
  () => [props.modelValue, props.imageSrc] as const,
  ([open, source]) => {
    if (open && source) initializeCropper()
    else destroyCropper()
  },
  { flush: 'post' },
)

onBeforeUnmount(destroyCropper)
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    :persistent="busy"
    max-width="880"
    @update:model-value="updateDialog"
  >
    <v-card class="crop-dialog">
      <v-card-title class="crop-dialog-title">
        裁剪头像
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          aria-label="关闭"
          title="关闭"
          :disabled="busy"
          @click="updateDialog(false)"
        />
      </v-card-title>

      <v-card-text class="crop-dialog-content">
        <div class="crop-workspace">
          <div ref="crop-container" class="crop-stage">
            <img
              ref="crop-image"
              :src="imageSrc"
              alt="待裁剪头像"
              class="crop-source"
            >
            <div v-if="initializing" class="crop-loading">
              <v-progress-circular indeterminate color="primary" />
            </div>
          </div>

          <aside class="crop-sidebar">
            <span class="preview-label">预览</span>
            <canvas
              ref="preview-canvas"
              width="160"
              height="160"
              class="avatar-preview"
              aria-label="头像裁剪预览"
            />

            <div class="crop-controls">
              <v-btn
                icon="mdi-magnify-minus-outline"
                variant="outlined"
                size="small"
                aria-label="缩小图片"
                title="缩小"
                :disabled="!cropReady || busy"
                @click="zoom(-0.1)"
              />
              <v-btn
                icon="mdi-magnify-plus-outline"
                variant="outlined"
                size="small"
                aria-label="放大图片"
                title="放大"
                :disabled="!cropReady || busy"
                @click="zoom(0.1)"
              />
              <v-btn
                icon="mdi-restore"
                variant="outlined"
                size="small"
                aria-label="重置裁剪"
                title="重置"
                :disabled="!cropReady || busy"
                @click="reset"
              />
            </div>
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-image-sync-outline"
              :disabled="busy"
              @click="emit('replace')"
            >
              重新选择
            </v-btn>
          </aside>
        </div>

        <v-alert
          v-if="visibleError"
          type="error"
          variant="tonal"
          density="compact"
          class="crop-error"
        >
          {{ visibleError }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="crop-dialog-actions">
        <v-btn variant="text" :disabled="busy" @click="updateDialog(false)">
          取消
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="busy"
          :disabled="!cropReady || busy"
          @click="confirmCrop"
        >
          保存头像
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.crop-dialog {
  overflow: hidden;
}

.crop-dialog-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 12px;
  font-size: 1.2rem;
  font-weight: 700;
}

.crop-dialog-content {
  padding: 8px 20px 16px !important;
}

.crop-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 176px;
  gap: 24px;
  align-items: center;
}

.crop-stage {
  position: relative;
  height: min(54vh, 480px);
  min-height: 340px;
  overflow: hidden;
  background: #182522;
  border-radius: 6px;
}

.crop-source {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.crop-stage :deep(cropper-canvas) {
  width: 100%;
  height: 100%;
}

.crop-loading {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  background: rgba(24, 37, 34, 0.7);
}

.crop-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.preview-label {
  align-self: flex-start;
  color: rgba(var(--v-theme-on-surface), 0.65);
  font-size: 0.8rem;
  font-weight: 700;
}

.avatar-preview {
  width: 160px;
  height: 160px;
  background: rgb(var(--v-theme-surface-variant));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 50%;
}

.crop-controls {
  display: flex;
  gap: 10px;
}

.crop-error {
  margin-top: 16px;
}

.crop-dialog-actions {
  justify-content: flex-end;
  gap: 8px;
  padding: 0 20px 18px;
}

@media (max-width: 700px) {
  .crop-workspace {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .crop-stage {
    height: min(46vh, 390px);
    min-height: 280px;
  }

  .crop-sidebar {
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 10px 16px;
    justify-items: start;
  }

  .preview-label {
    display: none;
  }

  .avatar-preview {
    grid-row: 1;
    width: 88px;
    height: 88px;
  }

  .crop-controls {
    align-self: center;
    justify-self: end;
  }

  .crop-sidebar > .v-btn {
    grid-column: 2;
    justify-self: end;
  }
}
</style>
