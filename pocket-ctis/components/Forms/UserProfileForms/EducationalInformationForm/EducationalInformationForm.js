import { Formik, Form, FieldArray, Field } from 'formik'
import styles from '../UserProfileFormStyles.module.css'
import { cloneDeep } from 'lodash'
import {
  EyeFill,
  EyeSlashFill,
  PlusCircleFill,
  ToggleOff,
  ToggleOn,
  XCircleFill,
} from 'react-bootstrap-icons'
import { useEffect, useState, useContext } from 'react'
import {
  fetchAllDegreeTypes,
  fetchAllEducationInstitutes,
} from '../../../../helpers/searchHelpers'
import DatePickerField from '../../../DatePickers/DatePicker'

import { Location_data } from '../../../../context/locationContext'

const EducationInformationForm = ({ data }) => {
  const [eduInsts, setEduInsts] = useState([])
  const [degreeTypes, setDegreeTypes] = useState([])
  // const { locationData } = useContext(Location_data)

  useEffect(() => {
    fetchAllEducationInstitutes().then((res) => setEduInsts(res.data))
    fetchAllDegreeTypes().then((res) => setDegreeTypes(res.data))
  }, [])

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      datum.inst = `${datum.edu_inst_id}-${datum.inst_name}`
      datum.start_date = datum.start_date && new Date(datum.start_date)
      datum.end_date = datum.end_date && new Date(datum.end_date)
      // datum.country = `${datum.country_id}-${datum.country_name}`
      // datum.city = `${datum.city_id}-${datum.city_name}`
      datum.degree = `${datum.degree_type_id}-${datum.degree_name}`
      datum.is_current = datum.is_current == 1

      return datum
    })
    return newData
  }

  const onSubmitHandler = (values) => {
    //transform data
    let newData = cloneDeep(values)
    console.log(newData)
    newData.edu_records = newData.edu_records.map((val) => {
      val.visibility = val.visibility ? 1 : 0
      val.is_current = val.is_current ? 1 : 0
      val.start_date =
        val.start_date != null ? new Date(val.start_date).toISOString() : null
      val.end_date =
        val.end_date != null ? new Date(val.end_date).toISOString() : null
      return val
    })
    console.log('values', newData)

    //continue here
  }

  return (
    <>
      <Formik
        initialValues={{
          edu_records: transformData(data),
        }}
        enableReinitialize
        onSubmit={(values) => onSubmitHandler(values)}
      >
        {(props) => {
          return (
            <Form>
              <table style={{ width: '100%' }}>
                <tbody>
                  <FieldArray
                    name='edu_records'
                    render={(arrayHelpers) => (
                      <>
                        <tr>
                          <td colSpan={3}>
                            <div
                              className={styles.formPartitionHeading}
                              style={{ marginTop: 0 }}
                            >
                              <span>Education Information</span>
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
                        {props.values.edu_records &&
                        props.values.edu_records.length > 0 ? (
                          props.values.edu_records.map((edu_record, index) => {
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
                                            Instiute Name
                                          </label>
                                          <Field
                                            as='select'
                                            className={styles.inputField}
                                            id={`edu_records[${index}]inst`}
                                            name={`edu_records[${index}]inst`}
                                          >
                                            <option disabled selected value=''>
                                              Please select Educational
                                              Institute
                                            </option>
                                            {eduInsts.map((inst) => (
                                              <option
                                                value={`${inst.id}-${inst.inst_name}`}
                                              >
                                                {inst.inst_name}
                                              </option>
                                            ))}
                                          </Field>
                                        </div>
                                        {/* <div
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                          }}
                                        >
                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Country
                                            </label>
                                            <Field
                                              as='select'
                                              className={styles.inputField}
                                              name={`edu_records[${index}]country`}
                                              id={`edu_records[${index}]country`}
                                            >
                                              <option selected value=''>
                                                Please select a country
                                              </option>
                                              {Object.keys(locationData).map(
                                                (country) => {
                                                  let countryName =
                                                    country.split('-')[1]
                                                  return (
                                                    <option value={country}>
                                                      {countryName}
                                                    </option>
                                                  )
                                                }
                                              )}
                                            </Field>
                                          </div>
                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              City
                                            </label>
                                            <Field
                                              disabled={!edu_record.country}
                                              as='select'
                                              className={styles.inputField}
                                              name={`edu_records[${index}]city`}
                                              id={`edu_records[${index}]city`}
                                            >
                                              <option selected value=''>
                                                Please select a{' '}
                                                {edu_record.country
                                                  ? 'city'
                                                  : 'country'}
                                              </option>
                                              {locationData[
                                                edu_record.country
                                              ]?.map((city) => {
                                                let cityName =
                                                  city.split('-')[1]
                                                return (
                                                  <option value={city}>
                                                    {cityName}
                                                  </option>
                                                )
                                              })}
                                            </Field>
                                          </div> 
                                        </div>*/}
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
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Degree Name
                                            </label>
                                            <Field
                                              as='select'
                                              className={styles.inputField}
                                              name={`edu_records[${index}]degree`}
                                              id={`edu_records[${index}]degree`}
                                            >
                                              <option selected value=''>
                                                Please select a Degree
                                              </option>
                                              {degreeTypes.map((degree) => (
                                                <option
                                                  value={`${degree.id}-${degree.degree_name}`}
                                                >
                                                  {degree.degree_name}
                                                </option>
                                              ))}
                                            </Field>
                                          </div>
                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Name of Program
                                            </label>
                                            <Field
                                              className={styles.inputField}
                                              name={`edu_records[${index}]name_of_program`}
                                              id={`edu_records[${index}]name_of_program`}
                                            />
                                          </div>
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
                                              Start Date
                                            </label>
                                            <DatePickerField
                                              format='MMM/y'
                                              maxDetail='year'
                                              className={styles.dateInputField}
                                              name={`edu_records[${index}]start_date`}
                                              id={`edu_records[${index}]start_date`}
                                            />
                                          </div>

                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              End Date
                                            </label>
                                            <DatePickerField
                                              disabled={edu_record.is_current}
                                              format='MMM/y'
                                              maxDetail='year'
                                              className={styles.dateInputField}
                                              name={`edu_records[${index}]end_date`}
                                              id={`edu_records[${index}]end_date`}
                                            />
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                          }}
                                        >
                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <Field
                                              name={`edu_records[${index}]is_current`}
                                              id={`edu_records[${index}]is_current`}
                                            >
                                              {({ field, form, meta }) => {
                                                return (
                                                  <label
                                                    className={
                                                      styles.isCurrentCheckbox
                                                    }
                                                  >
                                                    {field.value ? (
                                                      <ToggleOn
                                                        size={25}
                                                        className={
                                                          styles.isCurrentTrue
                                                        }
                                                      />
                                                    ) : (
                                                      <ToggleOff size={25} />
                                                    )}
                                                    &nbsp; Currently Studying?
                                                    <input
                                                      type='checkbox'
                                                      {...field}
                                                      style={{
                                                        display: 'none',
                                                      }}
                                                    />
                                                  </label>
                                                )
                                              }}
                                            </Field>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    className={
                                      styles.visibilityCheckboxContainer
                                    }
                                  >
                                    <Field
                                      name={`edu_records[${index}]visibility`}
                                    >
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
                                {props.values.edu_records.length - 1 >
                                  index && (
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
                                Add an Education Record
                              </button>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
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
    </>
  )
}

export default EducationInformationForm
