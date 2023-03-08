import { useContext, useState, useEffect } from 'react'
import { FieldArray, Field, Formik, Form } from 'formik'
import { cloneDeep, isArray, isObject } from 'lodash'
import styles from './PersonalInformationForm.module.css'
import {
  EyeFill,
  EyeSlashFill,
  PlusCircleFill,
  XCircleFill,
} from 'react-bootstrap-icons'

import { Location_data } from '../../../../context/locationContext'
import {
  fetchAllSectors,
  fetchAllSocialMediaTypes,
} from '../../../../helpers/searchHelpers'

const PersonalInformationForm = ({ data, setIsUpdated }) => {
  const { locationData } = useContext(Location_data)
  const [sectors, setSectors] = useState([])
  const [socialMediaTypes, setSocialMediaTypes] = useState([])

  useEffect(() => {
    fetchAllSectors().then((res) => {
      setSectors(
        res.data.map((s) => {
          return {
            ...s,
            sector: `${s.id}-${s.sector_name}`,
          }
        })
      )
    })
    fetchAllSocialMediaTypes().then((res) =>
      setSocialMediaTypes(
        res.data.map((social) => {
          return {
            ...social,
            social: `${social.id}-${social.social_media_name}`,
          }
        })
      )
    )
  }, [])

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

  const transformWantedSectors = (data) => {
    const newData = {}
    newData.sectors = data.map(
      (sector) => `${sector.sector_id}-${sector.sector_name}`
    )
    newData.visibility = data[0].visibility == 1
    // console.log(newData)
    return newData
  }

  const transformSocials = (data) => {
    return data.map((datum) => {
      return {
        ...datum,
        social: `${datum.social_media_id}-${datum.social_media_name}`,
      }
    })
  }

  const {
    basic_info,
    socials,
    phone_numbers,
    emails,
    career_objective,
    location,
    wanted_sectors,
    graduation_project,
  } = data
  // console.log(data)
  const onSubmitHandler = (values) => {
    setIsUpdated(true)

    //transform data
    let newData = cloneDeep(values)
    for (const datum in newData) {
      if (isObject(newData[datum]) && 'sectors' in newData[datum]) {
        newData[datum] = newData[datum].sectors.map((sector) => {
          return {
            sector_name: sector.split('-')[1],
            sector_id: sector.split('-')[0],
            visibility: newData[datum].visibility ? 1 : 0,
          }
        })
      } else if (isArray(newData[datum])) {
        newData[datum].map((val) => {
          val.visibility = val.visibility ? 1 : 0
          return val
        })
      }
    }

    console.log('values', newData)

    //continue here
  }

  return (
    <Formik
      initialValues={{
        first_name: basic_info[0].first_name,
        last_name: basic_info[0].last_name,
        socials: transformSocials(socials),
        phone: transformData(phone_numbers),
        email: transformData(emails),
        careerObjectives: transformData(career_objective),
        location: transformData(location),
        wanted_sectors: transformWantedSectors(wanted_sectors),
        graduation_project: graduation_project,
      }}
      enableReinitialize
      onSubmit={(values) => onSubmitHandler(values)}
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
                    <td>
                      <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>
                          Wanted Sectors
                        </label>
                        <Field
                          className={`${styles.inputField}`}
                          as='select'
                          rows={5}
                          id='wanted_sectors.sectors'
                          name='wanted_sectors.sectors'
                          multiple={true}
                        >
                          <option value='' selected>
                            Select wanted sectors
                          </option>
                          {sectors.map((s) => (
                            <option value={s.sector}>{s.sector_name}</option>
                          ))}
                        </Field>
                      </div>
                    </td>
                    <td className={styles.visibilityCheckboxContainer}>
                      <Field name='wanted_sectors.visibility'>
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
                        <span>Graduation Project</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>
                          Graduation Project
                        </label>
                        <Field
                          className={`${styles.inputField}`}
                          disabled
                          id='graduation_project[0].project_name'
                          name='graduation_project[0].project_name'
                        />
                      </div>
                    </td>
                    <td className={styles.visibilityCheckboxContainer}>
                      <Field name='graduation_project[0].visibility'>
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
                          onChange={(event) => {
                            props.setFieldValue('location[0]city', '')
                            props.setFieldValue('location[0]city_id', '')
                            props.setFieldValue('location[0]city_name', '')

                            props.setFieldValue(
                              'location[0]country_id',
                              event.target.value.split('-')[0]
                            )
                            props.setFieldValue(
                              'location[0]country_name',
                              event.target.value.split('-')[1]
                            )
                            props.setFieldValue(
                              'location[0]country',
                              event.target.value
                            )
                          }}
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
                          onChange={(event) => {
                            props.setFieldValue(
                              'location[0]city',
                              event.target.value
                            )
                            props.setFieldValue(
                              'location[0]city_id',
                              event.target.value.split('-')[0]
                            )
                            props.setFieldValue(
                              'location[0]city_name',
                              event.target.value.split('-')[1]
                            )
                          }}
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
                                          name={`socials[${index}]social`}
                                          id={`socials[${index}]social`}
                                          onChange={(event) => {
                                            const val = event.target.value
                                            props.setFieldValue(
                                              `socials[${index}]social`,
                                              val
                                            )
                                            props.setFieldValue(
                                              `socials[${index}]social_media_name`,
                                              val.split('-')[1]
                                            )
                                            props.setFieldValue(
                                              `socials[${index}]social_media_id`,
                                              val.split('-')[0]
                                            )
                                          }}
                                        >
                                          <option value='' disabled selected>
                                            Please select a Social Media Type
                                          </option>
                                          {socialMediaTypes.map((social) => (
                                            <option value={social.social}>
                                              {social.social_media_name}
                                            </option>
                                          ))}
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
