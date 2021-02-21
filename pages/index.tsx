import { useRouter } from 'next/router'
import Head from 'next/head'
import type { FC } from 'react'
import Select from 'react-select'
import reactSelectThemedStyle from '../styles/react-select-themed'
import allBooks from '../scripts/books.json'
import { BookData } from '../scripts/Books'
import Button from '../components/Button'

const Home: FC = () => {
  const { locale } = useRouter()
  const currentLang: BookData[] = allBooks[locale].data

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

      <Button>Generuj</Button>

      <div style={{ height: '200vh' }} className="dark:text-gray-50">
        ok
      </div>

      <div className="clear-both" />
    </>
  )
}

export default Home
