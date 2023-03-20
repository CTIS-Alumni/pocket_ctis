import { useState } from 'react'
import { PencilSquare} from 'react-bootstrap-icons'
import { Modal, Button, Accordion} from 'react-bootstrap'
import styles from './ProfileEditModal.module.css'
import PersonalInformationForm from '../../Forms/UserProfileForms/PersonalInformationForm/PersonalInformationForm'
import WorkInformationForm from '../../Forms/UserProfileForms/WorkInformationForm/WorkInformationForm'
import EducationInformationForm from '../../Forms/UserProfileForms/EducationalInformationForm/EducationalInformationForm'
import CertificatesInformationForm from '../../Forms/UserProfileForms/CertificatesInformationForm/CertificatesInformationForm'
import SkillsInformationForm from '../../Forms/UserProfileForms/SkillsInformationForm/SkillsInformationForm'
import SocietiesInformationForm from '../../Forms/UserProfileForms/SocietiesInformationForm/SocietiesInformationForm'
import ExamsInformationForm from '../../Forms/UserProfileForms/ExamsInformationForm/ExamsInformationForm'
import ProjectsInformationForm from "../../Forms/UserProfileForms/ProjectsInformationForm/ProjectsInformationForm";
import ContactInformationForm from "../../Forms/UserProfileForms/ContactInformationForm/ContactInformationForm";

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
    wanted_sectors,
    exams,
    graduation_project,
    projects
  } = user
  // console.log(user)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const personalInfoData = {
    location,
    career_objective,
    basic_info,
    wanted_sectors,
    high_school
  }

  const user_id = basic_info[0].id;

  const projectInfoData = {
    graduation_project,
    projects
  }

  const contactInfoData = {
    emails,
    phone_numbers,
    socials
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
          <Accordion defaultActiveKey='0' flush>
            <Accordion.Item eventKey='0'>
              <Accordion.Header>Personal Information</Accordion.Header>
              <Accordion.Body style={{ overflowY: 'scroll' }}>
                <PersonalInformationForm data={personalInfoData} user_id = {user_id}/>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='1'>
              <Accordion.Header>Contact Information</Accordion.Header>
              <Accordion.Body style={{ overflowY: 'scroll' }}>
                <ContactInformationForm data={contactInfoData} user_id = {user_id}/>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='2'>
              <Accordion.Header>Work Information</Accordion.Header>
              <Accordion.Body>
                <WorkInformationForm data={work_records} user_id = {user_id}/>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='3'>
              <Accordion.Header>Education Information</Accordion.Header>
              <Accordion.Body>
                <EducationInformationForm data={edu_records} user_id = {user_id}/>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='4'>
              <Accordion.Header>Projects</Accordion.Header>
              <Accordion.Body>
                <ProjectsInformationForm data={projectInfoData} user_id = {user_id}/>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='5'>
              <Accordion.Header>Certificates</Accordion.Header>
              <Accordion.Body>
                <CertificatesInformationForm data={certificates} user_id = {user_id}/>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='6'>
              <Accordion.Header>Skills</Accordion.Header>
              <Accordion.Body>
                <SkillsInformationForm data={skills} user_id = {user_id}/>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='7'>
              <Accordion.Header>Clubs & Societies</Accordion.Header>
              <Accordion.Body>
                <SocietiesInformationForm data={societies} user_id = {user_id}/>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='8'>
              <Accordion.Header>Exams</Accordion.Header>
              <Accordion.Body>
                <ExamsInformationForm data={exams} user_id = {user_id}/>
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
