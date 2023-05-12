import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.scss'
import '../styles/DatePicker.css'
import '../styles/components.scss'
import { SSRProvider } from 'react-bootstrap'
import UserContext from '../context/userContext'
import LocationContext from '../context/locationContext'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <UserContext>
        <LocationContext>
          <SSRProvider>
            <Component {...pageProps} />
          </SSRProvider>
        </LocationContext>
      </UserContext>
    </>
  )
}


export default MyApp
