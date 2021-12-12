import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { FC, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { LinearProgress } from '@rmwc/linear-progress'
import Swal from 'sweetalert2'

import allBooks from 'scripts/books.json'
import { BookData } from 'scripts/Books'

import reactSelectThemedStyle from '../styles/react-select-themed'
import Button from '../components/Button'
import ImageControlPanel from '../components/ImageControlPanel'
import { stringifyError } from '../errors'
import 'pretty-checkbox/dist/pretty-checkbox.min.css'
import { TemplateList } from '../common/api'
import { templateNametoUrl } from '../utils'

type ChapterData = Record<'chapter' | 'begVerse' | 'endVerse', string>

interface BookFormData {
  book: {
    value: string
    label: string
  }
  chapter: ChapterData
  'is-verse-editable': boolean
}

type StaticProps = {
  templates: TemplateList
}

export const getStaticProps: GetStaticProps = async () => {
  const apiUrl = `${process.env.IMAGE_API}/templates`

  const { data: templates } = await axios(apiUrl)

  return {
    props: {
      templates,
    },
  }
}

const Home: FC<StaticProps> = ({ templates }) => {
  const areChaptersAndVerseValid =
    /^(?<chapter>\d+):(?<begVerse>\d+)([-,](?<endVerse>\d+))?$/
  const { locale } = useRouter()
  const currentLang: BookData[] = allBooks[locale].data

  const currentBooks = currentLang.map(({ name, path }) => ({
    label: name,
    value: path,
  }))

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm()
  const [isFormInProgress, lockForm] = useState(false)
  const verseText = useRef('')
  const [isVerseEditorVisible, setVerseEditorVisibility] = useState(null)
  const [isControlPanelVisible, setControlPanelVisibility] = useState(false)
  const newVerseText = useRef(undefined)
  const { pathname, query, ...router } = useRouter()

  useEffect(() => {
    const { chapter, begVerse, endVerse } = query as ChapterData
    if (!chapter || !begVerse) return

    const chapterText = `${chapter}:${begVerse}${
      endVerse ? `-${endVerse}` : ''
    }`
    setValue('chapter', chapterText)
  }, [query])

  function getBookName(): string {
    const {
      book,
      chapter: { chapter, begVerse, endVerse },
    } = getValues()

    const cutChar = endVerse - begVerse === 1 ? ',' : '-'

    return `${book.label} ${chapter}:${begVerse}${
      endVerse ? `${cutChar}${endVerse}` : ''
    }`
  }

  async function submit({
    book,
    chapter: { chapter, begVerse, endVerse },
    'is-verse-editable': isVerseEditable,
  }: BookFormData) {
    if (isFormInProgress) {
      return
    }

    ;(window as any).gtag('event', 'boardCreated', {
      event_category: 'bbb',
      event_label: 'ccc',
    })
    router.push({
      pathname,
      query: {
        ...query,
        book: book.value,
        chapter,
        begVerse,
        endVerse,
      },
    })

    setVerseEditorVisibility(false)
    setControlPanelVisibility(false)
    lockForm(true)

    const params = new URLSearchParams()
    params.append('book', book.value)
    params.append('chapter', chapter)
    params.append('verses', begVerse)
    params.append('verses', endVerse || begVerse)

    const api = `/api/get-verse/${locale}/?${params.toString()}`

    const response = await fetch(api).then(r => r.json())
    if (response.error) {
      const error = stringifyError(response.code)
      Swal.fire('Oops...', error, 'error')
    } else if (!isVerseEditable) {
      verseText.current = response.data
      setControlPanelVisibility(true)
    } else {
      verseText.current = response.data
      setVerseEditorVisibility(true)
    }

    lockForm(false)
  }

  const bgImages = Object.keys(templates).map(name => ({
    name,
    src: templateNametoUrl(name),
  }))

  const controlPanelOptions = {
    images: {
      bgImages,
    },
    text: {
      quality: {
        label: 'Jakość',
        defaultValue: 'hd',
        values: [
          { label: '480p', value: 'sd' },
          { label: '720p', value: 'hd' },
          { label: '1080p', value: 'fullhd' },
          { label: 'Najwyższa', value: 'raw' },
        ],
      },
    },
  }

  return (
    <>
      {isFormInProgress && (
        <div className="w-full fixed top-0 left-0 z-50">
          <LinearProgress className="w-full" />
        </div>
      )}
      <Head>
        <title>Verses - generowanie plansz z wersetami</title>
      </Head>

      <form onSubmit={handleSubmit(submit)} className={errors.book && 'error'}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="react-select-book" />
        <Controller
          defaultValue=""
          name="book"
          control={control}
          rules={{
            validate: book => book !== '',
          }}
          render={({ field }) => (
            <Select
              {...field}
              styles={reactSelectThemedStyle}
              aria-label=""
              placeholder="Wyszukaj księgę"
              id="react-select-book"
              instanceId="react-select-book"
              options={currentBooks}
            />
          )}
        />

        <input
          placeholder="Rozdział i werset (Przykład 30:2-5)"
          className={`${errors.chapter && 'error'} pretty-input`}
          autoComplete="off"
          type="text"
          {...register('chapter', {
            required: true,
            pattern: areChaptersAndVerseValid,
            setValueAs(chapterData: string): ChapterData | string {
              const blank = /\s/g
              const chapterWithoutBlanks = chapterData.replace(blank, '')
              if (!areChaptersAndVerseValid.test(chapterWithoutBlanks))
                return chapterData

              return areChaptersAndVerseValid.exec(chapterWithoutBlanks)
                .groups as ChapterData
            },
          })}
        />

        <div className="pretty p-default p-curve p-fill p-smooth">
          <input
            {...register('is-verse-editable')}
            type="checkbox"
            className=" text-orange-600"
          />

          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <div className="state ml-2 text-gray-700 dark:text-gray-200">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="inline-flex items-center mt-3">
              Chcę edytować tekst wersetu
            </label>
          </div>
        </div>

        <Button containerClassName="float-right">Generuj</Button>
      </form>

      {isVerseEditorVisible && (
        <>
          <textarea
            ref={newVerseText}
            autoComplete="off"
            className="pretty-input"
            rows={10}
            defaultValue={verseText.current}
          />

          <Button
            containerClassName="float-right"
            onClick={() => {
              verseText.current = newVerseText.current.value
              setVerseEditorVisibility(false)
              setControlPanelVisibility(true)
            }}
          >
            Gotowe
          </Button>
        </>
      )}

      <div className="clear-both mt-8" />

      {isControlPanelVisible && (
        <ImageControlPanel
          controls={controlPanelOptions}
          getImageRef={({ quality, bgImages: bgImage }, preview = false) =>
            `/api/get-verse/board?sign=${encodeURIComponent(
              getBookName()
            )}&verse=${encodeURIComponent(verseText.current)}&quality=${
              preview ? 'sd' : quality
            }&type=${bgImage}`
          }
        />
      )}
    </>
  )
}

export default Home
