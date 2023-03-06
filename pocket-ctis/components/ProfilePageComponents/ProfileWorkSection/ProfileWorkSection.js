import { Container } from 'react-bootstrap'
import { getTimePeriod } from '../../../helpers/formatHelpers'
import CustomBadge from '../CustomBadge/CustomBadge'
import { GeoAltFill } from 'react-bootstrap-icons'

const ProfileWorkSection = ({ work }) => {
  return (
    <div>
      {/* <SectionHeading title='Work' /> */}
        {work.length > 0 && <Container style={{ height: 300, oveflowY: 'scroll' }}>
        {work.map((datum, i) => {
          const workPeriod = getTimePeriod(
            datum.start_date,
            datum.end_date,
            datum.is_current
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
                  {datum.company_name}
                </p>
                {datum.position && <CustomBadge>{datum.position}</CustomBadge>}
              </div>
              <Container>
                {datum.department && <div style={{ color: 'black' }}>
                  {datum.department} Department
                </div>}
                {datum.country_name && <div style={{ color: 'rgb(245,164,37)' }}>
                  <GeoAltFill />
                  {datum.city_name}{datum.city_name && ','} {datum.country_name}
                </div>}
                <div>{datum.work_type_name}</div>
                <div>{workPeriod}</div>
                <div>{datum.work_description}</div>
              </Container>
            </div>
          )
        })}
      </Container>}
      {work.length == 0 &&
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

export default ProfileWorkSection
