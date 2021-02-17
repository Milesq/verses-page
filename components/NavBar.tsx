import Image from 'next/image'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import Select from 'react-select'
import { useScroll } from '../hooks'

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

  return (
    <>
      <nav
        className={`${
          scroll ? 'shadow-md' : 'md:shadow'
        } transition-shadow duration-300 h-16 fixed w-full flex justify-between items-center px-3 bg-white`}
      >
        <div>
          <Image src="/verse.png" width={40} height={40} alt="Verse's Logo" />
        </div>

        <span className="text-4xl font-aquire select-none">Verse</span>

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
