import styles from '../UserProfileFormStyles.module.css'
import { useState, useEffect } from 'react'
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import { Formik, Field, Form } from 'formik'
import { cloneDeep } from 'lodash'
import { fetchAllHighSchool } from '../../../../helpers/searchHelpers'

const HighSchoolInformationForm = ({ data }) => {
  const [highSchools, setHighSchools] = useState([])

  useEffect(() => {
    fetchAllHighSchool().then((res) => setHighSchools(res.data))
  }, [])

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      datum.high_school = `${datum.high_school_id}-${datum.high_school_name}`
      return datum
    })
    return newData
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          high_school: transformData(data),
        }}
        onSubmit={(values) => console.log(values)}
      >
        {(props) => {
          return (
            <>
              <Form>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td>
                        <div className={styles.inputContainer}>
                          <label className={styles.inputLabel}>
                            High School
                          </label>
                          <Field
                            as='select'
                            name='high_school[0].high_school'
                            id='high_school[0].high_school'
                            className={styles.inputField}
                          >
                            <option selected disabled value=''>
                              Please select High School
                            </option>
                            {highSchools.map((highSchool, index) => (
                              <option
                                key={index}
                                value={`${highSchool.id}-${highSchool.high_school_name}`}
                              >
                                {highSchool.high_school_name}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </td>
                      <td className={styles.visibilityCheckboxContainer}>
                        <Field name={`high_school[0].visibility`}>
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
                  </tbody>
                </table>
                <div>
                  <button type='submit' className={styles.submitBtn}>
                    Submit
                  </button>
                </div>
              </Form>
            </>
          )
        }}
      </Formik>
    </>
  )
}

export default HighSchoolInformationForm
