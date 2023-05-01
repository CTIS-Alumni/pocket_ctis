import { Field, FieldArray, Form, Formik } from 'formik'
import { cloneDeep } from 'lodash'
import React, { useEffect, useState } from 'react'

import { XCircleFill, PlusCircleFill } from 'react-bootstrap-icons'
import { Rating } from 'react-simple-star-rating'
import DatePickerField from '../../../DatePickers/DatePicker'
import styles from './AdminUserFormStyles.module.css'
import {_getFetcher, createReqObject, submitChanges} from '../../../../helpers/fetchHelpers'
import {craftUrl, craftUserUrl} from '../../../../helpers/urlHelper'
import {convertToIso, handleResponse, replaceWithNull, splitFields} from "../../../../helpers/submissionHelpers";

const InternshipInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [companies, setCompanies] = useState([])
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

  let deletedData = [];

  useEffect(() => {
    _getFetcher({ companies: craftUrl('companies', [{name: "internship", value: 1}]) })
      .then((res) => setCompanies(res.companies.data))
      .catch((err) => console.log(err))
  }, [])

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.company = `${datum.company_id}-${datum.company_name}`
      datum.start_date = datum.start_date ? new Date(datum.start_date) : null
      datum.end_date = datum.end_date ? new Date(datum.end_date) : null
      datum.visibility = datum.visibility == 1
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
      splitFields(val, ["company"])
      replaceWithNull(val)
      return val
    })
  }

  const args = [
    ["company"],
    [],
    ['id', 'user_id', 'record_date'],
    ['start_date', 'end_date'],
  ]

  const onSubmit = async (values) => {
    let newData = cloneDeep(values)
    transformDataForSubmission(newData)

    const send_to_req = { internships: cloneDeep(dataAfterSubmit) }
    transformDataForSubmission(send_to_req)
    const requestObj = createReqObject(
        send_to_req.internships,
        newData.internships,
        deletedData
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
    deletedData = []

    setIsUpdated(true)
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
                      <tr>
                        <td colSpan={3}>
                          <div
                            className={styles.formPartitionHeading}
                            style={{ marginTop: 0 }}
                          >
                            <span>Internship Information</span>
                            <button
                              className={styles.addButton}
                              type='button'
                              onClick={() =>
                                arrayHelpers.insert(0, {
                                  company: '',
                                  start_date: null,
                                  end_date: null,
                                  department: '',
                                  semester: 'Spring',
                                  rating: 0,
                                  opinion: '',
                                })
                              }
                            >
                              <PlusCircleFill size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {props.values.internships &&
                        props.values.internships.length > 0 &&
                        props.values.internships.map((internship, index) => {
                          return (
                            <>
                              <tr>
                                <td>
                                  <div style={{ display: 'flex' }}>
                                    <div className={styles.removeBtnContainer}>
                                      <button
                                        className={styles.removeBtn}
                                        type='button'
                                        onClick={() => {
                                          arrayHelpers.remove(index)
                                          if (internship.hasOwnProperty('id'))
                                            deletedData.push({
                                              name: internship.id,
                                              id: internship.id,
                                              data: internship
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
                                          Company Name
                                        </label>
                                        <Field
                                          as='select'
                                          className={styles.inputField}
                                          name={`internships[${index}].company`}
                                          id={`internships[${index}].company`}
                                        >
                                          <option selected disabled value=''>
                                            Please select a Company
                                          </option>
                                          {companies.map((company) => (
                                            <option
                                              value={`${company.id}-${company.company_name}`}
                                            >
                                              {company.company_name}
                                            </option>
                                          ))}
                                        </Field>
                                      </div>
                                      <div className={styles.inputContainer}>
                                        <label className={styles.inputLabel}>
                                          Department
                                        </label>
                                        <Field
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
                                          className={styles.inputField}
                                          as='select'
                                          name={`internships[${index}]semester`}
                                          id={`internships[${index}]semester`}
                                        >
                                          <option value='Spring'>Spring</option>
                                          <option value='Fall'>Fall</option>
                                          <option value='Summer'>Summer</option>
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
                                            props.values.internships[index]
                                              .rating
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
                                          placeholder='Enter your opinions...'
                                        />
                                      </div>
                                    </div>
                                  </div>
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
