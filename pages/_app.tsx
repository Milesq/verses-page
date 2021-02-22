import NavBar from '../components/Nav/Bar'
import '../styles/globals.css'
import '../styles/NavBar.sass'
import '../node_modules/@material/linear-progress/dist/mdc.linear-progress.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <div className="mt-4 container px-8 lg:px-52 xl:px-96 mx-auto">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
