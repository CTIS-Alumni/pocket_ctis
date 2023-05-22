import styles from '../../styles/addEntities.module.css'
import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import CompanyForm from '../../components/EntityForms/CompanyForm'
import EducationalInstituteForm from '../../components/EntityForms/EducationalInstituteForm'
import HighSchoolForm from '../../components/EntityForms/HighSchoolForm'
import SkillTypeForm from '../../components/EntityForms/SkillTypeForm'
import DegreeTypeForm from '../../components/EntityForms/DegreeTypeForm'
import WorkTypeForm from '../../components/EntityForms/WorkTypeForm'
import SectorForm from '../../components/EntityForms/SectorForm'
import SocietiesForm from '../../components/EntityForms/SocietiesForm'
import ExamForm from '../../components/EntityForms/ExamForm'
import SkillsForm from '../../components/EntityForms/SkillsForm'
import GraduationProjectForm from '../../components/EntityForms/GraduationProjectForm'
import CompanyDashboard from '../../components/EntityDashboards/CompanyDashboard'
import SectorsDashboard from '../../components/EntityDashboards/SectorsDashboard'
import EducationInstitutesDashboard from '../../components/EntityDashboards/EducationInstitutesDashboard'
import SkillTypeDashboard from '../../components/EntityDashboards/SkillTypeDashboard'
import WorkTypeDashboard from '../../components/EntityDashboards/WorkTypeDashboard'
import DegreeTypeDashboard from '../../components/EntityDashboards/DegreeTypeDashboard'
import HighSchoolDashboard from '../../components/EntityDashboards/HighSchoolDashboard'
import SocietiesDashboard from '../../components/EntityDashboards/SocietiesDashboard'
import ExamsDashboard from '../../components/EntityDashboards/ExamsDashboard'
import SkillsDashboard from '../../components/EntityDashboards/SkillsDashboard'
import GraduationProjectDashboard from '../../components/EntityDashboards/GraduationProjectDashboard'

const AddEntitiesDashboard = () => {
  const [activeKey, setActiveKey] = useState('Company')

  return (
    <AdminPageContainer>
      <div className={styles.pageContainer}>
        <div className={styles.sidebar}>
          <h5>Add Entities</h5>
          <div
            className={activeKey == 'Company' ? styles.active : styles.inActive}
            onClick={() => setActiveKey('Company')}
          >
            Company
          </div>
          <div
            className={activeKey == 'Sector' ? styles.active : styles.inActive}
            onClick={() => setActiveKey('Sector')}
          >
            Sector
          </div>
          <div
            className={
              activeKey == 'Educational Institute'
                ? styles.active
                : styles.inActive
            }
            onClick={() => setActiveKey('Educational Institute')}
          >
            Educational Institute
          </div>
          <div
            className={
              activeKey == 'Graduation Project'
                ? styles.active
                : styles.inActive
            }
            onClick={() => setActiveKey('Graduation Project')}
          >
            Graduation Project
          </div>
          <div
            className={activeKey == 'Skills' ? styles.active : styles.inActive}
            onClick={() => setActiveKey('Skills')}
          >
            Skills
          </div>
          <div
            className={activeKey == 'Exams' ? styles.active : styles.inActive}
            onClick={() => setActiveKey('Exams')}
          >
            Exams
          </div>
          <div
            className={
              activeKey == 'Societies' ? styles.active : styles.inActive
            }
            onClick={() => setActiveKey('Societies')}
          >
            Societies
          </div>
          <div
            className={
              activeKey == 'Degree Types' ? styles.active : styles.inActive
            }
            onClick={() => setActiveKey('Degree Types')}
          >
            Degree Types
          </div>
          <div
            className={
              activeKey == 'Skill Types' ? styles.active : styles.inActive
            }
            onClick={() => setActiveKey('Skill Types')}
          >
            Skill Types
          </div>
          <div
            className={
              activeKey == 'High Schools' ? styles.active : styles.inActive
            }
            onClick={() => setActiveKey('High Schools')}
          >
            High Schools
          </div>
          <div
            className={
              activeKey == 'Work Types' ? styles.active : styles.inActive
            }
            onClick={() => setActiveKey('Work Types')}
          >
            Work Types
          </div>
        </div>

        <div className={styles.formBody}>
          {activeKey == 'Company' && <CompanyDashboard />}
          {activeKey == 'Educational Institute' && (
            <EducationInstitutesDashboard />
          )}
          {activeKey == 'High Schools' && <HighSchoolDashboard />}
          {activeKey == 'Skill Types' && <SkillTypeDashboard />}
          {activeKey == 'Degree Types' && <DegreeTypeDashboard />}
          {activeKey == 'Work Types' && <WorkTypeDashboard />}
          {activeKey == 'Sector' && <SectorsDashboard />}
          {activeKey == 'Societies' && <SocietiesDashboard />}
          {activeKey == 'Exams' && <ExamsDashboard />}
          {activeKey == 'Skills' && <SkillsDashboard />}
          {activeKey == 'Graduation Project' && <GraduationProjectDashboard />}
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
    </AdminPageContainer>
  )
}

export default AddEntitiesDashboard
