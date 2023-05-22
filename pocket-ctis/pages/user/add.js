import { useState } from 'react'
import UserPageContainer from '../../components/UserPageContainer/UserPageContainer'
import styles from '../../styles/userAddEntities.module.css'
import { ToastContainer } from 'react-toastify'
import modules from '../../config/moduleConfig'
import CompanyForm from '../../components/EntityForms/CompanyForm'
import SkillsForm from '../../components/EntityForms/SkillsForm'
import SocietiesForm from '../../components/EntityForms/SocietiesForm'
import HighSchoolForm from '../../components/EntityForms/HighSchoolForm'
import ExamForm from '../../components/EntityForms/ExamForm'
import EducationalInstituteForm from '../../components/EntityForms/EducationalInstituteForm'
import SectorForm from '../../components/EntityForms/SectorForm'

const SideBarButton = ({ title, activeKey, setActiveKey }) => (
  <div
    className={activeKey == title ? styles.active : styles.inActive}
    onClick={() => setActiveKey(title)}
  >
    {title}
  </div>
)

const AddEntities = () => {
  const [activeKey, setActiveKey] = useState('')

  return (
    <UserPageContainer>
      <div className={styles.pageContainer}>
        <div className={styles.sidebar}>
          <h5>Add Entities</h5>
          {modules.companies.user_addable && (
            <SideBarButton
              title='Companies'
              activeKey={activeKey}
              setActiveKey={setActiveKey}
            />
          )}
          {modules.edu_insts.user_addable && (
            <SideBarButton
              title='Education Institutes'
              activeKey={activeKey}
              setActiveKey={setActiveKey}
            />
          )}
          {modules.sectors.user_addable && (
            <SideBarButton
              title='Sectors'
              activeKey={activeKey}
              setActiveKey={setActiveKey}
            />
          )}
          {modules.exams.user_addable && (
            <SideBarButton
              title='Exams'
              activeKey={activeKey}
              setActiveKey={setActiveKey}
            />
          )}
          {modules.highschool.user_addable && (
            <SideBarButton
              title='High School'
              activeKey={activeKey}
              setActiveKey={setActiveKey}
            />
          )}
          {modules.student_societies.user_addable && (
            <SideBarButton
              title='Student Societies'
              activeKey={activeKey}
              setActiveKey={setActiveKey}
            />
          )}
          {modules.skills.user_addable && (
            <SideBarButton
              title='Skills'
              activeKey={activeKey}
              setActiveKey={setActiveKey}
            />
          )}
        </div>

        <div className={styles.formBody}>
          {activeKey == 'Companies' && <CompanyForm />}
          {activeKey == 'Education Institutes' && <EducationalInstituteForm />}
          {activeKey == 'Sectors' && <SectorForm />}
          {activeKey == 'Exams' && <ExamForm />}
          {activeKey == 'High School' && <HighSchoolForm />}
          {activeKey == 'Student Societies' && <SocietiesForm />}
          {activeKey == 'Skills' && <SkillsForm />}
        </div>
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
      />
    </UserPageContainer>
  )
}

export default AddEntities
