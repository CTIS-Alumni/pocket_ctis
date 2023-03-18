import { Container } from 'react-bootstrap'
import ReactStars from 'react-stars'
import CustomBadge from '../CustomBadge/CustomBadge'
import { getTimePeriod, getSemester } from '../../../helpers/formatHelpers'

const ProfileErasmusSection = ({ erasmus }) => {
    if (erasmus.length == 0) {
        return (
            <Container
                className='px-0'
                style={{ height: 200, width: 350, color: '#999' }}
            >
                No data available
            </Container>
        )
    }
    return (
      <div>
        <Container
          className='px-0'
          style={{ height: 200, width: 350, overflowY: 'scroll' }}
        >
          {erasmus.map((eras) => {
            const studyPeriod = getTimePeriod(eras.start_date, eras.end_date)
            const semester = getSemester(eras.semester, eras.start_date)
            return (
              <div key={eras.id} style={{ borderBottom: '1px solid #ccc' }}>
                <div className='d-flex justify-content-between align-items-center'>
                  <p className='m-0'>{eras.edu_inst_name}</p>
                  <CustomBadge>{semester}</CustomBadge>
                </div>
                <Container>
                  <ReactStars
                    count={5}
                    value={eras.rating}
                    size={20}
                    color2={'#8d2729'}
                    edit={false}
                  />
                  <p style={{ color: '#999', fontSize: 14 }}>{eras.opinion}</p>
                </Container>
              </div>
            )
          })}
        </Container>
      </div>
    )
}

export default ProfileErasmusSection
