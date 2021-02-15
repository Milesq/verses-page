import { useRouter } from 'next/router'
import type { FC } from 'react'
import NavBar from '../components/NavBar'

const Home: FC = () => {
  const { locale, locales } = useRouter()

  return (
    <>
      <NavBar />
      <div style={{ height: '200vh' }}>hello</div>
    </>
  )
}

export default Home
