import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap'
import { GeoAltFill } from 'react-bootstrap-icons'
import { getProfilePicturePath } from '../../helpers/formatHelpers'
import { fetchProfile } from '../../helpers/searchHelpers'

import UserInfoSidebar from '../../components/UserInfoSidebar/UserInfoSidebar'
import NavigationBar from '../../components/navbar/NavigationBar'

import ProfileEditModal from '../../components/Modals/ProfileEditModal/ProfileEditModal'
import ProfileWorkSection from '../../components/ProfilePageComponents/ProfileWorkSection/ProfileWorkSection'
import ProfileInternshipSection from '../../components/ProfilePageComponents/ProfileInternshipSection/ProfileInternshipSection'
import SkillsSection from '../../components/ProfilePageComponents/SkillsSection/SkillsSection'
import SocialsSection from '../../components/ProfilePageComponents/SocialsSection/SocialsSection'
import CertificatesSection from '../../components/ProfilePageComponents/CertificatesSection/CertificatesSection'
import ProfileErasmusSection from '../../components/ProfilePageComponents/ProfileErasmusSection/ProfileErasmusSection'
import ProfileEduSection from '../../components/ProfilePageComponents/ProfileEduSection/ProfileEduSection'
import ProfileHighSchoolSection from '../../components/ProfilePageComponents/ProfileHighSchoolSection/ProfileHighSchoolSection'
import ProfileStudentSocieties from '../../components/ProfilePageComponents/ProfileStudentSocieties/ProfileStudentSocieties'

import { User_data } from '../../context/context'
import { useContext } from 'react'
/*
#1F272B = dark green
#f5a425 = orange
#8d2729 = red
*/

const Profile = ({ user, errors }) => {
  const { userData } = useContext(User_data)
  console.log('from context', userData)

  const {
    certificates,
    edu_records,
    emails,
    erasmus,
    work_records,
    phone_numbers,
    socials,
    skills,
    profile_picture,
    wanted_sectors,
    location,
    societies,
    internships,
    career_objective,
    high_school,
    graduation_project,
    basic_info,
  } = user
  console.log(user)

  return (
    <>
      <div style={{ height: '100vh' }}>
        <NavigationBar />
        <div className='d-flex' style={{ height: '100%' }}>
          <UserInfoSidebar />
          <Container>
            <Row>
              <Col md='auto'>
                <img
                  width={400}
                  height={300}
                  style={{ objectFit: 'contain' }}
                  src={getProfilePicturePath(
                    profile_picture[0].visibility,
                    profile_picture[0].profile_picture
                  )}
                />
                <Container>
                  <Tabs defaultActiveKey='education' className='my-2'>
                    <Tab eventKey='education' title='Education'>
                      <ProfileEduSection edu={edu_records} />
                    </Tab>
                    <Tab eventKey='erasmus' title='Erasmus'>
                      <ProfileErasmusSection erasmus={erasmus} />
                    </Tab>
                    <Tab eventKey='highSchool' title='High School'>
                      <ProfileHighSchoolSection highSchool={high_school} />
                    </Tab>
                  </Tabs>
                  <SkillsSection skills={skills} />
                </Container>
              </Col>
              <Col>
                <div className='d-flex justify-content-between align-items-center'>
                  <h4 style={{ display: 'flex', alignItems: 'baseline' }}>
                    {basic_info[0].first_name} {basic_info[0].last_name}
                    <span
                      className='ms-4'
                      style={{
                        fontSize: 14,
                        alignItems: 'baseline',
                        display: 'flex',
                      }}
                    >
                      <GeoAltFill size={18} fill='#f5a425' />
                      {location[0].city_name}, {location[0].country_name}
                    </span>
                  </h4>
                  <span className=''>
                    <SocialsSection socials={socials} />
                  </span>
                </div>
                <Container>
                  <div>{career_objective[0].career_objective}</div>
                  <div className='my-1'>
                    Wants to work in:&nbsp;
                    {wanted_sectors.map((s, i) => {
                      if (wanted_sectors.length - 1 === i) {
                        return <span key={i}>{s.sector_name}</span>
                      }
                      return <span key={i}>{s.sector_name}, </span>
                    })}
                  </div>
                  <Row style={{ color: '#999' }}>
                    <Col md='auto'>Emails:</Col>
                    <Col>
                      {emails.map((e, i) => (
                        <div key={i}>{e.email_address}</div>
                      ))}
                    </Col>
                    <Col md='auto'>Phone Numbers:</Col>
                    <Col>
                      {phone_numbers.map((p, i) => (
                        <div key={i}>{p.phone_number}</div>
                      ))}
                    </Col>
                  </Row>
                </Container>
                <Tabs defaultActiveKey='work' className='my-2'>
                  <Tab eventKey='work' title='Work'>
                    <ProfileWorkSection work={work_records} />
                  </Tab>
                  <Tab eventKey='internship' title='Internship'>
                    <ProfileInternshipSection internships={internships} />
                  </Tab>
                </Tabs>
                <CertificatesSection certs={certificates} />
                <ProfileStudentSocieties societies={societies} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <ProfileEditModal user={user} />
    </>
  )
}

export async function getServerSideProps() {
  const { data, errors } = await fetchProfile(1)

  return { props: { user: data, errors: errors } }
}

export default Profile
