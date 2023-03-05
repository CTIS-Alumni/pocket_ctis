import { Container } from 'react-bootstrap'
import SectionHeading from '../SectionHeading/SectionHeading'

const ProfileExamsSection = ({ exams }) => {
  return (
    <div className='mt-4'>
      <SectionHeading title={'Exams'} />
      <Container>
        {exams.map((exam, i) => {
          return (
            <div key={i}>
              <strong>{exam.exam_name}</strong>
              <Container style={{ color: '#999' }}>{exam.grade}</Container>
            </div>
          )
        })}
      </Container>
    </div>
  )
}

export default ProfileExamsSection
