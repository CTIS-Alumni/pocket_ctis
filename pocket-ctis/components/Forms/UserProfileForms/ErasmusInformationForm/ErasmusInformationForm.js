import { Formik, Field, Form } from 'formik'
import { Rating } from 'react-simple-star-rating'
import styles from '../UserProfileFormStyles.module.css'
import { cloneDeep } from 'lodash'
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import DatePickerField from '../../../DatePickers/DatePicker'

const ErasmusInformationForm = ({ data, setIsUpdated }) => {
  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      datum.start_date = datum.start_date ? new Date(datum.start_date) : null
      datum.end_date = datum.end_date ? new Date(datum.end_date) : null
      datum.university = datum.edu_inst_id + '-' + datum.inst_name
      return datum
    })
    return newData
  }

  const onSubmitHandler = (values) => {
    setIsUpdated(true)
    let newData = cloneDeep(values.erasmus)
    newData[0].visibility = values.erasmus[0].visibility ? 1 : 0
    console.log(newData)
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
                      name='erasmus[0].university'
                      id='erasmus[0].university'
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
                        <option value='summer'>Summer</option>
                        <option value='fall'>Fall</option>
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
