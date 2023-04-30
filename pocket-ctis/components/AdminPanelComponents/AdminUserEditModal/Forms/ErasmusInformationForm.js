import { useState, useEffect } from 'react'

import styles from './AdminUserFormStyles.module.css'

import { Formik, Field, Form, FieldArray } from 'formik'
import { XCircleFill } from 'react-bootstrap-icons'
import { Rating } from 'react-simple-star-rating'
import { cloneDeep } from 'lodash'
import DatePickerField from '../../../DatePickers/DatePicker'
import { _getFetcher } from '../../../../helpers/fetchHelpers'
import { craftUrl } from '../../../../helpers/urlHelper'

const ErasmusInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [universities, setUniversities] = useState([])

  useEffect(() => {
    _getFetcher({ universities: craftUrl('educationinstitutes') })
      .then((res) => setUniversities(res.universities.data))
      .catch((err) => console.log(err))
  }, [])

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.edu_inst = `${datum.edu_inst_id}-${datum.edu_inst_name}`
      datum.start_date = datum.start_date ? new Date(datum.start_date) : null
      datum.end_date = datum.end_date ? new Date(datum.end_date) : null
      return datum
    })
    return newData
  }

  const onSubmitHandler = (values) => {
    console.log(values)

    //after submission
    setIsUpdated(true)
  }

  return (
    <Formik
      initialValues={{ erasmus: transformData(data) }}
      enableReinitialize
      onSubmit={onSubmitHandler}
    >
      {(props) => (
        <Form>
          <table style={{ width: '100%' }}>
            <tbody>
              <FieldArray
                name='erasmus'
                render={(arrayHelpers) => {
                  return (
                    <>
                      {props.values.erasmus &&
                      props.values.erasmus.length > 0 ? (
                        props.values.erasmus.map((project, index) => {
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
                                          University
                                        </label>
                                        <Field
                                          as='select'
                                          className={styles.inputField}
                                          name={`erasmus[${index}].edu_inst`}
                                          id={`erasmus[${index}].edu_inst`}
                                        >
                                          <option selected disabled value=''>
                                            Please select a Educational
                                            institiute
                                          </option>
                                          {universities.map((uni) => (
                                            <option
                                              value={`${uni.id}-${uni.edu_inst_name}`}
                                            >
                                              {uni.edu_inst_name}
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
                                          className={`${styles.inputContainer}`}
                                          style={{ width: '49%' }}
                                        >
                                          <label
                                            className={`${styles.inputLabel}`}
                                          >
                                            Start Date
                                          </label>
                                          <DatePickerField
                                            format='MMM/y'
                                            maxDetail='year'
                                            className={styles.dateInputField}
                                            name={`erasmus[${index}]start_date`}
                                            id={`erasmus[${index}]start_date`}
                                          />
                                        </div>
                                        <div
                                          className={`${styles.inputContainer}`}
                                          style={{ width: '49%' }}
                                        >
                                          <label
                                            className={`${styles.inputLabel}`}
                                          >
                                            End Date
                                          </label>
                                          <DatePickerField
                                            format='MMM/y'
                                            maxDetail='year'
                                            className={styles.dateInputField}
                                            name={`erasmus[${index}]end_date`}
                                            id={`erasmus[${index}]end_date`}
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
                                          className={`${styles.inputContainer}`}
                                          style={{ width: '49%' }}
                                        >
                                          <label
                                            className={`${styles.inputLabel}`}
                                          >
                                            Semester
                                          </label>
                                          <Field
                                            className={styles.inputField}
                                            as='select'
                                            name={`erasmus[${index}]semester`}
                                            id={`erasmus[${index}]semester`}
                                          >
                                            <option value='spring'>
                                              Spring
                                            </option>
                                            <option value='fall'>Fall</option>
                                            <option value='fullyear'>
                                              Fall & Spring
                                            </option>
                                          </Field>
                                        </div>
                                      </div>
                                      <div
                                        className={`${styles.inputContainer}`}
                                      >
                                        <label
                                          className={`${styles.inputLabel}`}
                                        >
                                          Rating
                                        </label>
                                        <Rating
                                          onClick={(rating) =>
                                            props.setFieldValue(
                                              `erasmus[${index}].rating`,
                                              rating
                                            )
                                          }
                                          initialValue={
                                            props.values.erasmus[0].rating
                                          }
                                          transition={true}
                                          allowFraction={true}
                                          fillColor={'#8d2729'}
                                          style={{ marginTop: 5 }}
                                        />
                                        <span
                                          onClick={() => {
                                            props.setFieldValue(
                                              `erasmus[${index}].rating`,
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
                                      <div
                                        className={`${styles.inputContainer}`}
                                      >
                                        <label
                                          className={`${styles.inputLabel}`}
                                        >
                                          Opinion
                                        </label>
                                        <Field
                                          className={`${styles.inputField}`}
                                          as='textarea'
                                          rows={5}
                                          id={`erasmus[0${index}.opinion`}
                                          name={`erasmus[0${index}.opinion`}
                                          placeholder='Enter your opinions...'
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
                              Add an Erasmus
                            </button>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                }}
              />
              {/* <tr>
                <td>
                  <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>University</label>
                    <Field
                      as='select'
                      className={styles.inputField}
                      name='erasmus[0].edu_inst'
                      id='erasmus[0].edu_inst'
                    >
                      <option selected disabled value=''>
                        Please select a Educational institiute
                      </option>
                      {universities.map((uni) => (
                        <option value={`${uni.id}-${uni.edu_inst_name}`}>
                          {uni.edu_inst_name}
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
                      className={`${styles.inputContainer}`}
                      style={{ width: '49%' }}
                    >
                      <label className={`${styles.inputLabel}`}>
                        Start Date
                      </label>
                      <DatePickerField
                        format='MMM/y'
                        maxDetail='year'
                        className={styles.dateInputField}
                        name={`erasmus[0]start_date`}
                        id={`erasmus[0]start_date`}
                      />
                    </div>
                    <div
                      className={`${styles.inputContainer}`}
                      style={{ width: '49%' }}
                    >
                      <label className={`${styles.inputLabel}`}>End Date</label>
                      <DatePickerField
                        format='MMM/y'
                        maxDetail='year'
                        className={styles.dateInputField}
                        name={`erasmus[0]end_date`}
                        id={`erasmus[0]end_date`}
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
                      className={`${styles.inputContainer}`}
                      style={{ width: '49%' }}
                    >
                      <label className={`${styles.inputLabel}`}>Semester</label>
                      <Field
                        className={styles.inputField}
                        as='select'
                        name={`erasmus[0]semester`}
                        id={`erasmus[0]semester`}
                      >
                        <option value='spring'>Spring</option>
                        <option value='fall'>Fall</option>
                        <option value='fullyear'>Fall & Spring</option>
                      </Field>
                    </div>
                  </div>
                  <div className={`${styles.inputContainer}`}>
                    <label className={`${styles.inputLabel}`}>Rating</label>
                    <Rating
                      onClick={(rating) =>
                        props.setFieldValue('erasmus[0].rating', rating)
                      }
                      initialValue={props.values.erasmus[0].rating}
                      transition={true}
                      allowFraction={true}
                      fillColor={'#8d2729'}
                      style={{ marginTop: 5 }}
                    />
                    <span
                      onClick={() => {
                        props.setFieldValue('erasmus[0].rating', 0)
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
                  <div className={`${styles.inputContainer}`}>
                    <label className={`${styles.inputLabel}`}>Opinion</label>
                    <Field
                      className={`${styles.inputField}`}
                      as='textarea'
                      rows={5}
                      id='erasmus[0].opinion'
                      name='erasmus[0].opinion'
                      placeholder='Enter your opinions...'
                    />
                  </div>
                </td>
              </tr> */}
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

export default ErasmusInformationForm
