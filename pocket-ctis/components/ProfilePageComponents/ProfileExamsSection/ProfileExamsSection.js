import { Container } from 'react-bootstrap'
import { getDateString } from '../../../helpers/formatHelpers'
import SectionHeading from '../SectionHeading/SectionHeading'

const ProfileExamsSection = ({ exams }) => {
  return (
    <div className='mt-4'>
      <SectionHeading title={'Exams'} />
        {exams.length > 0 && <Container>
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
      </Container>}
        {exams.length == 0 &&
            <Container
                className='px-0'
                style={{ height: 50, width: 350, color: '#999' }}
            >
                No data available
            </Container>
        }
    </div>
  )
}

export default ProfileExamsSection
