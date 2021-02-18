import NavBar from '../components/Nav/Bar'
import '../styles/globals.css'
import '../styles/NavBar.sass'
import 'hamburgers/_sass/hamburgers/hamburgers.scss'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
