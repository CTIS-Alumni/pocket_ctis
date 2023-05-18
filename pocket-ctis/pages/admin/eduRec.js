import { useEffect, useState } from 'react'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { craftUrl } from '../../helpers/urlHelper'
import { toast, ToastContainer } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'

const EduRec = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    _getFetcher({ eduRec: craftUrl(['educationrecords']) })
      .then((res) => {
        console.log('here', res)
        if (!res.eduRec.data || res.eduRec.errors.length > 0)
          res.eduRec.errors.map((err) => toast.error(err.error))
      })
      .catch((err) => toast.error(err.message))
    //   .finally((_) => setIsLoading(false))
  }, [])

  return (
    <AdminPageContainer>
      <div style={{ position: 'relative', height: '100%' }}>
        {isLoading ? (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#F5F5F5',
              opacity: 0.5,
            }}
          >
            <Spinner />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
        theme='light'
      />
    </AdminPageContainer>
  )
}

export default EduRec
