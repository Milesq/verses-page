import { useRouter } from 'next/router'
import Head from 'next/head'
import { FC, useState } from 'react'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { LinearProgress } from '@rmwc/linear-progress'
import Swal from 'sweetalert2'
import reactSelectThemedStyle from '../styles/react-select-themed'
import allBooks from '../scripts/books.json'
import { BookData } from '../scripts/Books'
import Button from '../components/Button'
import { stringifyError } from '../errors'

type ChapterData = Record<'chapter' | 'begVerse' | 'endVerse', string>

const Home: FC = () => {
  const areChaptersAndVerseValid = /^(?<chapter>\d+):(?<begVerse>\d+)(-(?<endVerse>\d+))?$/
  const { locale } = useRouter()
  const currentLang: BookData[] = allBooks[locale].data

  const currentBooks = currentLang.map(({ name, path }) => ({
    label: name,
    value: path,
  }))

  const { register, handleSubmit, errors, control } = useForm()
  const [isFormInProgress, lockForm] = useState(false)

  interface BookFormData {
    book: string
    chapter: ChapterData
  }

  async function submit({
    book,
    chapter: { chapter, begVerse, endVerse },
  }: BookFormData) {
    if (isFormInProgress) {
      return
    }

    lockForm(true)

    const params = new URLSearchParams()
    params.append('book', book)
    params.append('chapter', chapter)
    params.append('verses', begVerse)
    params.append('verses', endVerse || begVerse)

    const api = `/api/get-verse/${locale}/?${params.toString()}`

    const response = await fetch(api)

    if (response.headers.get('content-type').startsWith('application/json')) {
      const { code } = await response.json()
      const error = stringifyError(code)
      Swal.fire('Oops...', error, 'error')
    } else {
      const filename = decodeURIComponent(response.headers.get('X-Filename'))

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = filename
      document.body.appendChild(a)

      a.click()
      URL.revokeObjectURL(url)
    }

    lockForm(false)
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
            setValueAs: book => book.value,
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

        <Button>Generuj</Button>
      </form>

      <div className="clear-both" />
    </>
  )
}

export default Home
