import {Container, Row, Col, Badge, Tab, Tabs} from 'react-bootstrap'
import {
    CircleFill,
    Dot,
    Facebook,
    GeoAltFill,
    Link45deg,
    Linkedin,
    PencilSquare,
} from 'react-bootstrap-icons'
import ReactStars from 'react-stars'
import NavigationBar from '../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../components/UserInfoSidebar/UserInfoSidebar'
import {
    fetchProfile
} from '../../helpers/searchHelpers'
import {
    getProfilePicturePath,
    getSemester,
    getTimePeriod,
} from '../../helpers/formatHelpers'
import Link from 'next/link'
import styles from '../../styles/profile.module.css'
import {useState} from 'react'
import ProfileEditModal from '../../components/Modals/ProfileEditModal/ProfileEditModal'

/*
get pfp
get city and country user
get city and country eduRecord -> uni
get city and country erasmus -> uni
education should also show which uni the education is from.
#1F272B
#f5a425
#8d2729
*/

const SectionHeading = ({title}) => {
    return (
        <div
            className='d-flex align-items-center my-2'
            style={{fontSize: 20, color: '#1F272B'}}
        >
            {title}
            <div
                style={{
                    background: 'rgba(245,164,37)',
                    background:
                        'linear-gradient(90deg, rgba(141,39,41,1) 50%, rgba(255,255,255,1) 100%)',
                    display: 'inline',
                    height: 4,
                    borderRadius: 2,
                    overflow: 'hidden',
                    width: '100%',
                    marginLeft: 10,
                }}
            />
        </div>
    )
}

const CustomBadge = ({children}) => {
    return (
        <div
            style={{
                backgroundColor: 'rgba(245,164,37, 0.5)',
                color: 'black',
                fontSize: 16,
                padding: 5,
                borderRadius: 4,
                overflow: 'hidden',
            }}
        >
            {children}
        </div>
    )
}

const ProfileWorkSection = ({work}) => {
    return (
        <div>
            {/* <SectionHeading title='Work' /> */}
            <Container style={{height: 300, oveflowY: 'scroll'}}>
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
                                <p className='m-0' style={{fontSize: 18, color: 'black'}}>
                                    {datum.company_name}
                                </p>
                                <CustomBadge>{datum.position}</CustomBadge>
                            </div>
                            <Container>
                                <div style={{color: 'black'}}>
                                    {datum.department} Department
                                </div>
                                <div style={{color: 'rgb(245,164,37)'}}>
                                    <GeoAltFill/>
                                    {datum.city_name}, {datum.country_name}
                                </div>
                                <div>{datum.type_name}</div>
                                <div>{workPeriod}</div>
                            </Container>
                        </div>
                    )
                })}
            </Container>
        </div>
    )
}

