import { useContext } from 'react'
import { FieldArray, Field, Formik, Form } from 'formik'
import { cloneDeep } from 'lodash'
import styles from './PersonalInformationForm.module.css'
import {
  EyeFill,
  EyeSlashFill,
  PlusCircleFill,
  XCircleFill,
} from 'react-bootstrap-icons'

import { Location_data } from '../../../../context/locationContext'

const PersonalInformationForm = ({ data }) => {
  const { locationData } = useContext(Location_data)

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      if ('city_name' in datum) {
        datum.city = `${datum.city_id}-${datum.city_name}`
        datum.country = `${datum.country_id}-${datum.country_name}`
      }
      return datum
    })
    // console.log(newData)
    return newData
  }

  const {
    basic_info,
    socials,
    phone_numbers,
    emails,
    career_objective,
    location,
  } = data

  return (
    <Formik
      initialValues={{
        first_name: basic_info[0].first_name,
        last_name: basic_info[0].last_name,
        socials: transformData(socials),
        phone: transformData(phone_numbers),
        email: transformData(emails),
        careerObjectives: transformData(career_objective),
        location: transformData(location),
      }}
      enableReinitialize
      onSubmit={(values) => console.log('values', values)}
    >
      {(props) => {
        return (
          <>
            <Form>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td>
                      <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>
                          First Name
                        </label>
                        <Field
                          className={`${styles.inputField}`}
                          style={{ width: '100%' }}
                          disabled
                          id='first_name'
                          name='first_name'
                          placeholder='First Name'
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>
                          last Name
                        </label>
                        <Field
                          className={`${styles.inputField}`}
                          disabled
                          id='last_name'
                          name='last_name'
                          placeholder='Last Name'
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>
                          Career Objectives
                        </label>
                        <Field
                          className={`${styles.inputField}`}
                          as='textarea'
                          rows={5}
                          id='careerObjectives[0].career_objective'
                          name='careerObjectives[0].career_objective'
                          placeholder='Enter your career objectives...'
                        />
                      </div>
                    </td>
                    <td className={styles.visibilityCheckboxContainer}>
                      <Field name='careerObjectives[0].visibility'>
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
                  <tr>
                    <td colSpan={3}>
                      <div className={styles.formPartitionHeading}>
                        <span>Location</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>
                          Country
                        </label>
                        <Field
                          as='select'
                          className={`${styles.inputField}`}
                          id='location[0].country'
                          name='location[0].country'
                        >
                          <option selected value=''>
                            Please select a Country
                          </option>
                          {Object.keys(locationData).map((country) => {
                            let countryName = country.split('-')[1]
                            return (
                              <option value={country}>{countryName}</option>
                            )
                          })}
                        </Field>
                      </div>
                      <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>City</label>
                        <Field
                          as='select'
                          className={`${styles.inputField}`}
                          id='location[0].city'
                          name='location[0].city'
                          disabled={!props.values.location[0]?.country}
                        >
                          <option selected value={''}>
                            Please select a{' '}
                            {props.values.location[0]?.country
                              ? 'City'
                              : 'Country'}
                          </option>
                          {locationData[props.values.location[0]?.country]?.map(
                            (city) => {
                              let cityName = city.split('-')[1]
                              return <option value={city}>{cityName}</option>
                            }
                          )}
                        </Field>
                      </div>
                    </td>
                    <td className={styles.visibilityCheckboxContainer}>
                      <Field name='location[0].visibility'>
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
                  <FieldArray
                    name='socials'
                    render={(arrayHelpers) => (
                      <>
                        <tr>
                          <td colSpan={3}>
                            <div className={styles.formPartitionHeading}>
                              <span>Social Medias</span>
                              <button
                                className={styles.addButton}
                                type='button'
                                onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                              >
                                <PlusCircleFill size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {props.values.socials &&
                        props.values.socials.length > 0 ? (
                          props.values.socials.map((social, index) => {
                            return (
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
                                    <div
                                      style={{
                                        flexGrow: '1',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <div
                                        className={styles.inputContainer}
                                        style={{ width: '30%' }}
                                      >
                                        <label className={styles.inputLabel}>
                                          Social Media
                                        </label>
                                        <Field
                                          className={styles.inputField}
                                          as='select'
                                          name={`socials[${index}]social_media_name`}
                                          id={`socials[${index}]social_media_name`}
                                        >
                                          <option value='Facebook'>
                                            Facebook
                                          </option>
                                          <option value='Linkedin'>
                                            LinkedIn
                                          </option>
                                          <option value='Other'>Other</option>
                                        </Field>
                                      </div>
                                      <div
                                        className={styles.inputContainer}
                                        style={{ width: '68%' }}
                                      >
                                        <label className={styles.inputLabel}>
                                          Link
                                        </label>
                                        <Field
                                          className={styles.inputField}
                                          name={`socials[${index}]link`}
                                          id={`socials[${index}]link`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className={styles.visibilityCheckboxContainer}
                                >
                                  <Field name={`socials[${index}]visibility`}>
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
                            )
                          })
                        ) : (
                          <tr>
                            <button
                              className={styles.bigAddBtn}
                              type='button'
                              onClick={() => arrayHelpers.push('')}
                            >
                              Add a Social Media
                            </button>
                          </tr>
                        )}
                      </>
                    )}
                  />
                  <FieldArray
                    name='phone'
                    render={(arrayHelpers) => (
                      <>
                        <tr>
                          <td colSpan={3}>
                            <div className={styles.formPartitionHeading}>
                              <span>Phone Numbers</span>
                              <button
                                className={styles.addButton}
                                type='button'
                                onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                              >
                                <PlusCircleFill size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {props.values.phone && props.values.phone.length > 0 ? (
                          props.values.phone.map((p, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div style={{ display: 'flex' }}>
                                    <div className={styles.removeBtnContainer}>
                                      <button
                                        className={styles.removeBtn}
                                        type='button'
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        } // remove a friend from the list
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
                                          Phone Number
                                        </label>
                                        <Field
                                          className={styles.inputField}
                                          name={`phone[${index}]phone_number`}
                                          id={`phone[${index}]phone_number`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className={styles.visibilityCheckboxContainer}
                                >
                                  <Field name={`phone[${index}]visibility`}>
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
                            )
                          })
                        ) : (
                          <tr>
                            <button
                              className={styles.bigAddBtn}
                              type='button'
                              onClick={() => arrayHelpers.push('')}
                            >
                              Add a Phone Number
                            </button>
                          </tr>
                        )}
                      </>
                    )}
                  />
                  <FieldArray
                    name='email'
                    render={(arrayHelpers) => (
                      <>
                        <tr>
                          <td colSpan={3}>
                            <div className={styles.formPartitionHeading}>
                              <span>Emails</span>
                              <button
                                className={styles.addButton}
                                type='button'
                                onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                              >
                                <PlusCircleFill size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {props.values.email && props.values.email.length > 0 ? (
                          props.values.email.map((e, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div style={{ display: 'flex' }}>
                                    <div className={styles.removeBtnContainer}>
                                      <button
                                        className={styles.removeBtn}
                                        type='button'
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        } // remove a friend from the list
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
                                          Email
                                        </label>
                                        <Field
                                          className={styles.inputField}
                                          name={`email[${index}]email_address`}
                                          id={`email[${index}]email_address`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className={styles.visibilityCheckboxContainer}
                                >
                                  <Field name={`email[${index}]visibility`}>
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
                            )
                          })
                        ) : (
                          <tr>
                            <button
                              className={styles.bigAddBtn}
                              type='button'
                              onClick={() => arrayHelpers.push('')}
                            >
                              Add an Email
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
          </>
        )
      }}
    </Formik>
  )
}

export default PersonalInformationForm
