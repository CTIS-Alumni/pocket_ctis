import styles from '../UserProfileFormStyles.module.css'
import { useEffect, useState, useContext } from 'react'
import { Formik, Form, FieldArray, Field } from 'formik'
import { cloneDeep } from 'lodash'
import {
  EyeFill,
  EyeSlashFill,
  PlusCircleFill,
  ToggleOff,
  ToggleOn,
  XCircleFill,
} from 'react-bootstrap-icons'
import DatePickerField from '../../../DatePickers/DatePicker'
import { craftUrl, craftUserUrl } from '../../../../helpers/urlHelper'
import { Location_data } from '../../../../context/locationContext'
import {
  _getFetcher,
  createReqObject,
  submitChanges,
} from '../../../../helpers/fetchHelpers'
import {
  convertToIso,
  replaceWithNull,
  splitFields,
  handleResponse,
} from '../../../../helpers/submissionHelpers'
import { toast } from 'react-toastify'

const WorkInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [companies, setCompanies] = useState([])
  const [worktypes, setWorktypes] = useState([])
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)
  const { locationData } = useContext(Location_data)
  const [loading, setLoading] = useState(false)

  let deletedData = []

  useEffect(() => {
    _getFetcher({
      companies: craftUrl('companies'),
      work_types: craftUrl('worktypes'),
    })
      .then(({ companies, work_types }) => {
        setCompanies(companies.data)
        setWorktypes(work_types.data)
      })
      .catch((err) => console.log(err))
  }, [])

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      datum.is_current = datum.is_current == 1
      datum.start_date = datum.start_date ? new Date(datum.start_date) : null
      datum.end_date = datum.end_date ? new Date(datum.end_date) : null
      datum.company = `${datum.company_id}-${datum.company_name}`
      datum.work_type = `${datum.work_type_id}-${datum.work_type_name}`
      datum.country = `${datum.country_id}-${datum.country_name}`
      datum.city = `${datum.city_id}-${datum.city_name}`

      return datum
    })
    return newData
  }

  const transformDataForSubmission = (newData) => {
    newData.work_records = newData.work_records.map((val) => {
      val.visibility = val.visibility ? 1 : 0
      val.is_current = val.is_current ? 1 : 0
      if (val.is_current && val.end_date) val.end_date = null
      val.start_date =
        val.start_date != null ? convertToIso(val.start_date) : null
      val.end_date = val.end_date != null ? convertToIso(val.end_date) : null
      val.department = val.department ? val.department.trim() : null
      val.position = val.position ? val.position.trim() : null
      val.work_description = val.work_description
        ? val.work_description.trim()
        : null
      replaceWithNull(val)
      splitFields(val, ['work_type', 'company', 'city', 'country'])
      return val
    })
  }

  const onSubmit = async (values) => {
    setIsUpdated(true)
    let newData = cloneDeep(values)
    transformDataForSubmission(newData)

    const args = [
      ['work_type', 'company', 'country', 'city'],
      [],
      ['id', 'record_date', 'user_id'],
      ['start_date', 'end_date'],
    ]
    const send_to_req = { work_records: cloneDeep(dataAfterSubmit) }
    transformDataForSubmission(send_to_req)
    const requestObj = createReqObject(
      send_to_req.work_records,
      newData.work_records,
      deletedData
    )
    const url = craftUserUrl(user_id, 'workrecords')
    const responseObj = await submitChanges(url, requestObj)

    const new_data = handleResponse(
      send_to_req.work_records,
      requestObj,
      responseObj,
      values,
      'work_records',
      args,
      transformDataForSubmission
    )
    applyNewData(new_data)
    console.log('req', requestObj, 'res', responseObj)

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
    } else {
      toast.success('Data successfully saved')
    }

    deletedData = []
  }

  return (
    <>
      <Formik
        initialValues={{
          work_records: transformData(data),
        }}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(props) => {
          return (
            <Form>
              <table style={{ width: '100%' }}>
                <tbody>
                  <FieldArray
                    name='work_records'
                    render={(arrayHelpers) => (
                      <>
                        <tr>
                          <td colSpan={3}>
                            <div
                              className={styles.formPartitionHeading}
                              style={{ marginTop: 0 }}
                            >
                              <span>Work Information</span>
                              <button
                                className={styles.addButton}
                                type='button'
                                onClick={() =>
                                  arrayHelpers.insert(0, {
                                    company: '',
                                    work_type: '',
                                    city: '',
                                    country: '',
                                    start_date: null,
                                    end_date: null,
                                    department: '',
                                    position: '',
                                    work_description: '',
                                  })
                                }
                              >
                                <PlusCircleFill size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {props.values.work_records &&
                        props.values.work_records.length > 0 ? (
                          props.values.work_records.map(
                            (work_record, index) => {
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
                                              if (
                                                work_record.hasOwnProperty('id')
                                              )
                                                deletedData.push({
                                                  name: work_record.id,
                                                  id: work_record.id,
                                                  data: work_record,
                                                })
                                            }}
                                          >
                                            <XCircleFill
                                              size={13}
                                              className={styles.removeIcon}
                                            />
                                          </button>
                                        </div>
                                        <div
                                          style={{
                                            flexGrow: '1',
                                          }}
                                        >
                                          <div
                                            className={styles.inputContainer}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Company Name
                                            </label>
                                            <Field
                                              as='select'
                                              className={styles.inputField}
                                              name={`work_records[${index}]company`}
                                              id={`work_records[${index}]company`}
                                            >
                                              <option value='' selected>
                                                Select Company
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
                                                Country
                                              </label>
                                              <Field
                                                as='select'
                                                className={styles.inputField}
                                                name={`work_records[${index}]country`}
                                                id={`work_records[${index}]country`}
                                                onChange={(event) => {
                                                  props.setFieldValue(
                                                    `work_records[${index}]city`,
                                                    ''
                                                  )

                                                  props.setFieldValue(
                                                    `work_records[${index}]country`,
                                                    event.target.value
                                                  )
                                                }}
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
                                                as='select'
                                                disabled={!work_record.country}
                                                className={styles.inputField}
                                                name={`work_records[${index}]city`}
                                                id={`work_records[${index}]city`}
                                                onChange={(event) => {
                                                  props.setFieldValue(
                                                    `work_records[${index}]city`,
                                                    event.target.value
                                                  )
                                                }}
                                              >
                                                <option selected value=''>
                                                  Please select a{' '}
                                                  {work_record.country
                                                    ? 'city'
                                                    : 'country'}
                                                </option>
                                                {locationData[
                                                  work_record.country
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
                                                Department
                                              </label>
                                              <Field
                                                className={styles.inputField}
                                                name={`work_records[${index}]department`}
                                                id={`work_records[${index}]department`}
                                                disabled={!work_record.company}
                                              />
                                            </div>
                                            <div
                                              className={styles.inputContainer}
                                              style={{ width: '49%' }}
                                            >
                                              <label
                                                className={styles.inputLabel}
                                              >
                                                Position
                                              </label>
                                              <Field
                                                className={styles.inputField}
                                                name={`work_records[${index}]position`}
                                                id={`work_records[${index}]position`}
                                                disabled={!work_record.company}
                                              />
                                            </div>
                                            <div
                                              className={styles.inputContainer}
                                              style={{ width: '49%' }}
                                            >
                                              <label
                                                className={styles.inputLabel}
                                              >
                                                Work Type
                                              </label>
                                              <Field
                                                as='select'
                                                className={styles.inputField}
                                                name={`work_records[${index}]work_type`}
                                                id={`work_records[${index}]work_type`}
                                              >
                                                <option
                                                  value=''
                                                  disabled
                                                  selected
                                                >
                                                  Select Work Type
                                                </option>
                                                {worktypes.map((workType) => (
                                                  <option
                                                    value={`${workType.id}-${workType.work_type_name}`}
                                                  >
                                                    {workType.work_type_name}
                                                  </option>
                                                ))}
                                              </Field>
                                            </div>
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
                                              <label
                                                className={styles.inputLabel}
                                              >
                                                Start Date
                                              </label>
                                              <DatePickerField
                                                format='MMM/y'
                                                maxDetail='year'
                                                className={
                                                  styles.dateInputField
                                                }
                                                name={`work_records[${index}]start_date`}
                                                id={`work_records[${index}]start_date`}
                                                disabled={
                                                  !work_record.work_type
                                                }
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
                                                disabled={
                                                  work_record.is_current ||
                                                  !work_record.work_type
                                                }
                                                format='MMM/y'
                                                maxDetail='year'
                                                className={
                                                  styles.dateInputField
                                                }
                                                name={`work_records[${index}]end_date`}
                                                id={`work_records[${index}]end_date`}
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
                                                name={`work_records[${index}]is_current`}
                                                id={`work_records[${index}]is_current`}
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
                                                      &nbsp; Currently Working?
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
                                          <div
                                            className={styles.inputContainer}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Work description
                                            </label>
                                            <Field
                                              as='textarea'
                                              rows={5}
                                              className={styles.inputField}
                                              name={`work_records[${index}]work_description`}
                                              id={`work_records[${index}]work_description`}
                                              disabled={!work_record.work_type}
                                            />
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
                                        name={`work_records[${index}]visibility`}
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
                                  {/* shows spacer only between records */}
                                  {props.values.work_records.length - 1 >
                                    index && (
                                    <tr className={styles.spacer}>
                                      <td />
                                    </tr>
                                  )}
                                </>
                              )
                            }
                          )
                        ) : (
                          <tr>
                            <button
                              className={styles.bigAddBtn}
                              type='button'
                              onClick={() => arrayHelpers.push('')}
                            >
                              Add a Work Record
                            </button>
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

export default WorkInformationForm
