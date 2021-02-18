import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import Select from 'react-select'
import Ripples from 'react-ripples'
import { useRouter } from 'next/router'
import ThemeSwitch from '../ThemeSwitch'
import Hamburger from '../Hamburger'

const NavBar: FC = () => {
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
      <div className="flex items-center justify-end md:hidden">
        <Hamburger type="spring" />
      </div>

      <div className="hidden md:flex items-center justify-end">
        <span className="pr-4">
          <Ripples className="p-2">
            <Link href="/issue">Zgłoś błąd</Link>
          </Ripples>
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
    </>
  )
}

export default NavBar
