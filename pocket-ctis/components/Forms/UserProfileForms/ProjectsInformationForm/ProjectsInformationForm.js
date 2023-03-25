import { useState } from 'react'
import { FieldArray, Field, Formik, Form } from 'formik'
import { cloneDeep } from 'lodash'
import styles from '../UserProfileFormStyles.module.css'
import {
  EyeFill,
  EyeSlashFill,
  PlusCircleFill,
  XCircleFill,
} from 'react-bootstrap-icons'

import {
  replaceWithNull,
  handleResponse,
} from '../../../../helpers/submissionHelpers'
import {
  createReqObject,
  submitChanges,
} from '../../../../helpers/fetchHelpers'
import { craftUserUrl } from '../../../../helpers/urlHelper'

const ProjectsInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

  let deletedData = { projects: [], graduation_project: [] }

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
        replaceWithNull(val)
        return val
      })
    },
  }

  const onSubmit = async (values) => {
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
    const args = {
      graduation_project: [[], [], ['id', 'user_id'], []],
      projects: [[], [], ['id', 'user_id'], []],
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
        const url = craftUserUrl(user_id, key)
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
  }

  const { projects, graduation_project } = data

  return (
    <Formik
      initialValues={{
        graduation_project: transformData(graduation_project),
        projects: transformData(projects),
      }}
      enableReinitialize
      onSubmit={onSubmit}
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
                                                className={`${styles.inputField}`}
                                                disabled
                                                id={`graduation_project[${index}].graduation_project_name`}
                                                name={`graduation_project[${index}].graduation_project_name`}
                                              />
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
                                      <td
                                        className={
                                          styles.visibilityCheckboxContainer
                                        }
                                      >
                                        <Field
                                          name={`graduation_project[${index}]visibility`}
                                        >
                                          {({ field, form, meta }) => {
                                            return (
                                              <label>
                                                {field.value ? (
                                                  <EyeFill
                                                    size={20}
                                                    className={`${styles.visibilityCheckbox} ${styles.visibilityUnchecked}`}
                                                  />
                                                ) : (
                                                  <EyeSlashFill
                                                    size={20}
                                                    className={`${styles.visibilityCheckbox}`}
                                                  />
                                                )}
                                                <input
                                                  type='checkbox'
                                                  {...field}
                                                  style={{ display: 'none' }}
                                                />
                                              </label>
                                            )
                                          }}
                                        </Field>
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
                                    <td
                                      className={
                                        styles.visibilityCheckboxContainer
                                      }
                                    >
                                      <Field
                                        name={`projects[${index}]visibility`}
                                      >
                                        {({ field, form, meta }) => {
                                          return (
                                            <label>
                                              {field.value ? (
                                                <EyeFill
                                                  size={20}
                                                  className={`${styles.visibilityCheckbox} ${styles.visibilityUnchecked}`}
                                                />
                                              ) : (
                                                <EyeSlashFill
                                                  size={20}
                                                  className={`${styles.visibilityCheckbox}`}
                                                />
                                              )}
                                              <input
                                                type='checkbox'
                                                {...field}
                                                style={{ display: 'none' }}
                                              />
                                            </label>
                                          )
                                        }}
                                      </Field>
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
