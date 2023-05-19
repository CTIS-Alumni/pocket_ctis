import { useState, useEffect } from 'react'
import { FieldArray, Field, Formik, Form } from 'formik'
import styles from './AdminUserFormStyles.module.css'
import { PlusCircleFill, XCircleFill } from 'react-bootstrap-icons'
import {
  _getFetcher,
  _submitFetcher,
  createReqObject,
  submitChanges,
} from '../../../../helpers/fetchHelpers'
import { craftUrl } from '../../../../helpers/urlHelper'
import { cloneDeep } from 'lodash'
import {
  handleResponse,
  replaceWithNull,
  splitFields,
} from '../../../../helpers/submissionHelpers'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'

const ProjectsInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [graduationProjects, setGraduationProjects] = useState([])
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)
  const [isLoading, setIsLoading] = useState(false)

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

  let deletedData = { projects: [], graduation_project: [] }

  const sendMail = async () => {
    const res = await _submitFetcher(
      'POST',
      craftUrl(['mail'], [{ name: 'updateProfile', value: 1 }]),
      { user_id, type: 'graduation project' }
    )
    return res
  }

  useEffect(() => {
    _getFetcher({ graduationProjects: craftUrl(['graduationprojects']) })
      .then((res) => setGraduationProjects(res.graduationProjects.data))
      .catch((err) => console.log('error', err))
  }, [])

  const args = {
    graduation_project: [['graduation_project'], [], ['id', 'user_id'], []],
    projects: [[], [], ['id', 'user_id'], []],
  }

  const transformGraduationProject = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.graduation_project = `${datum.id}-${datum.graduation_project_name}`
      datum.visibility = datum.visibility == 1
      return datum
    })
    return newData
  }

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      return datum
    })
    return newData
  }

  const transformFuncs = {
    projects: (newData) => {
      newData.projects = newData.projects.map((val) => {
        val.visibility = val.visibility ? 1 : 0
        val.project_name = val.project_name ? val.project_name : null
        val.project_description = val.project_description
          ? val.project_description
          : null
        replaceWithNull(val)
        return val
      })
    },
    graduation_project: (newData) => {
      newData.graduation_project = newData.graduation_project.map((val) => {
        val.graduation_project_description = val.graduation_project_description
          ? val.graduation_project_description
          : null
        val.visibility = val.visibility ? 1 : 0
        splitFields(val, ['graduation_project'])
        replaceWithNull(val)
        return val
      })
    },
  }

  const onSubmit = async (values) => {
    setIsLoading(true)
    setIsUpdated(true)
    let newData = cloneDeep(values)
    transformFuncs.projects(newData)
    transformFuncs.graduation_project(newData)

    let responseObj = {
      graduation_project: {},
      projects: {},
    }
    let requestObj = {
      graduation_project: {},
      projects: {},
    }

    const final_data = { graduation_project: [], projects: [] }
    await Promise.all(
      Object.keys(dataAfterSubmit).map(async (key) => {
        const send_to_req = {}
        send_to_req[key] = cloneDeep(dataAfterSubmit[key])
        transformFuncs[key](send_to_req)
        requestObj[key] = createReqObject(
          send_to_req[key],
          newData[key],
          deletedData[key]
        )
        const url = craftUrl(['users', user_id, key])
        responseObj[key] = await submitChanges(url, requestObj[key])
        final_data[key] = handleResponse(
          send_to_req[key],
          requestObj[key],
          responseObj[key],
          values,
          key,
          args[key],
          transformFuncs[key]
        )
      })
    )
    console.log('req', requestObj, 'res', responseObj)
    applyNewData(final_data)
    deletedData = { projects: [], graduation_project: [] }

    let errors = []
    Object.keys(deletedData).forEach((obj) => {
      for (const [key, value] of Object.entries(responseObj[obj])) {
        if (value.errors?.length > 0) {
          errors = [...errors, ...value.errors.map((error) => error)]
        }
      }
    })

    if (errors.length > 0) {
      errors.forEach((errorInfo) => {
        toast.error(errorInfo.error)
      })
    } else toast.success('Data successfully saved')

    if (responseObj.POST.data?.length) {
      const { data, errors } = await sendMail()
      if (data) toast.success('Profile update mail sent to user')
      else toast.error('Failed to send profile update mail to user')
    }
    setIsLoading(false)
  }

  const { projects, graduation_project } = data

  return (
    <Formik
      initialValues={{
        graduation_project: transformGraduationProject(graduation_project),
        projects: transformData(projects),
      }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(props) => {
        return (
          <>
            <Form style={{ position: 'relative' }}>
              {isLoading && (
                <div
                  style={{
                    zIndex: 2,
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    background: '#ccc',
                    opacity: '0.5',
                  }}
                >
                  <Spinner />
                </div>
              )}
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
                                                arrayHelpers.remove(index)
                                                if (
                                                  project.hasOwnProperty('id')
                                                ) {
                                                  deletedData.graduation_project.push(
                                                    {
                                                      name: project.graduation_project_name,
                                                      id: project.id,
                                                      data: project,
                                                    }
                                                  )
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
                                  onClick={() =>
                                    arrayHelpers.push({
                                      graduation_project: '',
                                      graduation_project_description: '',
                                    })
                                  }
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
                                  onClick={() =>
                                    arrayHelpers.push({
                                      project_name: '',
                                      project_description: '',
                                    })
                                  }
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
