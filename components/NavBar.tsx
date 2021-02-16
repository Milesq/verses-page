import Image from 'next/image'
import type { FC } from 'react'
import { useScroll } from '../hooks'

const NavBar: FC = () => {
  const { y: scroll } = useScroll()

  return (
    <nav
      className={`${
        scroll && 'shadow-md'
      } transition-shadow duration-300 h-16 fixed w-full flex justify-between items-center px-3 bg-white`}
    >
      <div>
        <Image src="/verse.png" width={40} height={40} alt="Verse's Logo" />
      </div>

      <span className="text-4xl font-aquire select-none">Verse</span>

      <Select className="w-20" defaultValue={currentLang} options={langs} />
    </nav>
  )
}

export default NavBar
