import { useState, useEffect } from 'react'
import { Formik, Field, FieldArray, Form } from 'formik'
import { cloneDeep } from 'lodash'
import styles from '../UserProfileFormStyles.module.css'
import {
  EyeFill,
  EyeSlashFill,
  XCircleFill,
  PlusCircleFill,
} from 'react-bootstrap-icons'
import DatePickerField from '../../../DatePickers/DatePicker'
import {
  convertToIso,
  replaceWithNull,
  splitFields,
  handleResponse,
} from '../../../../helpers/submissionHelpers'
import {
  _getFetcher,
  createReqObject,
  submitChanges,
} from '../../../../helpers/fetchHelpers'
import { craftUrl, craftUserUrl } from '../../../../helpers/urlHelper'

const ExamsInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [examTypes, setExamTypes] = useState([])
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)

  let deletedData = []

  useEffect(() => {
    _getFetcher({ exams: craftUrl('exams') }).then(({ exams }) =>
      setExamTypes(
        exams.data.map((datum) => {
          return {
            ...datum,
            exam: `${datum.id}-${datum.exam_name}`,
          }
        })
      )
    )
  }, [])

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      replaceWithNull(datum)
      datum.visibility = datum.visibility == 1
      datum.exam = `${datum.exam_id}-${datum.exam_name}`
      datum.exam_date = datum.exam_date ? new Date(datum.exam_date) : null
      return datum
    })
    return newData
  }

  const transformDataForSubmission = (newData) => {
    newData.exams = newData.exams.map((val) => {
      val.visibility = val.visibility ? 1 : 0
      val.exam_date = val.exam_date != null ? convertToIso(val.exam_date) : null
      val.grade = val.grade ? val.grade : null
      replaceWithNull(val)
      splitFields(val, ['exam'])
      return val
    })
  }

  const onSubmit = async (values) => {
    setIsUpdated(true)
    let newData = cloneDeep(values)
    transformDataForSubmission(newData)
    const args = [['exam'], [], ['id', 'user_id'], ['exam_date']]
    const send_to_req = { exams: cloneDeep(dataAfterSubmit) }
    transformDataForSubmission(send_to_req)
    const requestObj = createReqObject(
      send_to_req.exams,
      newData.exams,
      deletedData,
      args[4]
    )
    const url = craftUserUrl(user_id, 'exams')
    const responseObj = await submitChanges(url, requestObj)

    const new_data = handleResponse(
      send_to_req.exams,
      requestObj,
      responseObj,
      values,
      'exams',
      args,
      transformDataForSubmission
    )
    applyNewData(new_data)
    console.log('req, ', requestObj, 'res', responseObj)

    deletedData = []
  }

  return (
    <Formik
      initialValues={{ exams: transformData(data) }}
      enableReinitialize
      onSubmit={onSubmit}
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
                              onClick={() =>
                                arrayHelpers.insert(0, {
                                  exam: '',
                                  grade: '',
                                  date: null,
                                })
                              }
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
                                        onClick={() => {
                                          arrayHelpers.remove(index)
                                          if (exam.hasOwnProperty('id'))
                                            deletedData.push({
                                              name: exam.id,
                                              id: exam.id,
                                              data: exam,
                                            })
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
                                          Exams Type
                                        </label>
                                        <Field
                                          as='select'
                                          className={styles.inputField}
                                          id={`exams[${index}]exam`}
                                          name={`exams[${index}]exam`}
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
                                            className={styles.inputField}
                                            id={`exams[${index}]grade`}
                                            name={`exams[${index}]grade`}
                                            disabled={!exam.exam}
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
                                            disabled={!exam.grade}
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
