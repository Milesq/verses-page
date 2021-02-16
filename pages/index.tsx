import { useRouter } from 'next/router'
import Head from 'next/head'
import type { FC } from 'react'
import NavBar from '../components/NavBar'

const Home: FC = () => {
  const { locale, locales } = useRouter()

  return (
    <>
      <Head>
        <title>Verses - generowanie plansz z wersetami</title>
      </Head>
      <NavBar />
      <div style={{ height: '200vh' }}>hello</div>
    </>
  )
}

export default Home
