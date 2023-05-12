import { useEffect, useState } from 'react'
import { PencilSquare } from 'react-bootstrap-icons'
import {
  Modal,
  Button,
  Accordion,
  Popover,
  OverlayTrigger,
} from 'react-bootstrap'
import styles from './ProfileEditModal.module.css'
import PersonalInformationForm from '../../Forms/UserProfileForms/PersonalInformationForm/PersonalInformationForm'
import WorkInformationForm from '../../Forms/UserProfileForms/WorkInformationForm/WorkInformationForm'
import EducationInformationForm from '../../Forms/UserProfileForms/EducationalInformationForm/EducationalInformationForm'
import CertificatesInformationForm from '../../Forms/UserProfileForms/CertificatesInformationForm/CertificatesInformationForm'
import SkillsInformationForm from '../../Forms/UserProfileForms/SkillsInformationForm/SkillsInformationForm'
import SocietiesInformationForm from '../../Forms/UserProfileForms/SocietiesInformationForm/SocietiesInformationForm'
import ExamsInformationForm from '../../Forms/UserProfileForms/ExamsInformationForm/ExamsInformationForm'
import ProjectsInformationForm from '../../Forms/UserProfileForms/ProjectsInformationForm/ProjectsInformationForm'
import ContactInformationForm from '../../Forms/UserProfileForms/ContactInformationForm/ContactInformationForm'
import ErasmusInformationForm from '../../Forms/UserProfileForms/ErasmusInformationForm/ErasmusInformationForm'
import InternshipInformationForm from '../../Forms/UserProfileForms/InternshipInformationForm/InternshipInformationForm'
import { ToastContainer } from 'react-toastify'

const ProfileEditModal = ({ user, refreshProfile }) => {
  const [isUpdated, setIsUpdated] = useState(false)
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
    projects,
    internships,
    erasmus,
  } = user

  const personalInfoData = {
    location,
    career_objective,
    basic_info,
    wanted_sectors,
    high_school,
  }

  const user_id = basic_info[0].id

  const projectInfoData = {
    graduation_project,
    projects,
  }

  const contactInfoData = {
    emails,
    phone_numbers,
    socials,
  }

  const handleClose = () => {
    if (isUpdated) {
      refreshProfile()
      setIsUpdated(false)
    }
    setShow(false)
  }
  const handleShow = () => setShow(true)

  const hideAllUserData = () => {
    console.log('hide all data')
    //hide all data API here
  }

  const hideAllDataPopover = (
    <Popover title='Hide All Data?'>
      <div className='p-2'>
        Are you sure you would like to hide all your data?
        <div className='d-flex justify-content-end'>
          <Button
            style={{ fontSize: 'small', padding: '2px 5px' }}
            onClick={hideAllUserData}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Popover>
  )

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
                <PersonalInformationForm
                  data={personalInfoData}
                  user_id={user_id}
                  setIsUpdated={setIsUpdated}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='1'>
              <Accordion.Header>Contact Information</Accordion.Header>
              <Accordion.Body style={{ overflowY: 'scroll' }}>
                <ContactInformationForm
                  data={contactInfoData}
                  user_id={user_id}
                  setIsUpdated={setIsUpdated}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='2'>
              <Accordion.Header>Work Information</Accordion.Header>
              <Accordion.Body>
                <WorkInformationForm
                  data={work_records}
                  user_id={user_id}
                  setIsUpdated={setIsUpdated}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='3'>
              <Accordion.Header>Education Information</Accordion.Header>
              <Accordion.Body>
                <EducationInformationForm
                  data={edu_records}
                  user_id={user_id}
                  setIsUpdated={setIsUpdated}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='4'>
              <Accordion.Header>Erasmus</Accordion.Header>
              <Accordion.Body>
                <ErasmusInformationForm
                  data={erasmus}
                  user_id={user_id}
                  setIsUpdated={setIsUpdated}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='5'>
              <Accordion.Header>Internships</Accordion.Header>
              <Accordion.Body>
                <InternshipInformationForm
                  data={internships}
                  user_id={user_id}
                  setIsUpdated={setIsUpdated}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='6'>
              <Accordion.Header>Projects</Accordion.Header>
              <Accordion.Body>
                <ProjectsInformationForm
                  data={projectInfoData}
                  user_id={user_id}
                  setIsUpdated={setIsUpdated}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='7'>
              <Accordion.Header>Certificates</Accordion.Header>
              <Accordion.Body>
                <CertificatesInformationForm
                  data={certificates}
                  user_id={user_id}
                  setIsUpdated={setIsUpdated}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='8'>
              <Accordion.Header>Skills</Accordion.Header>
              <Accordion.Body>
                <SkillsInformationForm
                  data={skills}
                  user_id={user_id}
                  setIsUpdated={setIsUpdated}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='9'>
              <Accordion.Header>Clubs & Societies</Accordion.Header>
              <Accordion.Body>
                <SocietiesInformationForm
                  data={societies}
                  user_id={user_id}
                  setIsUpdated={setIsUpdated}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='10'>
              <Accordion.Header>Exams</Accordion.Header>
              <Accordion.Body>
                <ExamsInformationForm
                  data={exams}
                  user_id={user_id}
                  setIsUpdated={setIsUpdated}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <OverlayTrigger
            trigger='click'
            placement='top'
            overlay={hideAllDataPopover}
            rootClose
          >
            <Button>Hide All Data</Button>
          </OverlayTrigger>

          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
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
      </Modal>
    </>
  )
}

export default ProfileEditModal
