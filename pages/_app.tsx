import NavBar from '../components/NavBar'
import '../styles/globals.css'
import '../styles/NavBar.sass'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
