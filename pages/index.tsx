import { useRouter } from 'next/router'
import Head from 'next/head'
import { FC, useRef, useState } from 'react'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { LinearProgress } from '@rmwc/linear-progress'
import Swal from 'sweetalert2'
import reactSelectThemedStyle from '../styles/react-select-themed'
import allBooks from '../scripts/books.json'
import { BookData } from '../scripts/Books'
import Button from '../components/Button'
import ImageControlPanel from '../components/ImageControlPanel'
import { stringifyError } from '../errors'
import '../node_modules/pretty-checkbox/dist/pretty-checkbox.min.css'

type ChapterData = Record<'chapter' | 'begVerse' | 'endVerse', string>

const Home: FC = () => {
  const areChaptersAndVerseValid = /^(?<chapter>\d+):(?<begVerse>\d+)(-(?<endVerse>\d+))?$/
  const { locale } = useRouter()
  const currentLang: BookData[] = allBooks[locale].data

  const currentBooks = currentLang.map(({ name, path }) => ({
    label: name,
    value: path,
  }))

  const { register, handleSubmit, errors, control, getValues } = useForm()
  const [isFormInProgress, lockForm] = useState(false)
  const verseText = useRef('')
  const [isVerseEditorVisible, setVerseEditorVisibility] = useState(null)
  const [isControlPanelVisible, setControlPanelVisibility] = useState(false)
  const newVerseText = useRef(undefined)

  function getBookName(): string {
    const {
      book,
      chapter: { chapter, begVerse, endVerse },
    } = getValues()

    return `${book.label} ${chapter}:${begVerse}${
      endVerse ? `-${endVerse}` : ''
    }`
  }

  interface BookFormData {
    book: {
      value: string
      label: string
    }
    chapter: ChapterData
    'is-verse-editable': boolean
  }

  async function submit({
    book,
    chapter: { chapter, begVerse, endVerse },
    'is-verse-editable': isVerseEditable,
  }: BookFormData) {
    if (isFormInProgress) {
      return
    }

    setVerseEditorVisibility(false)
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

  const controlPanelOptions = {
    quality: {
      label: 'Jakość',
      values: [
        { label: '480p', value: 'sd' },
        { label: '720p', value: 'hd' },
        { label: '1080p', value: 'fullhd' },
        { label: 'Najwyższa', value: 'raw' },
      ],
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
          render={({ onChange, onBlur, value }) => (
            <Select
              onChange={onChange}
              onBlur={onBlur}
              value={value}
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
          name="chapter"
          ref={register({
            required: true,
            pattern: areChaptersAndVerseValid,
            setValueAs(chapterData: string): ChapterData | string {
              if (!areChaptersAndVerseValid.test(chapterData))
                return chapterData

              return areChaptersAndVerseValid.exec(chapterData)
                .groups as ChapterData
            },
          })}
        />

        <div className="pretty p-default p-curve p-fill p-smooth">
          <input
            ref={register()}
            name="is-verse-editable"
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
          getImageRef={({ quality }) =>
            `/api/get-verse/board?sign=${encodeURIComponent(
              getBookName()
            )}&verse=${encodeURIComponent(
              verseText.current
            )}&quality=${quality}`
          }
        />
      )}
    </>
  )
}

export default Home
