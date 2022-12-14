import { Container } from 'react-bootstrap'
import AcademicUpdates from '../AcademicUpdates/AcademicUpdates'
import WorkUpdates from '../WorkUpdates/WorkUpdates'

const UsersInfoPanel = () => {
  return (
    <div
      className='d-flex justify-content-center align-items-center'
      style={{ width: '100%' }}
    >
      <Container
        className='p-3 rounded'
        style={{
          backgroundColor: 'lightgrey',
          width: '80%',
        }}
      >
        <div style={{ textAlign: 'center', margin: '50px 0' }}>
          <h1>PocketCTIS</h1>
          <div>Welcome back, NAME SURNAME</div>
        </div>
        <div className='d-flex justify-content-evenly'>
          <WorkUpdates />
          <AcademicUpdates />
        </div>
        <div
          className='mx-auto mt-3 p-2 rounded'
          style={{ width: '90%', backgroundColor: 'white' }}
        >
          Logs
        </div>
      </Container>
    </div>
  )
}

export default UsersInfoPanel