const ProfileInternshipSection = ({internships}) => {
    return (
        <div>
            {/* <SectionHeading title='Internship' /> */}
            <Container style={{height: 300, oveflowY: 'scroll'}}>
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
                                <p className='m-0' style={{fontSize: 18, color: 'black'}}>
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
                                <div style={{color: 'black'}}>
                                    {internship.department} Department
                                </div>
                                <div>{workPeriod}</div>
                                {internship.opinion.length > 1 && (
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

const SkillsSection = ({skills}) => {
    return (
        <div>
            <SectionHeading title='Skills'/>
            <Container>
                {skills.map((skill, i) => {
                    return (
                        <div className='my-1' key={i}>
                            {skill.skill_name}
                            <Container style={{fontSize: 14, color: '#999'}}>
                                Skill level: {skill.skill_level}
                            </Container>
                        </div>
                    )
                })}
            </Container>
        </div>
    )
}

const ProfileErasmusSection = ({erasmus}) => {
    if (erasmus.length > 0) {
        return (
            <div>
                <Container
                    className='px-0'
                    style={{height: 200, width: 350, overflowY: 'scroll'}}
                >
                    {erasmus.map((eras) => {
                        const studyPeriod = getTimePeriod(eras.start_date, eras.end_date)
                        const semester = getSemester(eras.semester, eras.start_date)
                        return (
                            <div key={eras.id} style={{borderBottom: '1px solid #ccc'}}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <p className='m-0'>{eras.inst_name}</p>
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
                                    <p style={{color: '#999', fontSize: 14}}>{eras.opinion}</p>
                                </Container>
                            </div>
                        )
                    })}
                </Container>
            </div>
        )
    } else {
        return null
    }
}

const SocialsSection = ({socials}) => {
    const getIcon = (name) => {
        if (name.toLowerCase() === 'facebook') {
            return <Facebook size={50}/>
        } else if (name.toLowerCase() === 'linkedin') {
            return <Linkedin size={50}/>
        } else {
            return <Link45deg size={50}/>
        }
    }

    return (
        <div style={{display: 'inline'}}>
            {socials.map((social, i) => (
                <div key={i} className='mx-1' style={{display: 'inline-block'}}>
                    <a
                        target='_blank'
                        rel="noreferrer"
                        className={`${styles[social.social_media_name.toLowerCase()]} ${
                            styles.smGlobalBtn
                        }`}
                        href={social.link}
                    >
                        {getIcon(social.social_media_name)}
                    </a>
                </div>
            ))}
        </div>
    )
}

const CertificatesSection = ({certs}) => {
    return (
        <div>
            <SectionHeading title={'Certificates'}/>
            <Container>
                {certs.map((cert, i) => (
                    <div key={i}>
                        {cert.certificate_name}
                        <Container style={{fontSize: 14, color: '#999'}}>
                            Issued by: {cert.issuing_authority}
                        </Container>
                    </div>
                ))}
            </Container>
        </div>
    )
}

const ProfileEduSection = ({edu}) => {
    return (
        <div>
            {/* <SectionHeading title='Education' /> */}
            <Container
                className='px-0'
                style={{height: 200, width: 350, overflowY: 'scroll'}}
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
                            style={{fontSize: 18, borderBottom: '1px solid #ccc'}}
                            className='mb-3 pb-1'
                        >
                            {datum.degree_name} - {datum.name_of_program}
                            <Container style={{fontSize: 14, color: '#999'}}>
                                <div style={{color: 'black', fontSize: 16}}>
                                    {datum.inst_name}
                                </div>
                                <div style={{color: 'rgb(245,164,37)'}}>
                                    <GeoAltFill/>
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

const ProfileHighSchoolSection = ({highSchool}) => {
    console.log(highSchool)
    if (highSchool.length == 0) {
        return (
            <Container
                className='px-0'
                style={{height: 200, width: 350, overflowY: 'scroll', color: '#999'}}
            >
                No data available
            </Container>
        )
    }
    return (
        <Container
            className='px-0'
            style={{height: 200, width: 350, overflowY: 'scroll'}}
        >
            {highSchool.map((highSchool, i) => {
                return (
                    <div key={i}>
                        <div
                            className='pb-1'
                            style={{fontSize: 18, borderBottom: '1px solid #ccc'}}
                        >
                            {highSchool.high_school_name}
                        </div>
                    </div>
                )
            })}
        </Container>
    )
}

const ProfileStudentSocieties = ({societies}) => {
    return (
        <div className='mt-4'>
            <SectionHeading title='Societies'/>
            <Container>
                {societies.map((society, i) => {
                    return (
                        <div style={{display: 'flex', alignItems: 'center'}} key={i}>
                            {society.society_name}
                            <span className='ms-2' style={{color: '#999'}}>
                {society.activity_status == 1 ? 'Active' : 'Inactive'}
              </span>
                        </div>
                    )
                })}
            </Container>
        </div>
    )
}

const Profile = ({user, errors}) => {
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
        basic_info
    } = user
     console.log(user)

    return (
        <>
            <div style={{height: '100vh'}}>
                <NavigationBar/>
                <div className='d-flex' style={{height: '100%'}}>
                    <UserInfoSidebar/>
                    <Container>
                        <Row>
                            <Col md='auto'>
                                <img
                                    width={400}
                                    height={300}
                                    style={{objectFit: 'contain'}}
                                    src={getProfilePicturePath(
                                        profile_picture[0].visibility,
                                        profile_picture[0].profile_picture
                                    )}
                                />
                                <Container>
                                    <Tabs defaultActiveKey='education' className='my-2'>
                                        <Tab eventKey='education' title='Education'>
                                            <ProfileEduSection edu={edu_records}/>
                                        </Tab>
                                        <Tab eventKey='erasmus' title='Erasmus'>
                                            <ProfileErasmusSection erasmus={erasmus}/>
                                        </Tab>
                                        <Tab eventKey='highSchool' title='High School'>
                                            <ProfileHighSchoolSection highSchool={high_school}/>
                                        </Tab>
                                    </Tabs>
                                    <SkillsSection skills={skills}/>
                                </Container>
                            </Col>
                            <Col>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 style={{display: 'flex', alignItems: 'baseline'}}>
                                        {basic_info[0].first_name} {basic_info[0].last_name}
                                        <span
                                            className='ms-4'
                                            style={{
                                                fontSize: 14,
                                                alignItems: 'baseline',
                                                display: 'flex',
                                            }}
                                        >
                      <GeoAltFill size={18} fill='#f5a425'/>
                                            {location[0].city_name}, {location[0].country_name}
                    </span>
                                    </h4>
                                    <span className=''>
                    <SocialsSection socials={socials}/>
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
                                    <Row style={{color: '#999'}}>
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
                                        <ProfileWorkSection work={work_records}/>
                                    </Tab>
                                    <Tab eventKey='internship' title='Internship'>
                                        <ProfileInternshipSection internships={internships}/>
                                    </Tab>
                                </Tabs>
                                <CertificatesSection certs={certificates}/>
                                <ProfileStudentSocieties societies={societies}/>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

            <ProfileEditModal user={user}/>
        </>
    )
}

export async function getServerSideProps() {
    const {data, errors} = await fetchProfile(1);

    return {props: {user: data, errors: errors}}
}

export default Profile
