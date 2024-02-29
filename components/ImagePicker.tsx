import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

export interface ImagePropose {
  name: string
  src: string
}

export interface ImagePickerProps {
  images: ImagePropose[]
  // eslint-disable-next-line react/require-default-props
  onUpdate?(idx: number): void
}

const ImagePicker: FC<ImagePickerProps> = ({ images, onUpdate = () => {} }) => {
  const sizeMultiplier = 7
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
          width={16 * sizeMultiplier}
          height={9 * sizeMultiplier}
          src={image.src}
          onClick={() => setCurrImgIdx(i)}
          className="cursor-pointer rounded-lg shadow-2xl"
        />
      ))}
    </div>
  )
}

export default ImagePicker
