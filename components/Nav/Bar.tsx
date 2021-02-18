import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { useScroll } from '../../hooks'
import NavMenu from './Menu'

const NavBar: FC = () => {
  const { y: scroll } = useScroll()

  return (
    <>
      <nav
        className={`${
          scroll ? 'shadow-md' : 'md:shadow'
        } transition-shadow duration-300 h-16 fixed w-full grid grid-cols-3 px-3 bg-white dark:bg-gray-800 dark:text-white z-50`}
      >
        <div className="hidden md:flex items-center">
          <Link href="/">
            <div>
              <Image
                src="/verse.png"
                className="navbar-logo cursor-pointer"
                width={40}
                height={40}
                alt="Verse's Logo"
              />
            </div>
          </Link>
        </div>

        <span className="text-4xl font-aquire select-none flex items-center justify-center">
          <Link href="/">Verse</Link>
        </span>
        <div className="block md:hidden" />

        <NavMenu />
      </nav>

      <div className="h-16" />
    </>
  )
}

export default NavBar
