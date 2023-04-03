import { Field, FieldArray, Form, Formik } from 'formik'
import { cloneDeep } from 'lodash'
import React, { useState } from 'react'
import { EyeSlashFill, EyeFill, XCircleFill } from 'react-bootstrap-icons'
import { Rating } from 'react-simple-star-rating'
import DatePickerField from '../../../DatePickers/DatePicker'
import styles from '../UserProfileFormStyles.module.css'
import {
  convertToIso,
  handleResponse,
  replaceWithNull,
} from '../../../../helpers/submissionHelpers'
import {
  createReqObject,
  submitChanges,
} from '../../../../helpers/fetchHelpers'
import { craftUserUrl } from '../../../../helpers/urlHelper'

const InternshipInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

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

  const transformDataForSubmission = (newData) => {
    newData.internships = newData.internships.map((val) => {
      val.visibility = val.visibility ? 1 : 0
      val.start_date =
        val.start_date != null ? convertToIso(val.start_date) : null
      val.end_date = val.end_date != null ? convertToIso(val.end_date) : null
      val.rating = val.rating ? val.rating : null
      val.opinion = val.opinion ? val.opinion.trim() : null
      replaceWithNull(val)
      return val
    })
  }

  const onSubmit = async (values) => {
    setIsUpdated(true)
    let newData = cloneDeep(values)
    transformDataForSubmission(newData)

    const args = [
      [],
      [],
      ['id', 'user_id', 'record_date'],
      ['start_date', 'end_date'],
    ]
    const send_to_req = { internships: cloneDeep(dataAfterSubmit) }
    transformDataForSubmission(send_to_req)
    const requestObj = createReqObject(
      send_to_req.internships,
      newData.internships,
      []
    )
    const url = craftUserUrl(user_id, 'internships')
    const responseObj = await submitChanges(url, requestObj)

    const new_data = handleResponse(
      send_to_req.internships,
      requestObj,
      responseObj,
      values,
      'internships',
      args,
      transformDataForSubmission
    )
    applyNewData(new_data)
    console.log('req,', requestObj, 'res', responseObj)
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ internships: transformData(data) }}
      onSubmit={onSubmit}
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
                        props.values.internships.map((internship, index) => {
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

                                  <div
                                    className={styles.inputContainer}
                                    style={{ width: '%49' }}
                                  >
                                    <label className={styles.inputLabel}>
                                      Semester
                                    </label>
                                    <Field
                                      disabled
                                      className={styles.inputField}
                                      as='select'
                                      name={`internships[${index}]semester`}
                                      id={`internships[${index}]semester`}
                                    >
                                      <option value='spring'>Spring</option>
                                      <option value='fall'>Fall</option>
                                    </Field>
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
                                    <span
                                      onClick={() => {
                                        props.setFieldValue(
                                          `internships[${index}]rating`,
                                          0
                                        )
                                      }}
                                      style={{
                                        backgroundColor: '#333',
                                        borderRadius: '5px',
                                        color: '#fff',
                                        display: 'inline-block',
                                        padding: '5px 15px',
                                        verticalAlign: 'middle',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      Reset
                                    </span>
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
