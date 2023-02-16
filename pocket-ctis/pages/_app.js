import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.scss'
import '../styles/components.scss'
import { SSRProvider } from 'react-bootstrap'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
    </>
  )
}

export default MyApp
