import { Container } from 'react-bootstrap'
import CustomBadge from '../CustomBadge/CustomBadge'
import ReactStars from 'react-stars'
import { getTimePeriod, getSemester } from '../../../helpers/formatHelpers'

const ProfileInternshipSection = ({ internships }) => {
    if (internships.length == 0) {
        return (
            <Container
                className='px-0'
                style={{ height: 50, width: 350, color: '#999' }}
            >
                No data available
            </Container>
        )
    }
  return (
    <div>
      <Container style={{ height: 300, oveflowY: 'scroll' }}>
        {internships.map((internship, i) => {
          const workPeriod = getTimePeriod(
            internship.start_date,
            internship.end_date
          )
          return (
            <div
              className='mb-3 pb-1'
              style={{
                fontSize: 14,
                color: '#999',
                borderBottom: '1px solid #ccc',
              }}
              key={i}
            >
              <div className='mb-1 d-flex justify-content-between align-items-center'>
                <p className='m-0' style={{ fontSize: 18, color: 'black' }}>
                  {internship.company_name}
                </p>
                <CustomBadge>
                  {getSemester(internship.semester, internship.start_date)}
                </CustomBadge>
              </div>
              <Container>
                <ReactStars
                  count={5}
                  value={internship.rating}
                  size={20}
                  color2={'#8d2729'}
                  edit={false}
                />
                <div style={{ color: 'black' }}>
                  {internship.department} Department
                </div>
                <div>{workPeriod}</div>
                {internship.opinion && (
                  <div className='mt-2'>{internship.opinion}</div>
                )}
              </Container>
            </div>
          )
        })}
      </Container>
    </div>
  )
}

export default ProfileInternshipSection
