import { useState, useEffect } from 'react'
import { Formik, Field, FieldArray, Form } from 'formik'
import { fetchAllExams } from '../../../../helpers/searchHelpers'
import { cloneDeep } from 'lodash'
import styles from '../UserProfileFormStyles.module.css'
import {
  EyeFill,
  EyeSlashFill,
  XCircleFill,
  PlusCircleFill,
} from 'react-bootstrap-icons'
import DatePickerField from '../../../DatePickers/DatePicker'

const ExamsInformationForm = ({ data }) => {
  const [examTypes, setExamTypes] = useState([])

  useEffect(() => {
    fetchAllExams().then((res) =>
      setExamTypes(
        res.data.map((datum) => {
          return {
            ...datum,
            exam: `${datum.id}-${datum.exam_name}`,
          }
        })
      )
    )
  }, [])

  const onSubmitHandler = (values) => {
    console.log('here', values)

    for (const datum of values.exams) {
      //transform fields here if needed
      datum.visibility = datum?.visibility ? 1 : 0
    }
    console.log(values)
  }

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      datum.exam = `${datum.exam_id}-${datum.exam_name}`
      datum.exam_date = datum.exam_date ? new Date(datum.exam_date) : null
      return datum
    })
    return newData
  }

  return (
    <Formik
      initialValues={{ exams: transformData(data) }}
      enableReinitialize
      onSubmit={onSubmitHandler}
    >
      {(props) => (
        <Form>
          <table style={{ width: '100%' }}>
            <tbody>
              <FieldArray
                name='exams'
                render={(arrayHelpers) => {
                  return (
                    <>
                      <tr>
                        <td colSpan={3}>
                          <div
                            className={styles.formPartitionHeading}
                            style={{ marginTop: 0 }}
                          >
                            <span>Exams</span>
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
                      {props.values.exams && props.values.exams.length > 0 ? (
                        props.values.exams.map((exam, index) => {
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
                                          Exams Type
                                        </label>
                                        <Field
                                          as='select'
                                          className={styles.inputField}
                                          id={`exams[${index}]exam`}
                                          name={`exams[${index}]exam`}
                                          onChange={(event) => {
                                            const val = event.target.value
                                            props.setFieldValue(
                                              `exams[${index}]exam`,
                                              val
                                            )
                                            props.setFieldValue(
                                              `exams[${index}]exam_name`,
                                              val.split('-')[1]
                                            )
                                            props.setFieldValue(
                                              `exams[${index}]exam_id`,
                                              val.split('-')[0]
                                            )
                                          }}
                                        >
                                          <option disabled selected value=''>
                                            Please Select Exam type
                                          </option>
                                          {examTypes.map((type) => (
                                            <option
                                              value={`${type.id}-${type.exam_name}`}
                                            >
                                              {type.exam_name}
                                            </option>
                                          ))}
                                        </Field>
                                      </div>

                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          flexWrap: 'wrap',
                                        }}
                                      >
                                        <div
                                          className={styles.inputContainer}
                                          style={{ width: '49%' }}
                                        >
                                          <label className={styles.inputLabel}>
                                            Exam Score
                                          </label>
                                          <Field
                                            type='number'
                                            className={styles.inputField}
                                            id={`exams[${index}]grade`}
                                            name={`exams[${index}]grade`}
                                          />
                                        </div>
                                        <div
                                          className={styles.inputContainer}
                                          style={{ width: '49%' }}
                                        >
                                          <label className={styles.inputLabel}>
                                            Exam Date
                                          </label>
                                          <DatePickerField
                                            format='dd/MM/y'
                                            maxDetail='month'
                                            className={styles.dateInputField}
                                            id={`exams[${index}]exam_date`}
                                            name={`exams[${index}]exam_date`}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className={styles.visibilityCheckboxContainer}
                                >
                                  <Field name={`exams[${index}]visibility`}>
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
                              {props.values.exams.length - 1 > index && (
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
                              Add an Exam
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

export default ExamsInformationForm
