import { Container } from 'react-bootstrap'
import { GeoAltFill } from 'react-bootstrap-icons'
import { getTimePeriod } from '../../../helpers/formatHelpers'

const ProfileEduSection = ({ edu }) => {
  return (
    <div>
      {/* <SectionHeading title='Education' /> */}
      <Container
        className='px-0'
        style={{ height: 200, width: 350, overflowY: 'scroll' }}
      >
        {edu.map((datum, i) => {
          const studyPeriod = getTimePeriod(
            datum.start_date,
            datum.end_date,
            datum.is_current
          )
          return (
            <div
              key={i}
              style={{ fontSize: 18, borderBottom: '1px solid #ccc' }}
              className='mb-3 pb-1'
            >
              {datum.degree_name} - {datum.name_of_program}
              <Container style={{ fontSize: 14, color: '#999' }}>
                <div style={{ color: 'black', fontSize: 16 }}>
                  {datum.inst_name}
                </div>
                <div style={{ color: 'rgb(245,164,37)' }}>
                  <GeoAltFill />
                  {datum.city_name}, {datum.country_name}
                </div>
                {studyPeriod}
              </Container>
            </div>
          )
        })}
      </Container>
    </div>
  )
}

export default ProfileEduSection
