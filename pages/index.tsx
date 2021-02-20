import { useRouter } from 'next/router'
import Head from 'next/head'
import type { FC } from 'react'
import Select from 'react-select'
import Ripples from 'react-ripples'
import reactSelectThemedStyle from '../styles/react-select-themed'
import allBooks from '../scripts/books.json'
import BookData from '../scripts/BookData'

const Home: FC = () => {
  const { locale } = useRouter()
  const currentLang: BookData[] = allBooks[locale]

  const currentBooks = currentLang.map(({ name, path }) => ({
    label: name,
    value: path,
  }))

  return (
    <>
      <Head>
        <title>Verses - generowanie plansz z wersetami</title>
      </Head>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="react-select-book" />
      <Select
        styles={reactSelectThemedStyle}
        aria-label=""
        placeholder="Wyszukaj księgę"
        id="react-select-book"
        instanceId="react-select-book"
        options={currentBooks}
      />

      <input
        placeholder="Rozdział i werset (Przykład 30:2)"
        className="pretty-input"
        autoComplete="off"
        type="text"
      />

      <div
        className="
          float-right
          rounded-full
          overflow-hidden
        "
      >
        <Ripples>
          <button
            className="
              transition
              duration-150
              bg-green-600
              hover:bg-green-500
              dark:hover:bg-green-700
              shadow
              hover:shadow-md
              text-white
              px-3 py-2
              rounded-full
              focus:outline-none
            "
            type="submit"
          >
            Generuj
          </button>
        </Ripples>
      </div>
      <div style={{ height: '200vh' }} className="dark:text-gray-50">
        ok
      </div>

      <div className="clear-both" />
    </>
  )
}

export default Home
