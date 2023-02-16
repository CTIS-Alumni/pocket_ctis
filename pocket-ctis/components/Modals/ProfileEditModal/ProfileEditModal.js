import { useState } from 'react'
import { PencilSquare } from 'react-bootstrap-icons'
import { Modal, Button, Accordion } from 'react-bootstrap'
import styles from './ProfileEditModal.module.css'
import PersonalInformationForm from '../../Forms/UserProfileForms/PersonalInformationForm/PersonalInformationForm'
import WorkInformationForm from '../../Forms/UserProfileForms/WorkInformationForm/WorkInformationForm'
import EducationInformationForm from '../../Forms/UserProfileForms/EducationalInformationForm/EducationalInformationForm'
import HighSchoolInformationForm from '../../Forms/UserProfileForms/HighSchoolInformationForm/HighSchoolInformationForm'
import CertificatesInformationForm from '../../Forms/UserProfileForms/CertificatesInformationForm/CertificatesInformationForm'
import SkillsInformationForm from '../../Forms/UserProfileForms/SkillsInformationForm/SkillsInformationForm'
import SocietiesInformationForm from '../../Forms/UserProfileForms/SocietiesInformationForm/SocietiesInformationForm'

const ProfileEditModal = ({ user }) => {
  const [show, setShow] = useState(false)
  const {
    certificates,
    edu_records,
    emails,
    work_records,
    phone_numbers,
    socials,
    skills,
    location,
    societies,
    career_objective,
    high_school,
    basic_info,
  } = user
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const personalInfoData = {
    emails,
    phone_numbers,
    socials,
    location,
    career_objective,
    basic_info,
  }

  return (
    <>
      <div
        onClick={handleShow}
        className='mx-1'
        style={{ display: 'inline-block' }}
      >
        <div className={styles.editBtn}>
          <PencilSquare color='black' />
        </div>
      </div>

      <Modal
        size='lg'
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion defaultActiveKey='6' flush>
            <Accordion.Item eventKey='0'>
              <Accordion.Header>Personal Information</Accordion.Header>
              <Accordion.Body style={{ overflowY: 'scroll' }}>
                <PersonalInformationForm data={personalInfoData} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='1'>
              <Accordion.Header>Work Information</Accordion.Header>
              <Accordion.Body>
                <WorkInformationForm data={work_records} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='2'>
              <Accordion.Header>Education Information</Accordion.Header>
              <Accordion.Body>
                <EducationInformationForm data={edu_records} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='3'>
              <Accordion.Header>High School Information</Accordion.Header>
              <Accordion.Body>
                <HighSchoolInformationForm data={high_school} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='4'>
              <Accordion.Header>Certificates</Accordion.Header>
              <Accordion.Body>
                <CertificatesInformationForm data={certificates} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='5'>
              <Accordion.Header>Skills</Accordion.Header>
              <Accordion.Body>
                <SkillsInformationForm data={skills} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='6'>
              <Accordion.Header>Socieites</Accordion.Header>
              <Accordion.Body>
                <SocietiesInformationForm data={societies} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ProfileEditModal
