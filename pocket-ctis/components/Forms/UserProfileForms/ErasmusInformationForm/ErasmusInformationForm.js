import { Formik, Field, Form } from 'formik'
import { Rating } from 'react-simple-star-rating'
import styles from '../UserProfileFormStyles.module.css'
import { cloneDeep } from 'lodash'
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import DatePickerField from '../../../DatePickers/DatePicker'
import React, {useEffect, useState} from 'react'
import {
  convertToIso,
  handleResponse,
  replaceWithNull, splitFields,
} from '../../../../helpers/submissionHelpers'
import {
  _getFetcher,
  _submitFetcher,
  createReqObject,
  submitChanges,
} from '../../../../helpers/fetchHelpers'
import { craftUrl } from '../../../../helpers/urlHelper'
import {toast} from "react-toastify";
import {Spinner} from "react-bootstrap";


const ErasmusInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)
  const [isLoading, setIsLoading] = useState(false)

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

  const args = [
    ['edu_inst'],
    [],
    ['id', 'user_id', 'record_date'],
    ['start_date', 'end_date'],
  ]

  useEffect(() => {
    _getFetcher({
      universities: craftUrl(
          ['educationinstitutes'],
          [{ name: 'is_erasmus', value: 1 }]
      ),
    })
        .then((res) => setUniversities(res.universities.data))
        .catch((err) => console.log(err))
  }, [])

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.edu_inst = `${datum.edu_inst_id}-${datum.edu_inst_name}`
      datum.start_date = datum.start_date ? new Date(datum.start_date) : null
      datum.end_date = datum.end_date ? new Date(datum.end_date) : null
      datum.visibility = datum.visibility == 1
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
      splitFields(val, ['edu_inst'])
      return val
    })
  }

  const url = craftUrl(['users', user_id, 'erasmus'])

  const onSubmit = async (values) => {
    setIsLoading(true)
    setIsUpdated(true)
    let newData = cloneDeep(values)
    transformDataForSubmission(newData)

    const send_to_req = { erasmus: cloneDeep(dataAfterSubmit) }
    transformDataForSubmission(send_to_req)
    const requestObj = createReqObject(
        send_to_req.erasmus,
        newData.erasmus,
        []
    )

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
      initialValues={{ erasmus: transformData(data) }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(props) => (
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
          <table style={{ width: '100%' }}>
            <tbody>
            {props.values.erasmus &&
            props.values.erasmus.length > 0 ? (
                props.values.erasmus.map((erasmus, index) => {
                  return (
                      <>
                        <tr key={index} style={{width: '100%'}}>
                          <td>
                            <div className={styles.inputContainer}>
                              <label className={styles.inputLabel}>University</label>
                              <Field
                                  className={styles.inputField}
                                  name={`erasmus[${index}].edu_inst`}
                                  id={`erasmus[${index}].edu_inst`}
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
                                  style={{width: '49%'}}
                              >
                                <label className={`${styles.inputLabel}`}>
                                  Start Date
                                </label>
                                <DatePickerField
                                    format='MMM/y'
                                    disabled
                                    maxDetail='year'
                                    className={styles.dateInputField}
                                    name={`erasmus[${index}]start_date`}
                                    id={`erasmus[${index}]start_date`}
                                />
                              </div>
                              <div
                                  className={`${styles.inputContainer}`}
                                  style={{width: '49%'}}
                              >
                                <label className={`${styles.inputLabel}`}>End Date</label>
                                <DatePickerField
                                    format='MMM/y'
                                    disabled
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
                                  style={{width: '49%'}}
                              >
                                <label className={`${styles.inputLabel}`}>Semester</label>
                                <Field
                                    disabled
                                    className={styles.inputField}
                                    as='select'
                                    name={`erasmus[${index}]semester`}
                                    id={`erasmus[${index}]semester`}
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
                                      props.setFieldValue(`erasmus[${index}].rating`, rating)}
                                  initialValue={props.values.erasmus[index].rating}
                                  transition={true}
                                  allowFraction={true}
                                  fillColor={'#8d2729'}
                                  style={{marginTop: 5}}
                              />
                              <span
                                  onClick={() => {
                                    props.setFieldValue(`erasmus[${index}].rating`, 0)
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
                              >Reset</span>
                            </div>
                            <div className={`${styles.inputContainer}`}>
                              <label className={`${styles.inputLabel}`}>Opinion</label>
                              <Field
                                  className={`${styles.inputField}`}
                                  as='textarea'
                                  rows={5}
                                  id={`erasmus[${index}].opinion`}
                                  name={`erasmus[${index}].opinion`}
                                  placeholder='Enter your opinions...'
                              />
                            </div>
                          </td>
                          <td className={styles.visibilityCheckboxContainer}>
                            <Field name='erasmus[0].visibility'>
                              {({field, form, meta}) => {
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
                                          style={{display: 'none'}}
                                      />
                                    </label>
                                )
                              }}
                            </Field>
                          </td>
                        </tr>
                      </>
                  ) })
                ) : ''}
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
