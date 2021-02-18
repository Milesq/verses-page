import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import Select from 'react-select'
import ThemeSwitch from './ThemeSwitch'
import { useScroll } from '../hooks'

const NavBar: FC = () => {
  const { y: scroll } = useScroll()
  const { locales, locale, ...router } = useRouter()
  const [theme, setTheme] = useState('')

  const langs = locales.map(lang => ({
    value: lang,
    label: lang.toUpperCase(),
  }))
  const currentLang = langs.find(lang => lang.value === locale)

  function selectLang({ value }: { value: string }) {
    document.cookie = `NEXT_LOCALE=${value}`
    router.push('/', '/', { locale: value })
  }

  function changeTheme(active: boolean) {
    document.querySelector('html').classList.toggle('dark')
    localStorage.setItem('theme', active ? 'dark' : 'light')
  }

  useEffect(() => {
    const selectedTheme = localStorage.getItem('theme')
    if (selectedTheme === 'dark') {
      changeTheme(true)
    }

    setTheme(selectedTheme)
  }, [])

  return (
    <>
      <nav
        className={`${
          scroll ? 'shadow-md' : 'md:shadow'
        } transition-shadow duration-300 h-16 fixed w-full grid grid-cols-3 px-3 bg-white dark:bg-gray-800 dark:text-white`}
      >
        <div className="flex items-center">
          <Image
            src="/verse.png"
            className="navbar-logo"
            width={40}
            height={40}
            alt="Verse's Logo"
          />
        </div>

        <span className="text-4xl font-aquire select-none flex items-center justify-center">
          Verse
        </span>

        <div className="flex items-center justify-end">
          <span className="pr-4">
            <Link href="/issue">Zgłoś błąd</Link>
          </span>
          <ThemeSwitch onChange={changeTheme} value={theme === 'dark'} />
          <div className="pl-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="react-select-language" />
            <Select
              aria-label=""
              id="react-select-language"
              instanceId="react-select-language"
              className="w-20"
              defaultValue={currentLang}
              options={langs}
              isSearchable={false}
              onChange={selectLang}
            />
          </div>
        </div>
      </nav>

      <div className="h-16" />
    </>
  )
}

export default NavBar
