import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.scss'
import '../styles/DatePicker.css'
import '../styles/components.scss'
import { SSRProvider } from 'react-bootstrap'
import UserContext from '../context/userContext'
import LocationContext from '../context/locationContext'
import Head from 'next/head'
import TablesContext from '../context/tablesContext'
import departmentConfig from '../config/departmentConfig'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{departmentConfig.app_name}</title>
      </Head>
      <UserContext>
        <TablesContext>
          <LocationContext>
            <SSRProvider>
              <Component {...pageProps} />
            </SSRProvider>
          </LocationContext>
        </TablesContext>
      </UserContext>
    </>
  )
}


export default MyApp
