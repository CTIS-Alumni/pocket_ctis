import SectionHeading from '../SectionHeading/SectionHeading'
import { Container } from 'react-bootstrap'

const ProfileStudentSocieties = ({ societies }) => {
  return (
    <div className='mt-4'>
      <SectionHeading title='Societies' />
      <Container>
        {societies.map((society, i) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }} key={i}>
              {society.society_name}
              <span className='ms-2' style={{ color: '#999' }}>
                {society.activity_status == 1 ? 'Active' : 'Inactive'}
              </span>
            </div>
          )
        })}
      </Container>
    </div>
  )
}

export default ProfileStudentSocieties
