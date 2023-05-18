import { useEffect, useState } from 'react'
import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { craftUrl } from '../../helpers/urlHelper'
import { toast, ToastContainer } from 'react-toastify'
import { Spinner } from 'react-bootstrap'

const WorkRec = () => {
  const [isLoading, setIsLoading] = useState(false)

  const getData = () => {}

  useEffect(() => {
    setIsLoading(true)
    _getFetcher({ workRec: craftUrl(['workrecords']) })
      .then((res) => {
        console.log('here', res)
        if (!res.workRec.data || res.workRec.errors.length > 0)
          res.workRec.errors.map((err) => toast.error(err.error))
      })
      .catch((err) => toast.error(err.message))
      .finally((_) => setIsLoading(false))
  }, [])

  return (
    <AdminPageContainer>
      <h4>Work Records</h4>
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

export default WorkRec
