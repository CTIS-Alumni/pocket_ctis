import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.scss'
import '../styles/components.scss'
import { SSRProvider } from 'react-bootstrap'
import Context from '../context/context'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Context>
        <SSRProvider>
          <Component {...pageProps} />
        </SSRProvider>
      </Context>
    </>
  )
}

export default MyApp
