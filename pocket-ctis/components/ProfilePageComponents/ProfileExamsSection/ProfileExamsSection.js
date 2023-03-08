import { Container } from 'react-bootstrap'
import { getDateString } from '../../../helpers/formatHelpers'
import SectionHeading from '../SectionHeading/SectionHeading'

const ProfileExamsSection = ({ exams }) => {
  return (
    <div className='mt-4'>
      <SectionHeading title={'Exams'} />
      <Container>
        {exams.map((exam, i) => {
          const dateString = getDateString(exam.exam_date)
          return (
            <div className='my-1' key={i}>
              <strong>{exam.exam_name}</strong>
              <Container style={{ color: '#999' }}>
                <p style={{ marginBottom: 0 }}>Score: {exam.grade}</p>
                {dateString && <p>Date: {dateString}</p>}
              </Container>
            </div>
          )
        })}
      </Container>
    </div>
  )
}

export default ProfileExamsSection
