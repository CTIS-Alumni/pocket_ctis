import styles from '../UserProfileFormStyles.module.css'
import { Formik, FieldArray, Form, Field } from 'formik'
import {
  EyeFill,
  EyeSlashFill,
  XCircleFill,
  PlusCircleFill,
} from 'react-bootstrap-icons'
import { cloneDeep } from 'lodash'
import { fetchAllSkillTypes } from '../../../../helpers/searchHelpers'
import { useState, useEffect } from 'react'

const SkillsInformationForm = ({ data }) => {
  const [skillType, setSkillType] = useState([])
  useEffect(() => {
    fetchAllSkillTypes().then((res) => setSkillType(res.data))
  }, [])

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      return datum
    })
    return newData
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ skills: transformData(data) }}
      onSubmit={(values) => console.log(values)}
    >
      {(props) => (
        <Form>
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
                              onClick={() => arrayHelpers.insert(0, '')}
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
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
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
                                          Skill Name
                                        </label>
                                        <Field
                                          className={styles.inputField}
                                          id={`skills[${index}]skill_name`}
                                          name={`skills[${index}]skill_name`}
                                        />
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
                                            Skill Type
                                          </label>
                                          <Field
                                            as='select'
                                            className={styles.inputField}
                                            id={`skills[${index}]type_name`}
                                            name={`skills[${index}]type_name`}
                                          >
                                            <option disabled selected value=''>
                                              Please Select skill type
                                            </option>
                                            {skillType.map((type) => (
                                              <option value={type.type_name}>
                                                {type.type_name}
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
                                            type='number'
                                            className={styles.inputField}
                                            id={`skills[${index}]skill_level`}
                                            name={`skills[${index}]skill_level`}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className={styles.visibilityCheckboxContainer}
                                >
                                  <Field name={`skills[${index}]visibility`}>
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
                              onClick={() => arrayHelpers.push('')}
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
