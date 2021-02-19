import { useRouter } from 'next/router'
import Head from 'next/head'
import type { FC } from 'react'
import Select, { StylesConfig } from 'react-select'
import Ripples from 'react-ripples'
import allBooks from '../scripts/books.json'
import BookData from '../scripts/BookData'

const Home: FC = () => {
  const { locale } = useRouter()
  const currentLang: BookData[] = allBooks[locale]

  const currentBooks = currentLang.map(({ name, path }) => ({
    label: name,
    value: path,
  }))

  const selectStyles: StylesConfig<Record<string, string>, false> = {
    control: styles => ({
      ...styles,
      backgroundColor: 'var(--input-bg)',
      borderColor: 'var(--input-border-color)',
    }),
    singleValue: styles => ({
      ...styles,
      color: 'var(--input-text)',
    }),
    placeholder: styles => ({
      ...styles,
      color: '#9CA3AF',
    }),
    option: styles => ({
      ...styles,
      color: 'var(--input-text)',
      backgroundColor: 'var(--input-bg)',
      cursor: 'pointer',
      ':hover': {
        ...styles[':hover'],
        backgroundColor: 'var(--input-bg-hover)',
      },
      ':focus': {
        ...styles[':focus'],
        backgroundColor: 'var(--input-bg-focus)',
      },
    }),
    menuList: styles => ({
      ...styles,
      backgroundColor: 'var(--input-bg)',
    }),
  }

  return (
    <>
      <Head>
        <title>Verses - generowanie plansz z wersetami</title>
      </Head>
      <div className="mt-4 container px-8 lg:px-52 xl:px-96 mx-auto">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="react-select-book" />
        <Select
          styles={selectStyles}
          aria-label=""
          placeholder="Wyszukaj księgę"
          id="react-select-book"
          instanceId="react-select-book"
          options={currentBooks}
        />

        <input
          placeholder="Rozdział i werset (Przykład 30:2)"
          className="
            w-full
            appearance-none
            my-3
            border-solid
            border
            border-input
            hover:border-input-darken
            rounded
            py-2
            px-3
            text-gray-700
            leading-tight
            focus:outline-none
            focus:ring
            focus:shadow-outline

            dark:text-gray-50
            dark:bg-gray-700
            dark:border-gray-500
            dark:hover:border-input-darkhover
          "
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
      </div>
    </>
  )
}

export default Home
