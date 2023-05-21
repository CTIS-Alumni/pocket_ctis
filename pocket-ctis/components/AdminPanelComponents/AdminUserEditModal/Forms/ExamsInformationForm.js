import { useState, useEffect } from 'react'

import { Formik, Field, FieldArray, Form } from 'formik'
import { XCircleFill, PlusCircleFill } from 'react-bootstrap-icons'
import DatePickerField from '../../../DatePickers/DatePicker'

import styles from './AdminUserFormStyles.module.css'

import { cloneDeep } from 'lodash'
import {
  convertToIso,
  handleResponse,
  replaceWithNull,
  splitFields,
} from '../../../../helpers/submissionHelpers'
import {
  _getFetcher,
  createReqObject,
  submitChanges,
} from '../../../../helpers/fetchHelpers'
import { craftUrl } from '../../../../helpers/urlHelper'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'

const ExamsInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [examTypes, setExamTypes] = useState([])
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)
  const [isLoading, setIsLoading] = useState(false)

  let deletedData = []

  useEffect(() => {
    _getFetcher({ exams: craftUrl(['exams']) }).then(({ exams }) =>
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

  const args = [['exam'], [], ['id', 'user_id'], ['exam_date']]
  const url = craftUrl(['users', user_id, 'exams'])

  const onSubmit = async (values) => {
    setIsLoading(true)
    setIsUpdated(true)
    let newData = cloneDeep(values)
    transformDataForSubmission(newData)
    const send_to_req = { exams: cloneDeep(dataAfterSubmit) }
    transformDataForSubmission(send_to_req)
    const requestObj = createReqObject(
      send_to_req.exams,
      newData.exams,
      deletedData,
      args[4]
    )
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
    let errors = []
    for (const [key, value] of Object.entries(responseObj)) {
      if (value.errors?.length > 0) {
        errors = [...errors, ...value.errors.map((error) => error)]
      }
    }

    if (errors.length > 0) {
      errors.forEach((errorInfo) => {
        toast.error(errorInfo.error)
      })
    } else if (
      responseObj.POST.data ||
      responseObj.PUT.data ||
      responseObj.DELETE.data
    ) {
      toast.success('Data successfully saved')
    }
    setIsLoading(false)
  }

  return (
    <Formik
      initialValues={{ exams: transformData(data) }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(props) => {
        return (
          <Form style={{ position: 'relative' }}>
            {isLoading && (
              <div
                style={{
                  zIndex: 2,
                  position: 'absolute',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                  background: '#ccc',
                  opacity: '0.5',
                }}
              >
                <Spinner />
              </div>
            )}
            <table className={styles.formTable}>
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
                                    exam_date: null,
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
                                      <div
                                        className={styles.removeBtnContainer}
                                      >
                                        <button
                                          className={styles.removeBtn}
                                          type='button'
                                          onClick={() => {
                                            arrayHelpers.remove(index)
                                            if (exam.hasOwnProperty('id'))
                                              deletedData.push({
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
                                            <label
                                              className={styles.inputLabel}
                                            >
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
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Exam Date
                                            </label>
                                            <DatePickerField
                                              format='dd/MM/y'
                                              maxDetail='month'
                                              className={styles.dateInputField}
                                              id={`exams[${index}]exam_date`}
                                              name={`exams[${index}]exam_date`}
                                              disabled={!exam.exam}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
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
                                onClick={() =>
                                  arrayHelpers.push({
                                    exam: '',
                                    grade: '',
                                    exam_date: null,
                                  })
                                }
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
        )
      }}
    </Formik>
  )
}

export default ExamsInformationForm
