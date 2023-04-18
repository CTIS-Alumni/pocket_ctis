import { useState, useContext, useEffect } from 'react'
import { Location_data } from '../../../../context/locationContext'
import { Field, Formik, Form } from 'formik'
import styles from './AdminUserFormStyles.module.css'
import Select from 'react-select'
import { _getFetcher } from '../../../../helpers/fetchHelpers'
import { craftUrl } from '../../../../helpers/urlHelper'
import { XCircleFill } from 'react-bootstrap-icons'
import { cloneDeep } from 'lodash'

const PersonalInformationForm = ({ data, user_id, setIsUpdated }) => {
  const { locationData } = useContext(Location_data)
  const [sectors, setSectors] = useState([])
  const [highSchools, setHighSchools] = useState([])

  useEffect(() => {
    _getFetcher({ sectors: craftUrl('sectors') }).then(({ sectors }) =>
      setSectors(
        sectors.data.map((datum) => {
          return {
            value: `${datum.id}-${datum.sector_name}`,
            label: datum.sector_name,
          }
        })
      )
    )
    _getFetcher({ high_school: craftUrl('highschools') }).then(
      ({ high_school }) => setHighSchools(high_school.data)
    )
  }, [])

  const transformLocation = (location) => {
    const newData = cloneDeep(location)
    if (location.length > 0) {
      newData[0].country = `${location[0].country_id}-${location[0].country_name}`
      newData[0].city = `${location[0].city_id}-${location[0].city_name}`
    }
    return newData
  }

  const transformHighSchool = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.high_school = `${datum.high_school_id}-${datum.high_school_name}`
      return datum
    })
    return newData
  }

  const transformWantedSectors = (data) => {
    const newData = {}
    newData.sectors = data.map((sector) => {
      return {
        value: `${sector.sector_id}-${sector.sector_name}`,
        label: sector.sector_name,
      }
    })
    newData.visibility = data[0].visibility
    return newData
  }

  const onSubmitHandler = (values) => {
    console.log(values)

    //after submission
    setIsUpdated(true)
  }

  return (
    <Formik
      enableReinitialize
      onSubmit={onSubmitHandler}
      initialValues={{
        first_name: data.basic_info[0].first_name,
        last_name: data.basic_info[0].last_name,
        career_objective: data.career_objective,
        location: transformLocation(data.location),
        wanted_sectors: transformWantedSectors(data.wanted_sectors),
        high_school: transformHighSchool(data.high_school),
      }}
    >
      {(props) => {
        return (
          <Form>
            <table className={styles.formTable}>
              <tr>
                <td>
                  <div className={`${styles.inputContainer}`}>
                    <label className={`${styles.inputLabel}`}>First Name</label>
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
                    <label className={`${styles.inputLabel}`}>last Name</label>
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
                      id='career_objective[0].career_objective'
                      name='career_objective[0].career_objective'
                      placeholder='Enter your career objectives...'
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className={`${styles.inputContainer}`}>
                    <label
                      className={`${styles.inputLabel}`}
                      style={{ zIndex: 1 }}
                    >
                      Wanted Sectors
                    </label>
                    <Select
                      isMulti
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: 'rgb(245, 164, 37)',
                        }),
                      }}
                      isClearable={true}
                      isSearchable={true}
                      name='wanted_sectors.sectors'
                      options={sectors}
                      onChange={(values) => {
                        console.log(values)
                        props.setFieldValue(
                          'wanted_sectors.sectors',
                          values.map((datum) => {
                            return {
                              value: datum.value,
                              label: datum.label,
                            }
                          })
                        )
                      }}
                      value={props.values.wanted_sectors.sectors}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: 'flex' }}>
                    <div className={styles.removeBtnContainer}>
                      <button
                        className={styles.removeBtn}
                        type='button'
                        onClick={() => {
                          if (props.values.high_school[0])
                            props.setFieldValue(
                              `high_school[0].high_school`,
                              ''
                            )
                        }}
                      >
                        <XCircleFill size={13} className={styles.removeIcon} />
                      </button>
                    </div>
                    <div style={{ flexGrow: '1' }}>
                      <div className={styles.inputContainer}>
                        <label className={styles.inputLabel}>High School</label>
                        <Field
                          as='select'
                          name='high_school[0].high_school'
                          id='high_school[0].high_school'
                          className={styles.inputField}
                        >
                          <option selected value='' disabled>
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
                    </div>
                  </div>
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
                  <div style={{ display: 'flex' }}>
                    <div className={styles.removeBtnContainer}>
                      <button
                        className={styles.removeBtn}
                        type='button'
                        onClick={() => {
                          if (props.values.location[0]) {
                            props.setFieldValue(`location[0].country`, '')
                            props.setFieldValue(`location[0].city`, '')
                          }
                        }}
                      >
                        <XCircleFill size={13} className={styles.removeIcon} />
                      </button>
                    </div>
                    <div style={{ flexGrow: '1' }}>
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
                            props.setFieldValue(
                              'location[0]country',
                              event.target.value
                            )
                          }}
                        >
                          <option selected disabled value=''>
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
                    </div>
                  </div>
                </td>
              </tr>
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

export default PersonalInformationForm
