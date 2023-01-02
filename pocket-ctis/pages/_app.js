import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.scss'
import '../styles/components.scss'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
