import { Field, FieldArray, Form, Formik } from 'formik'
import { cloneDeep } from 'lodash'
import React from 'react'
import { EyeSlashFill, EyeFill } from 'react-bootstrap-icons'
import { Rating } from 'react-simple-star-rating'
import DatePickerField from '../../../DatePickers/DatePicker'
import styles from '../UserProfileFormStyles.module.css'

const InternshipInformationForm = ({ data, setIsUpdated }) => {
  console.log(data)
  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      datum.start_date = datum.start_date ? new Date(datum.start_date) : null
      datum.end_date = datum.end_date ? new Date(datum.end_date) : null

      return datum
    })
    return newData
  }

  const onSubmitHandler = (values) => {
    let newData = cloneDeep(values.internships)

    newData = newData.map((datum) => {
      datum.visibility = datum.visibility ? 1 : 0
      return datum
    })

    console.log(newData)
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ internships: transformData(data) }}
      onSubmit={onSubmitHandler}
    >
      {(props) => (
        <Form>
          <table style={{ width: '100%' }}>
            <tbody>
              <FieldArray
                name='internships'
                render={(arrayHelpers) => {
                  return (
                    <>
                      {props.values.internships &&
                        props.values.internships.length > 0 &&
                        props.values.internships.map((internships, index) => {
                          return (
                            <>
                              <tr>
                                <td>
                                  <div className={styles.inputContainer}>
                                    <label className={styles.inputLabel}>
                                      Company Name
                                    </label>
                                    <Field
                                      disabled
                                      className={styles.inputField}
                                      name={`internships[${index}].company_name`}
                                      id={`internships[${index}].company_name`}
                                    />
                                  </div>
                                  <div className={styles.inputContainer}>
                                    <label className={styles.inputLabel}>
                                      Department
                                    </label>
                                    <Field
                                      disabled
                                      className={styles.inputField}
                                      name={`internships[${index}].department`}
                                      id={`internships[${index}].department`}
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
                                        Start Date
                                      </label>
                                      <DatePickerField
                                        format='MMM/y'
                                        disabled
                                        maxDetail='year'
                                        className={styles.dateInputField}
                                        name={`internships[${index}]start_date`}
                                        id={`internships[${index}]start_date`}
                                      />
                                    </div>
                                    <div
                                      className={styles.inputContainer}
                                      style={{ width: '49%' }}
                                    >
                                      <label className={styles.inputLabel}>
                                        End Date
                                      </label>
                                      <DatePickerField
                                        format='MMM/y'
                                        disabled
                                        maxDetail='year'
                                        className={styles.dateInputField}
                                        name={`internships[${index}]end_date`}
                                        id={`internships[${index}]end_date`}
                                      />
                                    </div>
                                  </div>

                                  <div className={styles.inputContainer}>
                                    <label className={styles.inputLabel}>
                                      Semester
                                    </label>
                                    <Field
                                      disabled
                                      className={styles.inputField}
                                      name={`internships[${index}]semester`}
                                      id={`internships[${index}]semester`}
                                    />
                                  </div>

                                  <div className={styles.inputContainer}>
                                    <label className={styles.inputLabel}>
                                      Rating
                                    </label>
                                    <Rating
                                      onClick={(rating) =>
                                        props.setFieldValue(
                                          `internships[${index}]rating`,
                                          rating
                                        )
                                      }
                                      initialValue={
                                        props.values.internships[index].rating
                                      }
                                      transition={true}
                                      allowFraction={true}
                                      fillColor={'#8d2729'}
                                      style={{ marginTop: 5 }}
                                    />
                                  </div>

                                  <div className={styles.inputContainer}>
                                    <label className={styles.inputLabel}>
                                      Opinion
                                    </label>
                                    <Field
                                      as='textarea'
                                      rows={5}
                                      name={`internships[${index}]opinion`}
                                      id={`internships[${index}]opinion`}
                                      className={styles.inputField}
                                    />
                                  </div>
                                </td>
                                <td
                                  className={styles.visibilityCheckboxContainer}
                                >
                                  <Field
                                    name={`internships[${index}]visibility`}
                                  >
                                    {({ field, form, meta }) => {
                                      return (
                                        <label>
                                          {field.value ? (
                                            <EyeFill
                                              size={20}
                                              className={`${styles.visibilityUnchecked} ${styles.visibilityCheckbox}`}
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
                              {props.values.internships.length - 1 > index && (
                                <tr className={styles.spacer}>
                                  <td />
                                </tr>
                              )}
                            </>
                          )
                        })}
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

export default InternshipInformationForm
