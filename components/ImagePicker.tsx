import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

export interface ImagePropose {
  name: string
  src: string
}

export interface ImagePickerProps {
  images: ImagePropose[]
  onUpdate?(idx: number): void
  allowUpload?: boolean
}

const ImagePicker: FC<ImagePickerProps> = ({
  images,
  onUpdate,
  allowUpload = false,
}) => {
  const sizeMultiplier = 7
  const size = {
    w: 16 * sizeMultiplier,
    h: 9 * sizeMultiplier,
  }
  const [currImgIdx, setCurrImgIdx] = useState(0)

  useEffect(() => {
    setCurrImgIdx(0)
  }, [images])

  useEffect(() => {
    onUpdate?.(currImgIdx)
  }, [currImgIdx])

  return (
    <div className="inline-flex gap-1">
      {images.map((image, i) => (
        <Image
          key={image.name}
          width={size.w}
          height={size.h}
          src={image.src}
          onClick={() => setCurrImgIdx(i)}
          className="cursor-pointer rounded-lg shadow-2xl"
        />
      ))}

      {allowUpload && (
        <div
          className="text-white ring"
          style={{
            width: size.w,
            height: size.h,
          }}
        >
          +
        </div>
      )}
    </div>
  )
}

export default ImagePicker
