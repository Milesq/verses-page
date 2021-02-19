import NavBar from '../components/Nav/Bar'
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
