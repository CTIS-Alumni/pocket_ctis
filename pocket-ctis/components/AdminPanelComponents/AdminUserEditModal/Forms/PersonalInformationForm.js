import { useState, useContext, useEffect } from 'react'
import { Location_data } from '../../../../context/locationContext'

import { Field, Formik, Form } from 'formik'
import { XCircleFill } from 'react-bootstrap-icons'
import Select from 'react-select'

import styles from './AdminUserFormStyles.module.css'

import {_getFetcher, createReqObject, submitChanges} from '../../../../helpers/fetchHelpers'
import {craftUrl} from '../../../../helpers/urlHelper'
import { cloneDeep } from 'lodash'
import {handleResponse, replaceWithNull, splitFields} from "../../../../helpers/submissionHelpers";
import {toast} from "react-toastify";

const PersonalInformationForm = ({ data, user_id, setIsUpdated }) => {
  const { locationData } = useContext(Location_data)
  const [sectors, setSectors] = useState([])
  const [highSchools, setHighSchools] = useState([])
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)

  useEffect(() => {
    _getFetcher({ sectors: craftUrl(['sectors']) }).then(({ sectors }) =>
      setSectors(
        sectors.data.map((datum) => {
          return {
            value: `${datum.id}-${datum.sector_name}`,
            label: datum.sector_name,
          }
        })
      )
    )
    _getFetcher({ high_school: craftUrl(['highschools']) }).then(
      ({ high_school }) => setHighSchools(high_school.data)
    )
  }, [])

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

  let deletedData = {
    location: [],
    career_objective: [],
    high_school: [],
    wanted_sectors: [],
    basic_info: []
  }

  const transformLocation = (location) => {
    const newData = cloneDeep(location)
    if (location.length > 0) {
      newData[0].country = `${location[0].country_id}-${location[0].country_name}`
      newData[0].city = `${location[0].city_id}-${location[0].city_name}`
      newData[0].visibility = newData[0].visibility == 1
    }
    return newData
  }

  const transformHighSchool = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.high_school = `${datum.high_school_id}-${datum.high_school_name}`
      datum.visibility = datum.visibility == 1
      return datum
    })
    return newData
  }

  const transformCareer = (career) => {
    const newData = cloneDeep(career)
    if(career.length > 0){
      newData[0].visibility = newData[0].visibility == 1
    }
    return newData
  }

  const transformWantedSectors = (data) => {
    const newData = {}
    newData.sectors = data.map((sector) => {
      return {
        value: `${sector.sector_id}-${sector.sector_name}`,
        label: sector.sector_name,
        id: sector.id
      }
    })
    if(newData.sectors.length > 0)
      newData.visibility = data[0].visibility
    return newData
  }

  const transformFuncs = {
    career_objective: (newData) => {
      if (newData.career_objective.length > 0) {
        if (newData.career_objective[0].career_objective.trim() == '') {
          newData.career_objective = []
        } else
          newData.career_objective[0].visibility = newData.career_objective[0]
              .visibility
              ? 1
              : 0
      }
    },
    high_school: (newData) => {
      if (newData.high_school.length > 0) {
        if (newData.high_school[0].high_school == '') newData.high_school = []
        else {
          newData.high_school[0].visibility = newData.high_school[0].visibility
              ? 1
              : 0
          splitFields(newData.high_school[0], ['high_school'])
        }
      }
    },
    location: (newData) => {
      if (newData.location.length > 0) {
        if (newData.location[0].country == '') newData.location = []
        else {
          newData.location[0].visibility = newData.location[0].visibility
              ? 1
              : 0
          replaceWithNull(newData.location[0])
          splitFields(newData.location[0], ['country', 'city'])
        }
      }
    },
    wanted_sectors: (newData) => {
      if (newData.wanted_sectors.length > 0) {
        newData.wanted_sectors = newData.wanted_sectors.map((val) => {
          splitFields(val, ["sector"]);
          val.visibility = val.visibility ? 1 : 0
          return val;
        })
      }
    },
    basic_info: (newData) => {
      //nothing here
    }
  }

  const args = {
    location: [['country', 'city'], [], ['id', 'user_id'], []],
    career_objective: [[], [], ['id', 'user_id'], []],
    high_school: [['high_school'], [], ['user_id', 'id'], []],
    wanted_sectors: [['sector'], [], ['user_id', 'id'], []],
    basic_info: [[], [], ['user_id', 'id'], []]
  }

  const onSubmit = async (values) => {
    setIsUpdated(true)
    var wanted_sectors = values.wanted_sectors.sectors.map((sector) => {
      const [id, name] = sector.value.split('-')
      let newSector = {
        sector: sector.value,
        sector_id: id,
        sector_name: name,
        visibility: values.wanted_sectors.visibility,
      }
      if(sector.id)
        newSector.id = sector.id
      return newSector
    })
    values.wanted_sectors = wanted_sectors

    let newData = cloneDeep(values)

    transformFuncs.location(newData)
    if (
        dataAfterSubmit.location.length > newData.location.length &&
        dataAfterSubmit.location[0].id != ''
    ) {
      deletedData.location.push({
        name: dataAfterSubmit.location[0].id,
        id: dataAfterSubmit.location[0].id,
        data: dataAfterSubmit.location[0],
      })
      values.location = []
    }

    transformFuncs.high_school(newData)
    if (
        dataAfterSubmit.high_school.length > newData.high_school.length &&
        dataAfterSubmit.high_school[0].id
    ) {
      deletedData.high_school.push({
        name: dataAfterSubmit.high_school[0].id,
        id: dataAfterSubmit.high_school[0].id,
        data: dataAfterSubmit.high_school[0],
      })
      values.high_school = []
    }

    transformFuncs.career_objective(newData)
    if (
        dataAfterSubmit.career_objective.length >
        newData.career_objective.length &&
        dataAfterSubmit.career_objective[0].id
    ) {
      deletedData.career_objective.push({
        name: dataAfterSubmit.career_objective[0].id,
        id: dataAfterSubmit.career_objective[0].id,
        data: dataAfterSubmit.career_objective[0],
      })
      values.career_objective = []
    }

    transformFuncs.wanted_sectors(newData);
    dataAfterSubmit.wanted_sectors.forEach((submittedSector)=>{
      const is_found =  newData.wanted_sectors.find(datum => {
        return datum.id === submittedSector.id
      })
      if(is_found === undefined)
        deletedData.wanted_sectors.push({
          name: submittedSector.sector_id,
          id: submittedSector.id,
          data: submittedSector,
        })
    })


    let requestObj = {
      location: {},
      career_objective: {},
      high_school: {},
      wanted_sectors: {},
      basic_info: {}
    }
    let responseObj = {
      location: {},
      career_objective: {},
      high_school: {},
      wanted_sectors: {},
      basic_info: {}
    }

    const final_data = { location: [], career_objective: [], high_school: [] , wanted_sectors: [], basic_info: []}
    await Promise.all(
        Object.keys(dataAfterSubmit).map(async (key) => {
          const send_to_req = {}
          send_to_req[key] = cloneDeep(dataAfterSubmit[key])
          transformFuncs[key](send_to_req)
          requestObj[key] = createReqObject(
              send_to_req[key],
              newData[key],
              deletedData[key]
          )
          const url = craftUrl(["users",user_id, key])
          responseObj[key] = await submitChanges(url, requestObj[key])
          final_data[key] = handleResponse(
              send_to_req[key],
              requestObj[key],
              responseObj[key],
              values,
              key,
              args[key],
              transformFuncs[key]
          )
        })
    )

    applyNewData(final_data)
    console.log('req', requestObj, 'res', responseObj)
    values.wanted_sectors = transformWantedSectors(values.wanted_sectors)

    deletedData = {
      location: [],
      career_objective: [],
      high_school: [],
      wanted_sectors: [],
      basic_info: []
    }

    let errors = []
    Object.keys(deletedData).forEach((obj) => {
      for (const [key, value] of Object.entries(responseObj[obj])) {
        if (value.errors?.length > 0) {
          errors = [...errors, ...value.errors.map((error) => error)]
        }
      }
    });

    if (errors.length > 0) {
      errors.forEach((errorInfo) => {
        toast.error(errorInfo.error)
      })
    } else toast.success('Data successfully saved')


  }

  const {
    basic_info,
    career_objective,
    location,
    wanted_sectors,
    high_school,
  } = data

  return (
    <Formik
      enableReinitialize
      onSubmit={onSubmit}
      initialValues={{
        basic_info: basic_info,
        career_objective: transformCareer(career_objective),
        location: transformLocation(location),
        wanted_sectors: transformWantedSectors(wanted_sectors),
        high_school: transformHighSchool(high_school),
      }}
    >
      {(props) => {
        return (
          <Form>
            <table className={styles.formTable}>
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
                        id='basic_info[0].first_name'
                        name='basic_info[0].first_name'
                        placeholder='First Name'
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className={`${styles.inputContainer}`}>
                      <label className={`${styles.inputLabel}`}>
                        Nee
                      </label>
                      <Field
                          className={`${styles.inputField}`}
                          style={{ width: '100%' }}
                          id='basic_info[0].nee'
                          name='basic_info[0].nee'
                          placeholder='Nee'
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
                        id='basic_info[0].last_name'
                        name='basic_info[0].last_name'
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
                          props.setFieldValue(
                            'wanted_sectors.sectors',
                            values.map((datum) => {
                              return {
                                value: datum.value,
                                label: datum.label,
                                id: datum.id
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
                          <XCircleFill
                            size={13}
                            className={styles.removeIcon}
                          />
                        </button>
                      </div>
                      <div style={{ flexGrow: '1' }}>
                        <div className={styles.inputContainer}>
                          <label
                            className={styles.inputLabel}
                            style={{ zIndex: 0 }}
                          >
                            High School
                          </label>
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
                          <XCircleFill
                            size={13}
                            className={styles.removeIcon}
                          />
                        </button>
                      </div>
                      <div style={{ flexGrow: '1' }}>
                        <div className={`${styles.inputContainer}`}>
                          <label
                            className={`${styles.inputLabel}`}
                            style={{ zIndex: 0 }}
                          >
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
                          <label
                            className={`${styles.inputLabel}`}
                            style={{ zIndex: 0 }}
                          >
                            City
                          </label>
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
                            {locationData[
                              props.values.location[0]?.country
                            ]?.map((city) => {
                              let cityName = city.split('-')[1]
                              return <option value={city}>{cityName}</option>
                            })}
                          </Field>
                        </div>
                      </div>
                    </div>
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
        )
      }}
    </Formik>
  )
}

export default PersonalInformationForm
