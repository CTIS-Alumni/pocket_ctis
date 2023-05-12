import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUserUrl } from '../../../helpers/urlHelper'
import AdminPageContainer from '../../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import { Badge, Card, Container, Modal, Tab, Tabs } from 'react-bootstrap'
import {
  EnvelopeFill,
  Facebook,
  GeoAltFill,
  Github,
  Link45deg,
  Linkedin,
  Pencil,
  TelephoneFill,
  Twitter,
  XLg,
  Youtube,
} from 'react-bootstrap-icons'
import { ToastContainer, toast } from 'react-toastify'
import { Rating } from 'react-simple-star-rating'
import {
  getDateString,
  getProfilePicturePath,
  getSemester,
  getTimePeriod,
} from '../../../helpers/formatHelpers'
import CustomBadge from '../../../components/ProfilePageComponents/CustomBadge/CustomBadge'
import { useState, useEffect } from 'react'
import AdminUserEditModal from '../../../components/AdminPanelComponents/AdminUserEditModal/AdminUserEditModal'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import styles from '../../../styles/adminUserView.module.css'
import { useFormik } from 'formik'

const AdminUserView = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState(user.userInfo)

  const [profilePictureModal, setProfilePictureModal] = useState(false)
  const [profileImage, setProfileImage] = useState()
  const [preview, setPreview] = useState()
  const [fileInputResetKey, setfileInputResetKey] = useState(
    Math.random().toString(36)
  )

  useEffect(() => {
    if (!profileImage) {
      setPreview(undefined)
      setfileInputResetKey(Math.random().toString(36))
      return
    }

    const objectUrl = URL.createObjectURL(profileImage)
    setPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [profileImage])

  if (userData.hasOwnProperty('error')) {
    toast.error('Failed to load profile: ' + userData.error)
    return (
      <AdminPageContainer>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          draggable
          pauseOnHover
          theme='light'
        />
      </AdminPageContainer>
    )
  }

  const {
    basic_info,
    emails,
    phone_numbers,
    career_objective,
    profile_picture,
    location,
    work_records,
    current_works,
    edu_records,
    internships,
    erasmus,
    high_school,
    graduation_project,
    exams,
    societies,
    skills,
    certificates,
    wanted_sectors,
    socials,
  } = userData.data

  const text_skill_level = [
    'Beginner',
    'Intermediate',
    'Competent',
    'Proficient',
    'Expert',
  ]

  const classifySkills = () => {
    const classifiedSkill = {}
    skills.forEach((skill) => {
      const skillType = skill.skill_type_name
      if (skillType in classifiedSkill) {
        classifiedSkill[skillType].push(skill)
      } else {
        classifiedSkill[skillType] = [skill]
      }
    })
    return classifiedSkill
  }
  const classifiedSkills = classifySkills(skills)

  const refreshProfile = () => {
    setIsLoading(true)
    console.log(user)
    _getFetcher({
      res: craftUserUrl(user.userInfo.data.basic_info[0].id, 'profile'),
    })
      .then(({ res }) => setUserData(res))
      .finally(() => {
        setIsLoading(false)
      })
  }

  const socialMediaIcons = {
    Facebook: <Facebook size={18} fill='#3b5998' className='me-3' />,
    Youtube: <Youtube size={18} fill='#c4302b ' className='me-3' />,
    Github: <Github size={18} fill='#171515' className='me-3' />,
    Other: <Link45deg size={18} fill='#f5a425' className='me-3' />,
    Linkedin: <Linkedin size={18} fill='#0072b1' className='me-3' />,
    Twitter: <Twitter size={18} fill='#00acee' className='me-3' />,
  }

  const uploadFile = () => {
    if (!profileImage) {
      toast.error('Please select an image to upload', {
        containerId: 'modalContainer',
      })
    }
    console.log(profileImage)

    //continue file upload here
  }

  const getCurrentWorksString = (works) => {
    if (works.length == 1) {
      return 'Currently working at ' + works[0].company_name
    } else {
      return (
        'Currently working at ' +
        works.map((work) => work.company_name).join(' and ')
      )
    }
  }

  return (
    <AdminPageContainer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px 20px',
          flexWrap: 'wrap',
        }}
      >
        <LoadingSpinner isLoading={isLoading} />
        <Card border='light' style={{ padding: 20, flexGrow: '3' }}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            className='mb-3'
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className={styles.imageContainer}>
                <img
                  className={styles.profileImage}
                  src={getProfilePicturePath(
                    profile_picture[0].visibility,
                    profile_picture[0].profile_picture
                  )}
                  width={100}
                  height={100}
                />
                <div
                  className={styles.imageEdit}
                  onClick={() => {
                    setProfilePictureModal(true)
                  }}
                >
                  <Pencil />
                </div>
              </div>
              <div
                className='d-flex flex-column justify-content-between py-3'
                style={{ height: '100%' }}
              >
                <div>
                  <div>
                    {basic_info[0].first_name} {basic_info[0].nee}{' '}
                    {basic_info[0].last_name}
                  </div>
                  <div>{basic_info[0].gender == 1 ? 'Female' : 'Male'}</div>
                </div>
                {current_works && (
                  <div>{getCurrentWorksString(current_works)}</div>
                )}
              </div>
            </div>
            <div className='d-flex flex-column justify-content-center align-items-end'>
              {basic_info[0].is_retired == 1 && (
                <div
                  style={{
                    color: '#aaa',
                    fontStyle: 'italic',
                    marginBottom: 5,
                  }}
                >
                  Retired
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {basic_info[0].user_types.split(',').map((type) => (
                  <Badge className='ms-2'>{type.toUpperCase()}</Badge>
                ))}
              </div>
            </div>
          </div>
          {wanted_sectors.length > 0 && (
            <p>
              Wanted Sectors:{' '}
              <span style={{ color: '#999' }}>
                {wanted_sectors.map((sector) => sector.sector_name).join(', ')}
              </span>
            </p>
          )}
          <div>{career_objective[0]?.career_objective}</div>
        </Card>
        <Card
          border='light'
          style={{
            padding: 20,
            flexGrow: '1',
            maxWidth: '35%',
            minWidth: 300,
          }}
        >
          <div style={{ display: 'flex' }} className='mb-2'>
            <EnvelopeFill size={18} fill='#f5a425' className='me-3' />
            <div>
              {emails.map((email, i) => (
                <div key={i}>{email.email_address}</div>
              ))}
              {emails.length === 0 ? 'No contact available' : ''}
            </div>
          </div>
          <div style={{ display: 'flex' }} className='mb-2'>
            <TelephoneFill size={18} fill='#f5a425' className='me-3' />
            <div>
              {phone_numbers.map((phone_number, i) => (
                <div key={i}>{phone_number.phone_number}</div>
              ))}
              {phone_numbers.length === 0 ? 'No contact available' : ''}
            </div>
          </div>
          {location.length > 0 && (
            <div style={{ display: 'flex' }} className='mb-2'>
              <GeoAltFill size={18} fill='#f5a425' className='me-3' />
              <div>
                {location[0].city_name} {location[0].country_name}
              </div>
            </div>
          )}
          <div>
            {socials.map((social, key) => {
              return (
                <div key={key} style={{ display: 'flex' }} className='mb-2'>
                  {socialMediaIcons[social.social_media_name]}
                  <a
                    href={`http://${social.base_link || ''}${
                      social.link || ''
                    }`}
                    target='_blank'
                  >
                    {social.base_link}
                    {social.link}
                  </a>
                </div>
              )
            })}
          </div>
        </Card>
        <Card
          border='light'
          style={{
            padding: 20,
            flexGrow: '2',
            width: '45%',
          }}
        >
          <Tabs defaultActiveKey='work' className='mb-3'>
            <Tab
              eventKey='work'
              title='Work'
              style={{ height: '300px', overflowY: 'scroll' }}
            >
              {work_records?.length == 0 ? (
                <div>No data available</div>
              ) : (
                <>
                  {work_records?.map((work, i) => {
                    const workPeriod = getTimePeriod(
                      work.start_date,
                      work.end_date,
                      work.is_current
                    )
                    return (
                      <div key={i}>
                        <div className='mb-2 d-flex justify-content-between align-items-center'>
                          {work.company_name}
                          {work.position && (
                            <CustomBadge>{work.position}</CustomBadge>
                          )}
                        </div>
                        <Container style={{ color: '#999', fontSize: '14px' }}>
                          <div style={{ color: 'black' }}>
                            {work.department}
                          </div>
                          <div>
                            {work.country_name && (
                              <div style={{ color: 'rgb(245,164,37)' }}>
                                <GeoAltFill />
                                {work.city_name}
                                {work.country_name &&
                                  work.city_name &&
                                  ','}{' '}
                                {work.country_name}
                              </div>
                            )}
                          </div>
                          <div>{work.work_type_name}</div>
                          <div>{workPeriod}</div>
                          <div>{work.work_description}</div>
                        </Container>
                      </div>
                    )
                  })}
                </>
              )}
            </Tab>
            <Tab
              eventKey='internship'
              title='Internship'
              style={{ height: '300px', overflowY: 'scroll' }}
            >
              {internships.length == 0 ? (
                <div>No Data Available</div>
              ) : (
                <>
                  {internships.map((internship, i) => {
                    const internshipPeriod = getTimePeriod(
                      internship.start_date,
                      internship.end_date,
                      internship.is_current
                    )
                    return (
                      <div key={i}>
                        <div className='mb-2 d-flex justify-content-between align-items-center'>
                          {internship.company_name}
                          <CustomBadge>
                            {getSemester(
                              internship.semester,
                              internship.start_date
                            )}
                          </CustomBadge>
                        </div>
                        <Container style={{ color: '#999', fontSize: '14px' }}>
                          <Rating
                            readonly
                            initialValue={internship.rating}
                            allowFraction={true}
                            fillColor={'#8d2729'}
                            size={25}
                          />
                          <div style={{ color: 'black' }}>
                            {internship.department}
                          </div>
                          <div>{internshipPeriod}</div>
                          <div>{internship.opinion}</div>
                        </Container>
                      </div>
                    )
                  })}
                </>
              )}
            </Tab>
            <Tab
              eventKey='graduationProject'
              title='Graduation Project'
              style={{ height: '300px', overflowY: 'scroll' }}
            >
              <>
                {graduation_project.length == 0 ? (
                  <div>No Data Available</div>
                ) : (
                  <>
                    {graduation_project.map((gradProject, i) => {
                      return (
                        <div key={i}>
                          <div>{gradProject.graduation_project_name}</div>
                          <Container
                            style={{ color: '#999', fontSize: '14px' }}
                          >
                            <div>{gradProject.product_name}</div>
                            <div>Advisor: {gradProject.advisor}</div>
                            <div>
                              {gradProject.project_type} Project -{' '}
                              {gradProject.company_name}
                            </div>
                            <div>
                              {gradProject.semester} -{' '}
                              {gradProject.project_year}
                            </div>
                            <div>{gradProject.project_description}</div>
                          </Container>
                        </div>
                      )
                    })}
                  </>
                )}
              </>
            </Tab>
          </Tabs>
        </Card>
        <Card
          border='light'
          style={{
            padding: 20,
            flexGrow: '2',
            width: '45%',
          }}
        >
          <Tabs defaultActiveKey='education' className='mb-3'>
            <Tab
              eventKey='education'
              title='Education'
              style={{
                height: '300px',
                overflowY: 'scroll',
                paddingBottom: 50,
              }}
            >
              {edu_records.length == 0 ? (
                <div>No data availble</div>
              ) : (
                <>
                  {edu_records.map((record, i) => {
                    const studyPeriod = getTimePeriod(
                      record.start_date,
                      record.end_date,
                      record.is_current
                    )
                    return (
                      <div key={i}>
                        <div>
                          {record.degree_type_name} - {record.name_of_program}
                        </div>
                        <Container style={{ color: '#999', fontSize: 14 }}>
                          <div style={{ color: 'black', fontSize: 16 }}>
                            {record.edu_inst_name}
                          </div>
                          {record.country_name && (
                            <div style={{ color: 'rgb(245,164,37)' }}>
                              <GeoAltFill /> {record.city_name}
                              {record.city_name &&
                                record.country_name &&
                                ','}{' '}
                              {record.country_name}{' '}
                            </div>
                          )}
                          <div>{record.education_description}</div>
                          <div>{studyPeriod}</div>
                        </Container>
                      </div>
                    )
                  })}
                </>
              )}
              {high_school.length != 0 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 10,
                  }}
                >
                  High School: {high_school[0].high_school_name}
                </div>
              )}
            </Tab>
            <Tab
              eventKey='erasmus'
              title='Erasmus'
              style={{ height: '300px', overflowY: 'scroll' }}
            >
              {erasmus.length == 0 ? (
                <div>No data available</div>
              ) : (
                <>
                  {erasmus.map((eras, i) => {
                    const sem = getSemester(eras.semester, eras.start_date)
                    const studyPeriod = getTimePeriod(
                      eras.start_date,
                      eras.end_date
                    )
                    return (
                      <div key={i}>
                        <div className='d-flex justify-content-between align-items-center'>
                          {eras.edu_inst_name}
                          <CustomBadge>{sem}</CustomBadge>
                        </div>
                        <Container style={{ color: '#999' }}>
                          <Rating
                            readonly
                            initialValue={eras.rating}
                            allowFraction
                            fillColor={'#8d2729'}
                            size={25}
                          />
                          <div style={{ color: 'black' }}>{studyPeriod}</div>
                          <div>{eras.opinion}</div>
                        </Container>
                      </div>
                    )
                  })}
                </>
              )}
            </Tab>
          </Tabs>
        </Card>
        <Card
          border='light'
          style={{
            padding: 20,
            flexGrow: '2',
            width: '45%',
            height: 'fit-content',
            overflowY: 'scroll',
          }}
        >
          <Tabs defaultActiveKey='skills' className='mb-3'>
            <Tab eventKey='skills' title='Skills'>
              {skills.length == 0 ? (
                <div>No data available</div>
              ) : (
                <>
                  {Object.keys(classifiedSkills).map((classification, i) => {
                    return (
                      <div key={i}>
                        {classification}
                        <Container style={{ color: '#999' }}>
                          {classifiedSkills[classification].map((skill, i) => (
                            <div>
                              {skill.skill_name} -{' '}
                              {text_skill_level[skill.skill_level]}
                            </div>
                          ))}
                        </Container>
                      </div>
                    )
                  })}
                </>
              )}
            </Tab>
            <Tab eventKey='societies' title='Societies'>
              {societies.length == 0 ? (
                <div>No data available</div>
              ) : (
                <>
                  {societies.map((society, i) => {
                    return (
                      <div key={i}>
                        <div>
                          {society.society_name} -{' '}
                          <span style={{ color: '#999' }}>
                            {' '}
                            {society.activity_status ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </Tab>
          </Tabs>
        </Card>
        <Card
          border='light'
          style={{
            padding: 20,
            flexGrow: '2',
            width: '45%',
            height: 'fit-content',
            overflowY: 'scroll',
          }}
        >
          <Tabs defaultActiveKey='certificates' className='mb-3'>
            <Tab eventKey='certificates' title='Certificates'>
              {certificates.length == 0 ? (
                <div>No data available</div>
              ) : (
                <>
                  {certificates.map((certificate, i) => {
                    return (
                      <div key={i}>
                        <div>{certificate.certificate_name}</div>
                        <Container style={{ color: '#999' }}>
                          Issuing Authority: {certificate.issuing_authority}
                        </Container>
                      </div>
                    )
                  })}
                </>
              )}
            </Tab>
            <Tab eventKey='exams' title='Exams'>
              {exams.length == 0 ? (
                <div>No data available</div>
              ) : (
                <>
                  {exams.map((exam, i) => {
                    const dateString = getDateString(exam.exam_date)
                    return (
                      <div key={i}>
                        <div>{exam.exam_name}</div>
                        <Container style={{ color: '#999' }}>
                          {exam.grade && <div>Score: {exam.grade}</div>}
                          {exam.exam_date && <div>Date: {dateString}</div>}
                        </Container>
                      </div>
                    )
                  })}
                </>
              )}
            </Tab>
          </Tabs>
        </Card>
      </div>

      <AdminUserEditModal
        user={userData.data}
        refreshProfile={refreshProfile}
      />

      {/* profile picture modal */}
      <Modal
        size='md'
        show={profilePictureModal}
        onHide={() => {
          setProfilePictureModal(false)
          setProfileImage(null)
        }}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex justify-content-center'>
            {!preview ? (
              <img
                className={styles.profileImage}
                src={getProfilePicturePath(
                  profile_picture[0].visibility,
                  profile_picture[0].profile_picture
                )}
                width={100}
                height={100}
              />
            ) : (
              <div className={styles.previewContainer}>
                <div
                  className={styles.previewRemover}
                  onClick={() => setProfileImage()}
                >
                  <XLg />
                </div>
                <img
                  className={styles.profileImage}
                  src={preview}
                  width={100}
                  height={100}
                />
              </div>
            )}
          </div>
          <div className='mt-4'>
            <div>
              <input
                type='file'
                accept='image/png, image/gif, image/jpeg'
                key={fileInputResetKey || ''}
                onChange={(event) => {
                  if (!event.target.files || event.target.files.length === 0) {
                    setProfileImage(null)
                  } else {
                    setProfileImage(event.target.files[0])
                  }
                }}
              />
            </div>
            <button className={styles.button} onClick={uploadFile}>
              Confirm
            </button>
          </div>
          <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            draggable
            pauseOnHover
            theme='light'
            containerId='modalContainer'
          />
        </Modal.Body>
      </Modal>
    </AdminPageContainer>
  )
}

export default AdminUserView

export async function getServerSideProps(context) {
  const { cookies } = context.req
  const token = cookies.AccessJWT

  const userInfo = await _getFetcher(
    { userInfo: craftUserUrl(context.params.id, 'profile') },
    token
  )
  return { props: { user: userInfo } }
}
