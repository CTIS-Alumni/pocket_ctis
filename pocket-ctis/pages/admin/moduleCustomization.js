import { useState, useEffect } from 'react'
import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import {Card, Container, OverlayTrigger, Tab, Tabs} from 'react-bootstrap'
import styles from '../../styles/moduleCustomization.module.css'
import modules from '../../config/moduleConfig'
import departmentConfig from '../../config/departmentConfig'
import { useFormik } from 'formik'
import {_submitFetcher, _submitFile} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {toast, ToastContainer} from "react-toastify";
import {XLg} from "react-bootstrap-icons";
import {getAppLogoPath, getProfilePicturePath} from "../../helpers/formatHelpers";

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

const DepartmentInformationForm = ({}) => {
  const [showCurrentImage, setShowCurrentImage] = useState();
  const [activeKey, setActiveKey] = useState('')
  const [fileInputResetKey, setfileInputResetKey] = useState(
      Math.random().toString(36)
  )
  const [appLogo, setAppLogo] = useState()
  const [preview, setPreview] = useState()

  useEffect(()=>{
    if(departmentConfig.app_logo !== "")
      setShowCurrentImage(departmentConfig.app_logo);
  }, [])

  useEffect(() => {
    if (!appLogo) {
      setPreview(undefined)
      setfileInputResetKey(Math.random().toString(36))
      return
    }

    const objectUrl = URL.createObjectURL(appLogo)
    setPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [appLogo])

  const onSubmitHandler = async (val) => {
    console.log("appLogo", appLogo, "showCurrentImage", showCurrentImage)
    if(appLogo)
      val.app_logo = appLogo["name"];
    else {
      if(showCurrentImage){
        val.app_logo = showCurrentImage;
      }else val.app_logo = "";
    }

    const formData = new FormData()
    formData.append('department_name', val.department_name)
    formData.append('abbreviation', val.abbreviation)
    formData.append('app_name', val.app_name)
    formData.append('app_logo', val.app_logo)
    formData.append('appImage', appLogo)

    const res = await _submitFile(
        'POST',
        craftUrl(['departmentcustomization']),
        formData
    )
    console.log("res", res);
    if(res.data)
      toast.success("Department information saved successfully!");
    else toast.error(res.errors[0].error);
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...departmentConfig },
    onSubmit: onSubmitHandler,
  })

  return (
      <Container style={{ marginTop: 10 }}>
        <h4>Department Customization</h4>
        <Card style={{ padding: 20 }} className='mb-2' border='light'>
        <form onSubmit={formik.handleSubmit}>
          <CollapsibleMenu
              itemKey='Department Information'
              activeKey={activeKey}
              setActiveKey={setActiveKey}
          >
            <div className={styles.section}>
              <div className={styles.inputContainer}>
                <label>Full Department Name</label>
                <input
                    type='text'
                    name='department_name'
                    id='department_name'
                    value={
                      formik.values.department_name
                    }
                    onChange={formik.handleChange}
                />
              </div>
              <div className={styles.inputContainer}>
                <label>Department Name Abbreviation</label>
                <input
                    type='text'
                    name='abbreviation'
                    id='abbreviation'
                    value={
                      formik.values.abbreviation
                    }
                    onChange={formik.handleChange}
                />
              </div>
            </div>
          </CollapsibleMenu>

          <CollapsibleMenu
              itemKey='App Information'
              activeKey={activeKey}
              setActiveKey={setActiveKey}
          >
            <div className={styles.section}>
              <div className={styles.inputContainer}>
                <label>Application Name</label>
                <input
                    type='text'
                    name='app_name'
                    id='app_name'
                    value={
                      formik.values.app_name
                    }
                    onChange={formik.handleChange}
                />
              </div>

            </div>
            <div className={styles.section}>
              <div className={styles.inputContainer}>
                <label>Application Logo</label>
                <input
                    type='file'
                    accept='image/png, image/gif, image/jpeg'
                    key={fileInputResetKey || ''}
                    onChange={(event) => {
                      if (!event.target.files || event.target.files.length === 0) {
                        setAppLogo(null)
                      } else {
                        setAppLogo(event.target.files[0])
                      }
                    }}
                />

                <div style={{marginTop: 10}}>
                  { (!preview ? ( getAppLogoPath() && showCurrentImage &&
                      (<div className={styles.previewContainer}>
                          <div className={styles.previewRemover}
                               onClick={() =>
                          {
                            setShowCurrentImage()
                            setAppLogo()
                            setPreview()
                            formik.setFieldValue("app_logo", "");
                          }}
                          >
                            <XLg />
                          </div>
                          <img
                              className={styles.appLogo}
                              src={getAppLogoPath()}
                              width={250}
                              height={250}
                          />
                        </div>)
                  ) : (
                      <div className={styles.previewContainer}>
                        <div
                            className={styles.previewRemover}
                            onClick={() =>
                            {
                              setAppLogo()
                              setPreview()
                              formik.setFieldValue("app_logo", "");
                            }}
                        >
                          <XLg />
                        </div>
                        <img
                            className={styles.appLogo}
                            src={preview}
                            width={250}
                            height={250}
                        />
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleMenu>
          <button type='submit' className={styles.saveBtn}>
            Save
          </button>
        </form>
        </Card>
      </Container>
  )
}

const ModuleCustomization = () => {
  const [activeKey, setActiveKey] = useState('')
  const [activeTab, setActiveTab] = useState('modules')
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

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
      <Tabs
          defaultActiveKey='modules'
          activeKey={activeTab}
          onSelect={(key) => {
            setActiveTab(key)
            setRefreshKey(Math.random().toString(36))
          }}
      >
        <Tab title='Modules' eventKey='modules'>
          <Container style={{ marginTop: 10 }}>
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
          </Container>
        </Tab>
        <Tab title='Department Info' eventKey='department'>
          <Container style={{ marginTop: 10 }}>
            <DepartmentInformationForm/>
          </Container>
        </Tab>
      </Tabs>
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
