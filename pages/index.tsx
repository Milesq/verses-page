import { useRouter } from 'next/router'
import Head from 'next/head'
import type { FC } from 'react'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import reactSelectThemedStyle from '../styles/react-select-themed'
import allBooks from '../scripts/books.json'
import { BookData } from '../scripts/Books'
import Button from '../components/Button'
import { stringifyError } from '../errors'
import { downloadImage } from '../utils'

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

  interface BookFormData {
    book: string
    chapter: ChapterData
  }

  async function submit({
    book,
    chapter: { chapter, begVerse, endVerse },
  }: BookFormData) {
    const params = new URLSearchParams()
    params.append('book', book)
    params.append('chapter', chapter)
    params.append('verses', begVerse)
    params.append('verses', endVerse || begVerse)

    const api = `/api/get-verse/${locale}/?${params.toString()}`

    const { data, code } = await fetch(api).then(r => r.json())

    if (data !== undefined) {
      downloadImage(data)
    } else {
      const error = stringifyError(code)
      // eslint-disable-next-line no-alert
      alert(error)
    }
  }

  return (
    <>
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

      <div style={{ height: '200vh' }} className="dark:text-gray-50">
        ok
      </div>

      <div className="clear-both" />
    </>
  )
}

export default Home
