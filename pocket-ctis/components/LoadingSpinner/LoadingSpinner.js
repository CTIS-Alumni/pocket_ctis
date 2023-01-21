import { Spinner } from 'react-bootstrap'

const LoadingSpinner = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          backgroundColor: 'rgba(255,255,255,0.5)',
          justifyContent: 'center',
          zIndex: 9,
          height: '100%',
          width: '100%',
          paddingTop: 50,
          position: 'absolute',
        }}
      >
        <Spinner
          style={{ width: '50px', height: '50px' }}
          animation='border'
          role='status'
        >
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    )
  }
  return null
}

export default LoadingSpinner
