import { useState } from 'react'

import styles from './AdminUserFormStyles.module.css'

import { Formik, Field, Form } from 'formik'
import { Rating } from 'react-simple-star-rating'
import { cloneDeep } from 'lodash'
import DatePickerField from '../../../DatePickers/DatePicker'

const ErasmusInformationForm = ({ data, user_id, setIsUpdated }) => {
  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
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
              <tr>
                <td>
                  <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>University</label>
                    <Field
                      className={styles.inputField}
                      name='erasmus[0].edu_inst_name'
                      id='erasmus[0].edu_inst_name'
                    />
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
              </tr>
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
