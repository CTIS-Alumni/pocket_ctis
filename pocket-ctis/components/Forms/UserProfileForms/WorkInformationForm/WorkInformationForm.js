import styles from '../UserProfileFormStyles.module.css'
import {
  fetchAllCompanies,
  fetchAllWorkTypes,
} from '../../../../helpers/searchHelpers'
import { useEffect, useState } from 'react'
import { Formik, Form, Input, FieldArray, Field } from 'formik'
import { cloneDeep } from 'lodash'
import {
  EyeFill,
  EyeSlashFill,
  PlusCircleFill,
  XCircleFill,
} from 'react-bootstrap-icons'

const WorkInformationForm = ({ data }) => {
  const [companies, setCompanies] = useState([])
  const [worktypes, setWorktypes] = useState([])
  //   console.log(companies)

  useEffect(() => {
    fetchAllCompanies().then((res) => setCompanies(res.data))
    fetchAllWorkTypes()
      .then((res) => setWorktypes(res.data))
      .catch((err) => console.log(err))
  }, [])

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      return datum
    })
    return newData
  }

  return (
    <>
      <Formik
        initialValues={{
          work_records: transformData(data),
        }}
        enableReinitialize
        onSubmit={(values) => console.log('values', values)}
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
                                onClick={() => arrayHelpers.insert(0, '')}
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
                                              name={`work_records[${index}]company_name`}
                                              id={`work_records[${index}]company_name`}
                                            >
                                              <option
                                                value=''
                                                disabled
                                                selected
                                              >
                                                Select Company
                                              </option>
                                              {companies.map((company) => (
                                                <option
                                                  value={company.company_name}
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
                                                className={styles.inputField}
                                                name={`work_records[${index}]country_name`}
                                                id={`work_records[${index}]country_name`}
                                              />
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
                                                className={styles.inputField}
                                                name={`work_records[${index}]city_name`}
                                                id={`work_records[${index}]city_name`}
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
                                                Department
                                              </label>
                                              <Field
                                                className={styles.inputField}
                                                name={`work_records[${index}]department`}
                                                id={`work_records[${index}]department`}
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
                                                name={`work_records[${index}]type_name`}
                                                id={`work_records[${index}]type_name`}
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
                                                    value={workType.type_name}
                                                  >
                                                    {workType.type_name}
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
                                              <Field
                                                className={styles.inputField}
                                                name={`work_records[${index}]start_date`}
                                                id={`work_records[${index}]start_date`}
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
                                              <Field
                                                className={styles.inputField}
                                                name={`work_records[${index}]end_date`}
                                                id={`work_records[${index}]end_date`}
                                              />
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
                                  {/* shows spaver only between records */}
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
