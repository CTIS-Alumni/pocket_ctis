import { useState, useEffect } from 'react'
import styles from './AdminUserFormStyles.module.css'
import { Formik, FieldArray, Form, Field } from 'formik'
import { XCircleFill, PlusCircleFill } from 'react-bootstrap-icons'
import { cloneDeep } from 'lodash'
import {
  _getFetcher,
  createReqObject,
  submitChanges,
} from '../../../../helpers/fetchHelpers'
import {
  handleResponse,
  replaceWithNull,
  splitFields,
} from '../../../../helpers/submissionHelpers'
import { craftUrl } from '../../../../helpers/urlHelper'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'

const SkillsInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [skillType, setSkillType] = useState([])
  const [skills, setSkills] = useState([])
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    _getFetcher({
      skills: craftUrl(['skills']),
      skill_types: craftUrl(['skilltypes']),
    }).then(({ skills, skill_types }) => {
      setSkills(skills.data)
      setSkillType(skill_types.data)
    })
  }, [])

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

  let deletedData = []

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      replaceWithNull(datum)
      datum.visibility = datum.visibility == 1
      datum.skill_type = `${datum.skill_type_id}-${datum.skill_type_name}`
      datum.skill = `${datum.skill_id}-${datum.skill_name}`
      return datum
    })
    return newData
  }

  const transformDataForSubmission = (newData) => {
    newData.skills = newData.skills.map((val) => {
      val.visibility = val.visibility ? 1 : 0
      val.skill_level = val.skill_level ? parseInt(val.skill_level) : null
      replaceWithNull(val)
      splitFields(val, ['skill_type', 'skill'])
      return val
    })
  }

  const args = [
    ['skill_type', 'skill'],
    ['skill_type_id'],
    ['id', 'user_id'],
    [],
  ]

  const url = craftUrl(['users', user_id, 'skills'])

  const onSubmit = async (values) => {
    setIsUpdated(true)
    setIsLoading(true)
    let newData = cloneDeep(values)
    transformDataForSubmission(newData)

    const send_to_req = { skills: cloneDeep(dataAfterSubmit) }
    transformDataForSubmission(send_to_req)
    const requestObj = createReqObject(
      send_to_req.skills,
      newData.skills,
      deletedData
    )

    const responseObj = await submitChanges(url, requestObj)

    const new_data = handleResponse(
      send_to_req.skills,
      requestObj,
      responseObj,
      values,
      'skills',
      args,
      transformDataForSubmission
    )
    applyNewData(new_data)
    console.log('req', requestObj, 'res', responseObj)

    deletedData = []

    let errors = []
    for (const [key, value] of Object.entries(responseObj)) {
      if (value.errors?.length > 0) {
        errors = [...errors, ...value.errors.map((error) => error)]
      }
    }

    if (errors.length > 0) {
      errors.forEach((errorInfo) => {
        toast.error(errorInfo.error)
      })
    } else if (
      responseObj.POST.data ||
      responseObj.PUT.data ||
      responseObj.DELETE.data
    ) {
      toast.success('Data successfully saved')
    }
    setIsLoading(false)
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ skills: transformData(data) }}
      onSubmit={onSubmit}
    >
      {(props) => (
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
                name='skills'
                render={(arrayHelpers) => {
                  return (
                    <>
                      <tr>
                        <td colSpan={3}>
                          <div
                            className={styles.formPartitionHeading}
                            style={{ marginTop: 0 }}
                          >
                            <span>Skills</span>
                            <button
                              className={styles.addButton}
                              type='button'
                              onClick={() =>
                                arrayHelpers.insert(0, {
                                  skill_type: '',
                                  skill_level: '',
                                  skill: '',
                                })
                              }
                            >
                              <PlusCircleFill size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {props.values.skills && props.values.skills.length > 0 ? (
                        props.values.skills.map((skill, index) => {
                          return (
                            <>
                              <tr key={index} style={{ width: '100%' }}>
                                <td>
                                  <div style={{ display: 'flex' }}>
                                    <div className={styles.removeBtnContainer}>
                                      <button
                                        className={styles.removeBtn}
                                        type='button'
                                        onClick={() => {
                                          arrayHelpers.remove(index)
                                          if (skill.hasOwnProperty('id')) {
                                            deletedData.push({
                                              id: skill.id,
                                              data: skill,
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
                                      <div className={styles.inputContainer}>
                                        <label className={styles.inputLabel}>
                                          Skill Type
                                        </label>
                                        <Field
                                          as='select'
                                          className={styles.inputField}
                                          id={`skills[${index}]skill_type`}
                                          name={`skills[${index}]skill_type`}
                                          onChange={(event) => {
                                            props.setFieldValue(
                                              `skills[${index}]skill_type`,
                                              event.target.value
                                            )
                                            props.setFieldValue(
                                              `skills[${index}]skill`,
                                              ''
                                            )
                                          }}
                                        >
                                          <option disabled selected value=''>
                                            Please Select skill type
                                          </option>
                                          {skillType.map((type) => (
                                            <option
                                              value={`${type.id}-${type.skill_type_name}`}
                                            >
                                              {type.skill_type_name}
                                            </option>
                                          ))}
                                        </Field>
                                      </div>
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                        }}
                                      >
                                        <div
                                          className={styles.inputContainer}
                                          style={{ width: '49%' }}
                                        >
                                          <label className={styles.inputLabel}>
                                            Skill Name
                                          </label>
                                          <Field
                                            as='select'
                                            className={styles.inputField}
                                            id={`skills[${index}]skill`}
                                            name={`skills[${index}]skill`}
                                            disabled={!skill.skill_type}
                                          >
                                            <option selected disabled value=''>
                                              Please select a Skill
                                            </option>
                                            {skills
                                              .filter(
                                                (s) =>
                                                  skill.skill_type?.split(
                                                    '-'
                                                  )[0] == s.skill_type_id
                                              )
                                              .map((s) => (
                                                <option
                                                  value={`${s.id}-${s.skill_name}`}
                                                >
                                                  {s.skill_name}
                                                </option>
                                              ))}
                                          </Field>
                                        </div>
                                        <div
                                          className={styles.inputContainer}
                                          style={{ width: '49%' }}
                                        >
                                          <label className={styles.inputLabel}>
                                            Skill Level
                                          </label>
                                          <Field
                                            as='select'
                                            className={styles.inputField}
                                            id={`skills[${index}]skill_level`}
                                            name={`skills[${index}]skill_level`}
                                            disabled={
                                              !skill.skill_type || !skill.skill
                                            }
                                          >
                                            <option selected disabled value=''>
                                              Please select your skill level
                                            </option>
                                            <option value={1}>Beginner</option>
                                            <option value={2}>
                                              Intermediate
                                            </option>
                                            <option value={3}>Competent</option>
                                            <option value={4}>
                                              Proficient
                                            </option>
                                            <option value={5}>Expert</option>
                                          </Field>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              {/* shows spaver only between records */}
                              {props.values.skills.length - 1 > index && (
                                <tr className={styles.spacer}>
                                  <td />
                                </tr>
                              )}
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
                                  skill_type: '',
                                  skill_level: '',
                                  skill: '',
                                })
                              }
                            >
                              Add a Skill
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
      )}
    </Formik>
  )
}

export default SkillsInformationForm
