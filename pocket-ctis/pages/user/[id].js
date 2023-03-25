import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap'
import { GeoAltFill, TelephoneFill, EnvelopeFill } from 'react-bootstrap-icons'
import { getProfilePicturePath } from '../../helpers/formatHelpers'

import UserInfoSidebar from '../../components/UserInfoSidebar/UserInfoSidebar'
import NavigationBar from '../../components/navbar/NavigationBar'

import ProfileEditModal from '../../components/Modals/ProfileEditModal/ProfileEditModal'
import ProfileWorkSection from '../../components/ProfilePageComponents/ProfileWorkSection/ProfileWorkSection'
import ProfileInternshipSection from '../../components/ProfilePageComponents/ProfileInternshipSection/ProfileInternshipSection'
import SkillsSection from '../../components/ProfilePageComponents/ProfileSkillsSection/SkillsSection'
import SocialsSection from '../../components/ProfilePageComponents/ProfileSocialsSection/SocialsSection'
import CertificatesSection from '../../components/ProfilePageComponents/ProfileCertificatesSection/CertificatesSection'
import ProfileErasmusSection from '../../components/ProfilePageComponents/ProfileErasmusSection/ProfileErasmusSection'
import ProfileEduSection from '../../components/ProfilePageComponents/ProfileEduSection/ProfileEduSection'
import ProfileHighSchoolSection from '../../components/ProfilePageComponents/ProfileHighSchoolSection/ProfileHighSchoolSection'
import ProfileStudentSocieties from '../../components/ProfilePageComponents/ProfileStudentSocieties/ProfileStudentSocieties'

import { useContext, useEffect, useState } from 'react'
import ProfileExamsSection from '../../components/ProfilePageComponents/ProfileExamsSection/ProfileExamsSection'
import GraduationProjectSection from '../../components/ProfilePageComponents/GraduationProjectSection/GraduationProjectSection'
import { craftUserUrl } from '../../helpers/urlHelper'
import { _getFetcher } from '../../helpers/fetchHelpers'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

const Profile = ({ userData, session, errors }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(userData)

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
    projects,
    basic_info,
    exams,
  } = user

  const refreshProfile = () => {
    setIsLoading(true)
    _getFetcher({ res: craftUserUrl(user.basic_info[0].id, 'profile') })
      .then(({ res }) => setUser(res.data))
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    console.log('from [id]', user)
  }, [user])

  return (
    <>
      <div style={{ height: '100vh' }}>
        <NavigationBar />
        <div className='d-flex' style={{ height: '100%' }}>
          <UserInfoSidebar />
          <Container style={{ position: 'relative' }}>
            <LoadingSpinner isLoading={isLoading} />
            <Row>
              <Col md='auto'>
                <img
                  width={120}
                  height={120}
                  style={{ objectFit: 'contain' }}
                  src={getProfilePicturePath(
                    profile_picture[0]?.visibility,
                    profile_picture[0]?.profile_picture
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
                    {basic_info[0].first_name} {basic_info[0].nee}{' '}
                    {basic_info[0].last_name}
                    {location.length > 0 && (
                      <span
                        className='ms-4'
                        style={{
                          fontSize: 14,
                          alignItems: 'baseline',
                          display: 'flex',
                        }}
                      >
                        <GeoAltFill size={18} fill='#f5a425' />
                        {location[0]?.city_name}
                        {location[0]?.city_name && ','}{' '}
                        {location[0]?.country_name}
                      </span>
                    )}
                  </h4>
                  <span className=''>
                    <SocialsSection socials={socials} />
                  </span>
                </div>
                <Container>
                  {career_objective.length > 0 && (
                    <div>{career_objective[0].career_objective}</div>
                  )}
                  {wanted_sectors.length > 0 && (
                    <div className='my-1'>
                      Wants to work in:&nbsp;
                      {wanted_sectors.map((s, i) => {
                        if (wanted_sectors.length - 1 === i) {
                          return <span key={i}>{s.sector_name}</span>
                        }
                        return <span key={i}>{s.sector_name}, </span>
                      })}
                    </div>
                  )}
                  <Row style={{ color: '#999' }}>
                    {emails.length > 0 && (
                      <>
                        <Col md='auto'>
                          <EnvelopeFill size={18} fill='#f5a425' />
                        </Col>
                        <Col>
                          {emails.map((e, i) => (
                            <div key={i}>{e.email_address}</div>
                          ))}
                        </Col>
                      </>
                    )}
                    {phone_numbers.length > 0 && (
                      <>
                        <Col md='auto'>
                          <TelephoneFill size={18} fill='#f5a425' />
                        </Col>
                        <Col>
                          {phone_numbers.map((p, i) => (
                            <div key={i}>{p.phone_number}</div>
                          ))}
                        </Col>
                      </>
                    )}
                  </Row>
                </Container>
                <Tabs defaultActiveKey='work' className='my-2'>
                  <Tab eventKey='work' title='Work'>
                    <ProfileWorkSection work={work_records} />
                  </Tab>
                  <Tab eventKey='internship' title='Internship'>
                    <ProfileInternshipSection internships={internships} />
                  </Tab>
                  <Tab eventKey='graduation_project' title='Graduation Project'>
                    <GraduationProjectSection
                      graduationProject={graduation_project}
                    />
                  </Tab>
                </Tabs>
                <CertificatesSection certs={certificates} />
                <ProfileStudentSocieties societies={societies} />
                <ProfileExamsSection exams={exams} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {session !== 'visitor' && (
        <ProfileEditModal user={user} refreshProfile={refreshProfile} />
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  const { cookies } = context.req
  const token = cookies.AccessJWT
  const { res } = await _getFetcher(
    { res: craftUserUrl(context.params.id, 'profile') },
    token
  )

  return {
    props: { userData: res.data, session: res.session, errors: res.errors },
  }
}

export default Profile
