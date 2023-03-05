import { useContext, useState, useEffect } from 'react'
import { FieldArray, Field, Formik, Form } from 'formik'
import { cloneDeep, omit } from 'lodash'
import styles from './PersonalInformationForm.module.css'
import {
    EyeFill,
    EyeSlashFill,
    PlusCircleFill,
    XCircleFill,
} from 'react-bootstrap-icons'

import {Location_data} from '../../../../context/locationContext'
import {splitFields} from "../../../../helpers/formatHelpers";
import {createReqObject, submitChanges} from "../../../../helpers/fetchHelpers";
import {craftUserUrl} from "../../../../helpers/urlHelper";
import { fetchAllSectors, fetchAllSocialMediaTypes } from '../../../../helpers/searchHelpers'

const PersonalInformationForm = ({data}) => {
    const {locationData} = useContext(Location_data)
    const [sectors, setSectors] = useState([]);
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
                social_media: `${social.id}-${social.social_media_name}`,
              }
            })
        )
    )
  }, [])



    let deletedData = {socials: [], emails: [], phone_numbers: [], location: [], career_objective: [], wanted_sectors: []};

    const transformData = (data) => {
        let newData = cloneDeep(data);
        newData = newData.map((datum) => {
            datum.visibility = datum.visibility == 1
            return datum
        })
        return newData
    }

    const transformLocation = (location) => {
        const newLocation = [{city: "", country: ""}];
        if(location.length > 0){
            newLocation[0].city = `${location[0].city_id}-${location[0].city_name}`;
            newLocation[0].country = `${location[0].country_id}-${location[0].country_name}`;
        }
        return newLocation;
    }

    const transformWantedSectors = (data) => {
        const newData = {};
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
        social_media: `${datum.social_media_id}-${datum.social_media_name}`,
      }
    })
  }

    const onSubmit = async (values) => {
        console.log("data")
        console.log(data);

        let newData = cloneDeep(values)

        newData.socials = newData.socials.map((val) => {
            val.visibility = val.visibility ? 1 : 0;
            splitFields(val, ["social_media"]);
            return val;
        });

        newData.phone_numbers = newData.phone_numbers.map((val) => {
            val.visibility = val.visibility ? 1 : 0;
            return val;
        });

        newData.emails = newData.emails.map((val) => {
            val.visibility = val.visibility ? 1 : 0;
            return val;
        });

        if (newData.location.length > 0) {
            if (newData.location[0].country = "")
                newData.location = [];
            else {
                newData.location[0].visibility = newData.location[0].visibility ? 1 : 0;
                ["country", "city"].forEach((field)=>{
                    if(newData.location[0].hasOwnProperty(field))
                        delete newData.location[0][field];
                });
            }
        }
        if (data.location.length > newData.location.length)
            deletedData.location.push({name: data.location[0].id, id: data.location[0].id});

        if (newData.career_objective.length > 0) {
            if (newData.career_objective[0].career_objective == "")
                newData.career_objective = [];
            else newData.career_objective[0].visibility = newData.career_objective[0].visibility ? 1 : 0;
        }
        if (data.career_objective.length > newData.career_objective.length)
            deletedData.career_objective.push({name: data.career_objective[0].id, id: data.career_objective[0].id});

        const sectors = [];
        if(newData.wanted_sectors.sectors.length > 0){
            const sector_visibility = newData.wanted_sectors.visibility ? 1 : 0;
            newData.wanted_sectors.sectors.forEach((sector)=>{
                const split = sector.split("-");
                sectors.push({sector_id: parseInt(split[0]), sector_name: split[1], visibility: sector_visibility});
            });
        }
        newData.wanted_sectors = sectors;
        let is_found;
        data.wanted_sectors.forEach((sector)=>{
                is_found = newData.wanted_sectors.find((s, i) => {
                if(s.sector_name == sector.sector_name) {
                    newData.wanted_sectors[i].id = sector.id;
                    return true;
                }
            });
            if(is_found == undefined)
                deletedData.wanted_sectors.push({name: sector.id, id: sector.id});
        });

        console.log("deletedData");
        console.log(deletedData);

        console.log("newData")
        console.log(newData);

        let responseObjArr = [];

        await Promise.all(Object.keys(omit(data, ["basic_info"])).map(async (key) => {
            const requestObj = createReqObject(data[key], newData[key], deletedData[key]);
            console.log(key)
            //console.log("heres the req obj")
            console.log(requestObj);
            const url = craftUserUrl(1, key);
            const responseObj = await submitChanges(url ,requestObj);
            //responseObjArr.push(responseObj);
        }));

        console.log(responseObjArr)
        deletedData = [];
    }

    const {
        basic_info,
        socials,
        phone_numbers,
        emails,
        career_objective,
        location,
        wanted_sectors
    } = data

    return (
        <Formik
            initialValues={{
                first_name: basic_info[0].first_name,
                last_name: basic_info[0].last_name,
                socials: transformSocials(socials),
                phone_numbers: transformData(phone_numbers),
                emails: transformData(emails),
                career_objective: transformData(career_objective),
                location: transformLocation(location),
                wanted_sectors: transformWantedSectors(wanted_sectors)
            }}
            enableReinitialize
            onSubmit={onSubmit}
        >
            {(props) => {
                return (
                    <>
                        <Form>
                            <table style={{width: '100%'}}>
                                <tbody>
                                <tr>
                                    <td>
                                        <div className={`${styles.inputContainer}`}>
                                            <label className={`${styles.inputLabel}`}>
                                                First Name
                                            </label>
                                            <Field
                                                className={`${styles.inputField}`}
                                                style={{width: '100%'}}
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
                                                id='career_objective[0].career_objective'
                                                name='career_objective[0].career_objective'
                                                placeholder='Enter your career objectives...'
                                            />
                                        </div>
                                    </td>
                                    <td className={styles.visibilityCheckboxContainer}>
                                        <Field name='career_objective[0].visibility'>
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
                                <tr>
                                    <td>
                                        <div className={`${styles.inputContainer}`}>
                                            <label className={`${styles.inputLabel}`}>
                                                Sectors I want to work in
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
                                                    None
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
                                            {({field, form, meta}) => {
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
                                                            style={{display: 'none'}}
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
                                                                onClick={() =>{
                                                                    arrayHelpers.remove(index);
                                                                    if (social.hasOwnProperty("id"))
                                                                        deletedData.socials.push({
                                                                            name: social.id,
                                                                            id: social.id
                                                                        });
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
                                                                  name={`socials[${index}]social_media`}
                                                                  id={`socials[${index}]social_media`}
                                                                  onChange={(event) => {
                                                                    const val = event.target.value
                                                                    props.setFieldValue(
                                                                        `socials[${index}]social_media`,
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
                                                                    <option value={social.social_media}>
                                                                      {social.social_media_name}
                                                                    </option>
                                                                ))}
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
                                    name='phone_numbers'
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
                                                            <PlusCircleFill size={20}/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {props.values.phone_numbers && props.values.phone_numbers.length > 0 ? (
                                                props.values.phone_numbers.map((p, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <div style={{display: 'flex'}}>
                                                                    <div className={styles.removeBtnContainer}>
                                                                        <button
                                                                            className={styles.removeBtn}
                                                                            type='button'
                                                                            onClick={() => {
                                                                                arrayHelpers.remove(index);
                                                                                if (p.hasOwnProperty("id"))
                                                                                    deletedData.phone_numbers.push({
                                                                                        name: p.id,
                                                                                        id: p.id
                                                                                    });
                                                                            }}
                                                                        >
                                                                            <XCircleFill
                                                                                size={13}
                                                                                className={styles.removeIcon}
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                    <div style={{flexGrow: '1'}}>
                                                                        <div className={styles.inputContainer}>
                                                                            <label className={styles.inputLabel}>
                                                                                Phone Number
                                                                            </label>
                                                                            <Field
                                                                                className={styles.inputField}
                                                                                name={`phone_numbers[${index}]phone_number`}
                                                                                id={`phone_numbers[${index}]phone_number`}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td
                                                                className={styles.visibilityCheckboxContainer}
                                                            >
                                                                <Field name={`phone_numbers[${index}]visibility`}>
                                                                    {({field, form, meta}) => {
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
                                                                                    style={{display: 'none'}}
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
                                    name='emails'
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
                                                            <PlusCircleFill size={20}/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {props.values.emails && props.values.emails.length > 0 ? (
                                                props.values.emails.map((e, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <div style={{display: 'flex'}}>
                                                                    <div className={styles.removeBtnContainer}>
                                                                        <button
                                                                            className={styles.removeBtn}
                                                                            type='button'
                                                                            onClick={() => {
                                                                                arrayHelpers.remove(index);
                                                                                if (e.hasOwnProperty("id"))
                                                                                    deletedData.emails.push({
                                                                                        name: e.id,
                                                                                        id: e.id
                                                                                    });
                                                                            }}
                                                                        >
                                                                            <XCircleFill
                                                                                size={13}
                                                                                className={styles.removeIcon}
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                    <div style={{flexGrow: '1'}}>
                                                                        <div className={styles.inputContainer}>
                                                                            <label className={styles.inputLabel}>
                                                                                Email
                                                                            </label>
                                                                            <Field
                                                                                className={styles.inputField}
                                                                                name={`emails[${index}]email_address`}
                                                                                id={`emails[${index}]email_address`}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td
                                                                className={styles.visibilityCheckboxContainer}
                                                            >
                                                                <Field name={`emails[${index}]visibility`}>
                                                                    {({field, form, meta}) => {
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
                                                                                    style={{display: 'none'}}
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
