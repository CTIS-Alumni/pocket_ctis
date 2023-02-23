import { Formik, Form, FieldArray, Field } from 'formik'
import styles from '../UserProfileFormStyles.module.css'
import { cloneDeep } from 'lodash'
import {
  EyeFill,
  EyeSlashFill,
  PlusCircleFill,
  XCircleFill,
} from 'react-bootstrap-icons'
import { useEffect, useState } from 'react'
import { fetchAllEducationInstitutes } from '../../../../helpers/searchHelpers'

const EducationInformationForm = ({ data }) => {
  const [eduInsts, setEduInsts] = useState([])

  useEffect(() => {
    fetchAllEducationInstitutes().then((res) => setEduInsts(res.data))
  }, [])

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      return { ...datum, inst: `${datum.edu_inst_id}-${datum.inst_name}` }
    })
    return newData
  }

  return (
    <>
      <Formik
        initialValues={{
          edu_records: transformData(data),
        }}
        enableReinitialize
        onSubmit={(values) => console.log('values', values)}
      >
        {(props) => {
          return (
            <Form>
              <table style={{ width: '100%' }}>
                <tbody>
                  <FieldArray
                    name='edu_records'
                    render={(arrayHelpers) => (
                      <>
                        <tr>
                          <td colSpan={3}>
                            <div
                              className={styles.formPartitionHeading}
                              style={{ marginTop: 0 }}
                            >
                              <span>Education Information</span>
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
                        {props.values.edu_records &&
                        props.values.edu_records.length > 0 ? (
                          props.values.edu_records.map((edu_record, index) => {
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
                                            Instiute Name
                                          </label>
                                          <Field
                                            as='select'
                                            className={styles.inputField}
                                            id={`edu_records[${index}]inst`}
                                            name={`edu_records[${index}]inst`}
                                          >
                                            <option disabled selected value=''>
                                              Please select Educational
                                              Institute
                                            </option>
                                            {eduInsts.map((inst) => (
                                              <option
                                                value={`${inst.id}-${inst.inst_name}`}
                                              >
                                                {inst.inst_name}
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
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Country
                                            </label>
                                            <Field
                                              className={styles.inputField}
                                              name={`edu_records[${index}]country_name`}
                                              id={`edu_records[${index}]country_name`}
                                            />
                                          </div>
                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              City
                                            </label>
                                            <Field
                                              className={styles.inputField}
                                              name={`edu_records[${index}]city_name`}
                                              id={`edu_records[${index}]city_name`}
                                            />
                                          </div>
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
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Degree Name
                                            </label>
                                            <Field
                                              className={styles.inputField}
                                              name={`edu_records[${index}]degree_name`}
                                              id={`edu_records[${index}]degree_name`}
                                            />
                                          </div>
                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Name of Program
                                            </label>
                                            <Field
                                              className={styles.inputField}
                                              name={`edu_records[${index}]name_of_program`}
                                              id={`edu_records[${index}]name_of_program`}
                                            />
                                          </div>
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
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Start Date
                                            </label>
                                            <Field
                                              className={styles.inputField}
                                              name={`edu_records[${index}]start_date`}
                                              id={`edu_records[${index}]start_date`}
                                            />
                                          </div>
                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              End Date
                                            </label>
                                            <Field
                                              className={styles.inputField}
                                              name={`edu_records[${index}]end_date`}
                                              id={`edu_records[${index}]end_date`}
                                            />
                                          </div>
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
                                      name={`edu_records[${index}]visibility`}
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
                                {/* shows spaver only between records */}
                                {props.values.edu_records.length - 1 >
                                  index && (
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
                                Add an Education Record
                              </button>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  />
                </tbody>
              </table>
              <div>
                <button type='submit' className={styles.submitBtn}>
                  Submit
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default EducationInformationForm
