import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import Select from 'react-select'
import Ripples from 'react-ripples'
import { useRouter } from 'next/router'
import ThemeSwitch from '../ThemeSwitch'
import Hamburger from '../Hamburger'
import reactSelectThemedStyle from '../../styles/react-select-themed'
import { useSchanged } from '../../hooks'

const NavBar: FC = () => {
  const { locales, locale, route, ...router } = useRouter()
  const [theme, setTheme] = useState('')
  const [menuOpened, setMenuOpened] = useState(false)
  const [overlayOpacity, setOverlayOpacity] = useState('0')

  const langs = locales.map(lang => ({
    value: lang,
    label: lang.toUpperCase(),
  }))
  const currentLang = langs.find(lang => lang.value === locale)

  function selectLang({ value }: { value: string }) {
    document.cookie = `NEXT_LOCALE=${value}`
    router.push(route, route, { locale: value })
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

  useSchanged(() => {
    setOverlayOpacity(overlayOpacity === '30' ? '0' : '30')
  }, [menuOpened])

  const Tr = () => (
    <div className="md:hidden bg-gray-300 dark:border-gray-900 border w-full" />
  )

  return (
    <>
      <div className="flex items-center justify-end md:hidden">
        <Hamburger
          type="spring"
          onChange={isActive => setMenuOpened(isActive)}
        />
      </div>

      <div
        className={`
          ${!menuOpened ? 'hidden' : ''}
          opacity-${overlayOpacity}
          transition-opacity

          w-screen
          h-screen
          absolute
          top-16
          left-0
          bg-black
        `}
      />

      <div
        className={`
          ${!menuOpened ? 'hidden' : ''}
          md:bg-transparent

          flex-col
          w-screen
          absolute

          md:flex-row
          md:w-auto
          md:static

          flex
          md:flex
          top-16
          items-center
          justify-end
        `}
      >
        <Tr />
        <span className="md:pr-4 py-3 md:py-0">
          <Ripples className="p-2">
            <Link href="/issue">Zgłoś błąd</Link>
          </Ripples>
        </span>

        <ThemeSwitch onChange={changeTheme} value={theme === 'dark'} />

        <div className="md:pl-4 py-3 md:py-0">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="react-select-language" />
          <Select
            styles={reactSelectThemedStyle}
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

        <Tr />
      </div>
    </>
  )
}

export default NavBar