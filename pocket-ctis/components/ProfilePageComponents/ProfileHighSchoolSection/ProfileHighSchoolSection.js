import { Container } from 'react-bootstrap'

const ProfileHighSchoolSection = ({ highSchool }) => {
  if (highSchool.length == 0) {
    return (
      <Container
        className='px-0'
        style={{ height: 200, width: 350, overflowY: 'scroll', color: '#999' }}
      >
        No data available
      </Container>
    )
  }
  return (
    <Container
      className='px-0'
      style={{ height: 200, width: 350, overflowY: 'scroll' }}
    >
      {highSchool.map((highSchool, i) => {
        return (
          <div key={i}>
            <div
              className='pb-1'
              style={{ fontSize: 18, borderBottom: '1px solid #ccc' }}
            >
              {highSchool.high_school_name}
            </div>
          </div>
        )
      })}
    </Container>
  )
}

export default ProfileHighSchoolSection
