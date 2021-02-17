import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import Select from 'react-select'
import ThemeSwitch from './ThemeSwitch'
import { useScroll } from '../hooks'

function parseCookies(cookies: string): Record<string, string> {
  const parsedCookies = cookies.split('; ').map(cookie => cookie.split('='))

  return Object.fromEntries(parsedCookies)
}

const NavBar: FC = () => {
  const { y: scroll } = useScroll()
  const { locales, locale, ...router } = useRouter()

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
    document.cookie = `darkTheme=${!active}`
  }

  useEffect(() => {
    const cookies = parseCookies(document.cookie)
    const isDarkTheme = JSON.parse(cookies.darkTheme || null)

    if (isDarkTheme) {
      document.querySelector('html').classList.add('dark')
    }
  }, [])

  return (
    <>
      <nav
        className={`${
          scroll ? 'shadow-md' : 'md:shadow'
        } transition-shadow duration-300 h-16 fixed w-full flex justify-between items-center px-3 bg-white dark:bg-gray-800`}
      >
        <div>
          <Image src="/verse.png" width={40} height={40} alt="Verse's Logo" />
        </div>

        <span className="text-4xl font-aquire select-none">Verse</span>

        <ThemeSwitch onChange={changeTheme} />
        <div>
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
      </nav>

      <div className="h-16" />
    </>
  )
}

export default NavBar
