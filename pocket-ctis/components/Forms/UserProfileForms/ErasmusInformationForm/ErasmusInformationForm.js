import { Formik, Field, Form } from 'formik'
import { Rating } from 'react-simple-star-rating'
import styles from '../UserProfileFormStyles.module.css'
import { cloneDeep } from 'lodash'
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import DatePickerField from '../../../DatePickers/DatePicker'
import { useState } from 'react'
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

const ErasmusInformationForm = ({ data, user_id, setIsUpdated }) => {
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
    newData.erasmus = newData.erasmus.map((val) => {
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
    const send_to_req = { erasmus: cloneDeep(dataAfterSubmit) }
    transformDataForSubmission(send_to_req)
    const requestObj = createReqObject(send_to_req.erasmus, newData.erasmus, [])
    const url = craftUserUrl(user_id, 'erasmus')
    const responseObj = await submitChanges(url, requestObj)

    const new_data = handleResponse(
      send_to_req.erasmus,
      requestObj,
      responseObj,
      values,
      'erasmus',
      args,
      transformDataForSubmission
    )
    applyNewData(new_data)
    console.log('req,', requestObj, 'res', responseObj)
  }

  return (
    <Formik
      initialValues={{ erasmus: transformData(data) }}
      enableReinitialize
      onSubmit={onSubmit}
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
                      disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                <td className={styles.visibilityCheckboxContainer}>
                  <Field name='erasmus[0].visibility'>
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
