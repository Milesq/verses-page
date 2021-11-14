/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Link from 'next/link'
import Image from 'next/image'
import { ElementRef, FC, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import Ripples from 'react-ripples'
import { useRouter } from 'next/router'

import ThemeSwitch from '../ThemeSwitch'
import Hamburger from '../Hamburger'
import Tr from '../Tr'
import reactSelectThemedStyle from '../../styles/react-select-themed'
import { useChanged } from '../../hooks'
import { minimize } from '../../utils'

const NavBar: FC = () => {
  const { locales, locale, route, ...router } = useRouter()
  const [theme, setTheme] = useState('')
  const [menuOpened, setMenuOpened] = useState(false)
  const overlayElement = useRef<HTMLDivElement>()
  const hamburger = useRef<ElementRef<typeof Hamburger>>()

  function closeHamburger() {
    hamburger.current.close()
  }

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

  useEffect(() => {
    setMenuOpened(false)
    closeHamburger()
  }, [route])

  useChanged(() => {
    setTimeout(() => {
      overlayElement.current.classList.toggle('opacity-70')
    }, 5)
  }, [menuOpened])

  return (
    <>
      <div className="flex items-center justify-end md:hidden">
        <Hamburger
          ref={hamburger}
          type="spring"
          onChange={isActive => setMenuOpened(isActive)}
        />
      </div>

      <div
        onClick={closeHamburger}
        ref={overlayElement}
        className={minimize`
          ${!menuOpened ? 'hidden' : ''}
          opacity-0
          bg-black
          dark:bg-gray-900
          transition-opacity
          duration-500

          w-screen
          h-screen
          absolute
          top-16
          left-0
        `}
      />

      <div
        className={minimize`
          ${!menuOpened ? 'hidden' : ''}
          bg-white
          dark:bg-gray-700
          md:bg-transparent
          md:dark:bg-transparent

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

        <span className="md:pr-4 py-3 md:py-0 cursor-pointer">
          <a href="https://github.com/milesq/verses-page">
            <svg
              enableBackground="new 0 0 32 32"
              width="32px"
              height="32px"
              id="Layer_1"
              version="1.0"
              viewBox="0 0 32 32"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path
                clipRule="evenodd"
                d="M16.003,0C7.17,0,0.008,7.162,0.008,15.997  c0,7.067,4.582,13.063,10.94,15.179c0.8,0.146,1.052-0.328,1.052-0.752c0-0.38,0.008-1.442,0-2.777  c-4.449,0.967-5.371-2.107-5.371-2.107c-0.727-1.848-1.775-2.34-1.775-2.34c-1.452-0.992,0.109-0.973,0.109-0.973  c1.605,0.113,2.451,1.649,2.451,1.649c1.427,2.443,3.743,1.737,4.654,1.329c0.146-1.034,0.56-1.739,1.017-2.139  c-3.552-0.404-7.286-1.776-7.286-7.906c0-1.747,0.623-3.174,1.646-4.292C7.28,10.464,6.73,8.837,7.602,6.634  c0,0,1.343-0.43,4.398,1.641c1.276-0.355,2.645-0.532,4.005-0.538c1.359,0.006,2.727,0.183,4.005,0.538  c3.055-2.07,4.396-1.641,4.396-1.641c0.872,2.203,0.323,3.83,0.159,4.234c1.023,1.118,1.644,2.545,1.644,4.292  c0,6.146-3.74,7.498-7.304,7.893C19.479,23.548,20,24.508,20,26c0,2,0,3.902,0,4.428c0,0.428,0.258,0.901,1.07,0.746  C27.422,29.055,32,23.062,32,15.997C32,7.162,24.838,0,16.003,0z"
                fill="#181616"
                fillRule="evenodd"
              />
            </svg>
          </a>
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
            className="w-20 cursor-pointer"
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
