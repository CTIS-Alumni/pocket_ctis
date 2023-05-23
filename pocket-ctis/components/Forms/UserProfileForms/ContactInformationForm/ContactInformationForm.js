import { useEffect, useState } from 'react'
import { FieldArray, Field, Formik, Form } from 'formik'
import { cloneDeep } from 'lodash'
import styles from '../UserProfileFormStyles.module.css'
import {
  EyeFill,
  EyeSlashFill,
  PlusCircleFill,
  XCircleFill,
} from 'react-bootstrap-icons'

import {
  replaceWithNull,
  splitFields,
  handleResponse,
} from '../../../../helpers/submissionHelpers'
import {
  _getFetcher,
  createReqObject,
  submitChanges,
} from '../../../../helpers/fetchHelpers'
import { craftUrl} from '../../../../helpers/urlHelper'
import {toast} from "react-toastify";
import {Spinner} from "react-bootstrap";

const ContactInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)
  const [socialMediaTypes, setSocialMediaTypes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    _getFetcher({ socials: craftUrl(['socialmedia']) }).then(({ socials }) =>
        setSocialMediaTypes(
            socials.data.map((social) => {
              return {
                ...social,
                social_media: `${social.id}-${social.social_media_name}`,
              }
            })
        )
    )
  }, [])

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

  let deletedData = { phone_numbers: [], emails: [], socials: [] }

  const transformSocials = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      datum.social_media = `${datum.social_media_id}-${datum.social_media_name}`
      return datum
    })
    return newData
  }

  const transformPhones = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      return datum
    })
    return newData
  }

  const transformEmails = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      return datum
    })
    return newData
  }

  const transformFuncs = {
    emails: (newData) => {
      newData.emails = newData.emails.map((val) => {
        val.visibility = val.visibility ? 1 : 0
        val.email_address = val.email_address ? val.email_address : null
        replaceWithNull(val)
        return val
      })
    },
    socials: (newData) => {
      newData.socials = newData.socials.map((val) => {
        val.visibility = val.visibility ? 1 : 0
        val.link = val.link ? val.link : null
        splitFields(val, ['social_media'])
        replaceWithNull(val)
        return val
      })
    },
    phone_numbers: (newData) => {
      newData.phone_numbers = newData.phone_numbers.map((val) => {
        val.visibility = val.visibility ? 1 : 0
        val.phone_number = val.phone_number ? val.phone_number : null
        replaceWithNull(val)
        return val
      })
    },
  }

  const args = {
    phone_numbers: [[], [], ['id', 'user_id'], []],
    emails: [[], [], ['id', 'user_id'], []],
    socials: [['social_media'], [], ['id', 'user_id'], []],
  }

  const onSubmit = async (values) => {
    setIsUpdated(true)
    setIsLoading(true)
    let newData = cloneDeep(values)
    transformFuncs.phone_numbers(newData)
    transformFuncs.emails(newData)
    transformFuncs.socials(newData)

    let responseObj = {
      phone_numbers: {},
      emails: {},
      socials: {},
    }

    let requestObj = {
      phone_numbers: {},
      emails: {},
      socials: {},
    }

    const final_data = { phone_numbers: [], emails: [], socials: [] }

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
          const url = craftUrl(['users', user_id, key])
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
    deletedData = { phone_numbers: [], emails: [], socials: [] }

    let errors = []
    Object.keys(deletedData).forEach((obj) => {
      for (const [key, value] of Object.entries(responseObj[obj])) {
        if (value.errors?.length > 0) {
          errors = [...errors, ...value.errors.map((error) => error)]
        }
      }
    })

    if (errors.length > 0) {
      errors.forEach((errorInfo) => {
        toast.error(errorInfo.error)
      })
    } else toast.success('Data successfully saved')
    setIsLoading(false)
  }

  const { phone_numbers, emails, socials } = data

  return (
    <Formik
      initialValues={{
        phone_numbers: transformPhones(phone_numbers),
        emails: transformEmails(emails),
        socials: transformSocials(socials),
      }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(props) => {
        return (
          <>
            <Form style={{ position: 'relative' }}>
              {isLoading && (
                  <div
                      style={{
                        zIndex: 2,
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        background: '#ccc',
                        opacity: '0.5',
                      }}
                  >
                    <Spinner />
                  </div>
              )}
              <table className={styles.formTable}>
                <tbody>
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
                                onClick={() =>
                                  arrayHelpers.insert(0, {
                                    social_media: '',
                                    link: '',
                                  })
                                } // insert an empty string at a position
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
                                            onClick={() => {
                                              arrayHelpers.remove(index)
                                              if (social.hasOwnProperty('id'))
                                                deletedData.socials.push({
                                                  name: social.id,
                                                  id: social.id,
                                                  data: social,
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
                                            Please select a Social Media Website
                                          </option>
                                          {socialMediaTypes.map((social, idx) => (
                                            <option key={idx} value={social.social_media}>
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
                              onClick={() =>
                                  arrayHelpers.push({ social_media: '', link: '' })
                              }
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
                                onClick={() =>
                                    arrayHelpers.insert(0, { phone_number: '' })
                                } // insert an empty string at a position
                              >
                                <PlusCircleFill size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {props.values.phone_numbers &&
                        props.values.phone_numbers.length > 0 ? (
                          props.values.phone_numbers.map((p, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div style={{ display: 'flex' }}>
                                    <div className={styles.removeBtnContainer}>
                                      <button
                                        className={styles.removeBtn}
                                        type='button'
                                        onClick={() => {
                                          arrayHelpers.remove(index)
                                          if (p.hasOwnProperty('id'))
                                            deletedData.phone_numbers.push({
                                              name: p.id,
                                              id: p.id,
                                              data: p,
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
                                  <Field
                                    name={`phone_numbers[${index}]visibility`}
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
                            )
                          })
                        ) : (
                          <tr>
                            <button
                              className={styles.bigAddBtn}
                              type='button'
                              onClick={() =>
                                  arrayHelpers.push({ phone_number: '' })
                              }
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
                                onClick={() =>
                                    arrayHelpers.insert(0, { email_address: '' })
                                } // insert an empty string at a position
                              >
                                <PlusCircleFill size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {props.values.emails &&
                        props.values.emails.length > 0 ? (
                          props.values.emails.map((e, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div style={{ display: 'flex' }}>
                                    <div className={styles.removeBtnContainer}>
                                      <button
                                        className={styles.removeBtn}
                                        type='button'
                                        onClick={() => {
                                          arrayHelpers.remove(index)
                                          if (e.hasOwnProperty('id'))
                                            deletedData.emails.push({
                                              name: e.id,
                                              id: e.id,
                                              data: e,
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
                              onClick={() =>
                                  arrayHelpers.push({ email_address: '' })
                              }
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

export default ContactInformationForm
