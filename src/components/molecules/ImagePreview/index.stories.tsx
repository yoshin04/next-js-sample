import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ImagePreview from './'
import Dropzone from 'components/molecules/Dropzone'

export default {
  title: 'Molecules/ImagePreview',
  argTypes: {
    src: {
      control: { type: 'text' },
      description: '画像URL',
      table: {
        type: { summary: 'string' },
      },
    },
    alt: {
      control: { type: 'text' },
      description: '代替テキスト',
      table: {
        type: { summary: 'string' },
      },
    },
    height: {
      control: { type: 'number' },
      description: '縦幅',
      table: {
        type: { summary: 'number' },
      },
    },
    width: {
      control: { type: 'number' },
      description: '横幅',
      table: {
        type: { summary: 'number' },
      },
    },
    onRemove: {
      description: '削除ボタンを押したときのイベントハンドラ',
      table: {
        type: { summary: 'function' },
      },
    },
  },
} as ComponentMeta<typeof ImagePreview>

const Container = styled.div`
  width: 288px;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
`

interface Image {
  file?: File
  src?: string
}

const Template: ComponentStory<typeof ImagePreview> = (args) => {
  const [files, setFiles] = useState<File[]>([])
  const [images, setImages] = useState<Image[]>([])

  useEffect(() => {
    const newImages = [...images]

    for (const file of files) {
      const index = newImages.findIndex((img: Image) => img.file === file)

      if (index === -1) {
        newImages.push({
          file,
          src: URL.createObjectURL(file),
        })
      }
    }
    setImages(newImages)
  }, [files])

  const handleRemove = (src: string) => {
    const image = images.find((img: Image) => img.src === src)

    if (image !== undefined) {
      setImages((images) => images.filter((img) => img.src !== image.src))
      setFiles((files) => files.filter((file: File) => file !== image.file))
    }

    args && args.onRemove && args.onRemove(src)
  }

  return (
    <Container>
      <Dropzone value={files} onDrop={(fileList) => setFiles(fileList)} />
      {images.map((image, i) => (
        <ImagePreview key={i} src={image.src} width="100px" {...args} onRemove={handleRemove} />
      ))}
    </Container>
  )
}

export const WithDropzone = Template.bind({})
WithDropzone.args = {}
