import { useState, useEffect } from 'react'
import { FieldArray, Field, Formik, Form } from 'formik'
import styles from './AdminUserFormStyles.module.css'
import { PlusCircleFill, XCircleFill } from 'react-bootstrap-icons'
import { _getFetcher } from '../../../../helpers/fetchHelpers'
import { craftUrl } from '../../../../helpers/urlHelper'

const ProjectsInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [graduationProjects, setGraduationProjects] = useState([])

  useEffect(() => {
    _getFetcher({ graduationProjects: craftUrl('graduationprojects') })
      .then((res) => setGraduationProjects(res.graduationProjects.data))
      .catch((err) => console.log('error', err))
  }, [])

  const onSubmitHandler = (values) => {
    console.log(values)

    //after form submission
    setIsUpdated(true)
  }

  const transformGraduationProject = (project) => {
    const newData = {
      graduation_project: `${project[0].id}-${project[0].graduation_project_name}`,
      ...project[0],
    }
    return [newData]
  }

  return (
    <Formik
      initialValues={{
        graduation_project: transformGraduationProject(data.graduation_project),
        projects: data.projects,
      }}
      enableReinitialize
      onSubmit={onSubmitHandler}
    >
      {(props) => {
        return (
          <>
            <Form>
              <table style={{ width: '100%' }}>
                <tbody>
                  <FieldArray
                    name='graduation_project'
                    render={(arrayHelpers) => {
                      return (
                        <>
                          <tr>
                            <td colSpan={3}>
                              <div
                                className={styles.formPartitionHeading}
                                style={{ marginTop: 0 }}
                              >
                                <span>Graduation Projects</span>
                              </div>
                            </td>
                          </tr>
                          {props.values.graduation_project &&
                          props.values.graduation_project.length > 0 ? (
                            props.values.graduation_project.map(
                              (project, index) => {
                                return (
                                  <>
                                    <tr key={index} style={{ width: '100%' }}>
                                      <td>
                                        <div style={{ display: 'flex' }}>
                                          <div
                                            className={
                                              styles.removeBtnContainer
                                            }
                                          >
                                            <button
                                              className={styles.removeBtn}
                                              type='button'
                                              onClick={() => {
                                                props.setFieldValue(
                                                  `graduation_project[${index}].graduation_project_description`,
                                                  ''
                                                )
                                              }}
                                            >
                                              <XCircleFill
                                                size={13}
                                                className={styles.removeIcon}
                                              />
                                            </button>
                                          </div>
                                          <div style={{ flexGrow: '1' }}>
                                            <div
                                              className={styles.inputContainer}
                                            >
                                              <label
                                                className={styles.inputLabel}
                                              >
                                                Project Name
                                              </label>
                                              <Field
                                                as='select'
                                                className={`${styles.inputField}`}
                                                id={`graduation_project[${index}].graduation_project`}
                                                name={`graduation_project[${index}].graduation_project`}
                                              >
                                                <option
                                                  disabled
                                                  selected
                                                  value=''
                                                >
                                                  Please select Graduation
                                                  Project
                                                </option>
                                                {graduationProjects.map(
                                                  (project) => (
                                                    <option
                                                      value={`${project.id}-${project.graduation_project_name}`}
                                                    >
                                                      {
                                                        project.graduation_project_name
                                                      }
                                                    </option>
                                                  )
                                                )}
                                              </Field>
                                            </div>
                                            <div
                                              className={styles.inputContainer}
                                            >
                                              <label
                                                className={styles.inputLabel}
                                              >
                                                Graduation Project Description
                                              </label>
                                              <Field
                                                as='textarea'
                                                rows={5}
                                                className={styles.inputField}
                                                name={`graduation_project[${index}]graduation_project_description`}
                                                id={`graduation_project[${index}]graduation_project_description`}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                )
                              }
                            )
                          ) : (
                            <tr>
                              <td>
                                <button
                                  className={styles.bigAddBtn}
                                  type='button'
                                  onClick={() => arrayHelpers.push('')}
                                >
                                  Add a Project
                                </button>
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    }}
                  />
                  <FieldArray
                    name='projects'
                    render={(arrayHelpers) => {
                      return (
                        <>
                          <tr>
                            <td colSpan={3}>
                              <div
                                className={styles.formPartitionHeading}
                                style={{ marginTop: 0 }}
                              >
                                <span>Personal Projects</span>
                                <button
                                  className={styles.addButton}
                                  type='button'
                                  onClick={() =>
                                    arrayHelpers.insert(0, {
                                      project_name: '',
                                      project_description: '',
                                    })
                                  }
                                >
                                  <PlusCircleFill size={20} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {props.values.projects &&
                          props.values.projects.length > 0 ? (
                            props.values.projects.map((project, index) => {
                              return (
                                <>
                                  <tr key={index} style={{ width: '100%' }}>
                                    <td>
                                      <div style={{ display: 'flex' }}>
                                        <div
                                          className={styles.removeBtnContainer}
                                        >
                                          <button
                                            className={styles.removeBtn}
                                            type='button'
                                            onClick={() => {
                                              arrayHelpers.remove(index)
                                              if (
                                                project.hasOwnProperty('id')
                                              ) {
                                                deletedData.projects.push({
                                                  name: project.project_name,
                                                  id: project.id,
                                                  data: project,
                                                })
                                              }
                                            }}
                                          >
                                            <XCircleFill
                                              size={13}
                                              className={styles.removeIcon}
                                            />
                                          </button>
                                        </div>
                                        <div style={{ flexGrow: '1' }}>
                                          <div
                                            className={styles.inputContainer}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Project Name
                                            </label>
                                            <Field
                                              className={styles.inputField}
                                              id={`projects[${index}]project_name`}
                                              name={`projects[${index}]project_name`}
                                            />
                                          </div>
                                          <div
                                            className={styles.inputContainer}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Project Description
                                            </label>
                                            <Field
                                              as='textarea'
                                              rows={5}
                                              className={styles.inputField}
                                              name={`projects[${index}]project_description`}
                                              id={`projects[${index}]project_description`}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              )
                            })
                          ) : (
                            <tr>
                              <td>
                                <button
                                  className={styles.bigAddBtn}
                                  type='button'
                                  onClick={() => arrayHelpers.push('')}
                                >
                                  Add a Project
                                </button>
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    }}
                  />
                </tbody>
              </table>
              <div>
                <button type='submit' className={styles.submitBtn}>
                  Submit
                </button>
              </div>
            </Form>
          </>
        )
      }}
    </Formik>
  )
}

export default ProjectsInformationForm
