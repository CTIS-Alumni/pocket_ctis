import { useState, useEffect } from 'react'
import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import { Card, Container } from 'react-bootstrap'
import styles from '../../styles/moduleCustomization.module.css'
import modules from '../../config/moduleConfig'
import { useFormik } from 'formik'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {toast, ToastContainer} from "react-toastify";

const CollapsibleMenu = ({ itemKey, activeKey, setActiveKey, children }) => {
  return (
    <div>
      <h5
        className={styles.collapsibleHeading}
        onClick={() => setActiveKey(activeKey == itemKey ? '' : itemKey)}
      >
        {itemKey}
      </h5>
      <div
        className={`${styles.collapsible} ${
          activeKey == itemKey && styles.active
        }`}
      >
        <Container>{children}</Container>
      </div>
      <hr className={styles.break} />
    </div>
  )
}

const ModuleCustomization = () => {
  const [activeKey, setActiveKey] = useState('')

  const onSubmitHandler = async (val) => {
    const {data, errors} = await _submitFetcher('POST', craftUrl(['modulecustomization']), {modules: val});
    if(data)
      toast.success("Modules saved successfully!");
    else toast.error(errors[0].error);
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...modules },
    onSubmit: onSubmitHandler,
  })

  return (
    <AdminPageContainer>
      <h4>Module Customization</h4>
      <Card style={{ padding: 20 }} className='mb-2' border='light'>
        <form onSubmit={formik.handleSubmit}>
          <CollapsibleMenu
            itemKey='Company'
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          >
            <div>
              <label>
                <input
                  type='checkbox'
                  name='companies.user_addable'
                  id='companies.user_addable'
                  checked={formik.values.companies.user_addable}
                  onChange={formik.handleChange}
                />
                User Addable
              </label>
            </div>
          </CollapsibleMenu>

          <CollapsibleMenu
            itemKey='Sector'
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          >
            <div>
              <label>
                <input
                  type='checkbox'
                  name='sectors.user_addable'
                  id='sectors.user_addable'
                  checked={formik.values.sectors.user_addable}
                  onChange={formik.handleChange}
                />
                User Addable
              </label>
            </div>
          </CollapsibleMenu>
          <CollapsibleMenu
            itemKey='Educational Institutes'
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          >
            <div>
              <label>
                <input
                  type='checkbox'
                  name='edu_insts.user_addable'
                  id='edu_insts.user_addable'
                  checked={formik.values.edu_insts.user_addable}
                  onChange={formik.handleChange}
                />
                User Addable
              </label>
            </div>
          </CollapsibleMenu>
          <CollapsibleMenu
            itemKey='High Schools'
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          >
            <div>
              <label>
                <input
                  type='checkbox'
                  name='highschool.user_addable'
                  id='highschool.user_addable'
                  checked={formik.values.highschool.user_addable}
                  onChange={formik.handleChange}
                />
                User Addable
              </label>
            </div>
          </CollapsibleMenu>
          <CollapsibleMenu
            itemKey='Skills'
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          >
            <div>
              <label>
                <input
                  type='checkbox'
                  name='skills.user_addable'
                  id='skills.user_addable'
                  checked={formik.values.skills.user_addable}
                  onChange={formik.handleChange}
                />
                User Addable
              </label>
            </div>
          </CollapsibleMenu>
          <CollapsibleMenu
            itemKey='Exams'
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          >
            <div>
              <label>
                <input
                  type='checkbox'
                  name='exams.user_addable'
                  id='exams.user_addable'
                  checked={formik.values.exams.user_addable}
                  onChange={formik.handleChange}
                />
                User Addable
              </label>
            </div>
          </CollapsibleMenu>
          <CollapsibleMenu
            itemKey='Student Societies'
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          >
            <div>
              <label>
                <input
                  type='checkbox'
                  name='student_societies.user_addable'
                  id='student_societies.user_addable'
                  checked={formik.values.student_societies.user_addable}
                  onChange={formik.handleChange}
                />
                User Addable
              </label>
            </div>
          </CollapsibleMenu>
          <CollapsibleMenu
            itemKey='Erasmus'
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          >
            <div>
              <label>
                <input
                  type='checkbox'
                  name='erasmus.user_visible'
                  id='erasmus.user_visible'
                  checked={formik.values.erasmus.user_visible}
                  onChange={formik.handleChange}
                />
                User Visibile
              </label>
            </div>
          </CollapsibleMenu>
          <CollapsibleMenu
            itemKey='Graduation Projects'
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          >
            <div>
              <label>
                <input
                  type='checkbox'
                  name='graduation_projects.user_visible'
                  id='graduation_projects.user_visible'
                  checked={formik.values.graduation_projects.user_visible}
                  onChange={formik.handleChange}
                />
                User Visibile
              </label>
            </div>
          </CollapsibleMenu>
          <CollapsibleMenu
            itemKey='Internships'
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          >
            <div>
              <label>
                <input
                  type='checkbox'
                  name='internships.user_visible'
                  id='internships.user_visible'
                  checked={formik.values.internships.user_visible}
                  onChange={formik.handleChange}
                />
                User Visibile
              </label>
            </div>
          </CollapsibleMenu>

          <CollapsibleMenu
            itemKey='User Profile Data'
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          >
            <div className={styles.section}>
              <div>Graduation Projects</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.graudation_projects.limit_per_user'
                  id='user_profile_data.graudation_projects.limit_per_user'
                  value={
                    formik.values.user_profile_data.graudation_projects
                      .limit_per_user
                  }
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Internships</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                    type='number'
                    name='user_profile_data.internships.limit_per_user'
                    id='user_profile_data.internships.limit_per_user'
                    value={
                      formik.values.user_profile_data.internships
                          .limit_per_user
                    }
                    onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Erasmus</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                    type='number'
                    name='user_profile_data.erasmus.limit_per_user'
                    id='user_profile_data.erasmus.limit_per_user'
                    value={
                      formik.values.user_profile_data.erasmus
                          .limit_per_user
                    }
                    onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Phone numbers</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.phone_numbers.limit_per_user'
                  id='user_profile_data.phone_numbers.limit_per_user'
                  value={
                    formik.values.user_profile_data.phone_numbers.limit_per_user
                  }
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Exams</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.exams.limit_per_user'
                  id='user_profile_data.exams.limit_per_user'
                  value={formik.values.user_profile_data.exams.limit_per_user}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Emails</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.emails.limit_per_user'
                  id='user_profile_data.emails.limit_per_user'
                  value={formik.values.user_profile_data.emails.limit_per_user}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Education Records</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.education_records.limit_per_user'
                  id='user_profile_data.education_records.limit_per_user'
                  value={
                    formik.values.user_profile_data.education_records
                      .limit_per_user
                  }
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Certificates</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.certificates.limit_per_user'
                  id='user_profile_data.certificates.limit_per_user'
                  value={
                    formik.values.user_profile_data.certificates.limit_per_user
                  }
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Projects</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.projects.limit_per_user'
                  id='user_profile_data.projects.limit_per_user'
                  value={
                    formik.values.user_profile_data.projects.limit_per_user
                  }
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Wanted Sectors</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.wanted_sectors.limit_per_user'
                  id='user_profile_data.wanted_sectors.limit_per_user'
                  value={
                    formik.values.user_profile_data.wanted_sectors
                      .limit_per_user
                  }
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Social Media</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.social_media.limit_per_user'
                  id='user_profile_data.social_media.limit_per_user'
                  value={
                    formik.values.user_profile_data.social_media.limit_per_user
                  }
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Student Societies</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.student_societies.limit_per_user'
                  id='user_profile_data.student_societies.limit_per_user'
                  value={
                    formik.values.user_profile_data.student_societies
                      .limit_per_user
                  }
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Work Records</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.work_records.limit_per_user'
                  id='user_profile_data.work_records.limit_per_user'
                  value={
                    formik.values.user_profile_data.work_records.limit_per_user
                  }
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className={styles.section}>
              <div>Skills</div>
              <div className={styles.inputContainer}>
                <label>Limit per user</label>
                <input
                  type='number'
                  name='user_profile_data.skills.limit_per_user'
                  id='user_profile_data.skills.limit_per_user'
                  value={formik.values.user_profile_data.skills.limit_per_user}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </CollapsibleMenu>

          <button type='submit' className={styles.saveBtn}>
            Save
          </button>
        </form>
      </Card>
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

export default ModuleCustomization
