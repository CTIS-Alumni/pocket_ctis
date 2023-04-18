import { useState, useEffect } from 'react'
import { FieldArray, Field, Formik, Form } from 'formik'
import { cloneDeep } from 'lodash'
import styles from './AdminUserFormStyles.module.css'
import { PlusCircleFill, XCircleFill } from 'react-bootstrap-icons'

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
import { craftUrl, craftUserUrl } from '../../../../helpers/urlHelper'

const ContactInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [socialMediaTypes, setSocialMediaTypes] = useState([])

  useEffect(() => {
    _getFetcher({ socials: craftUrl('socialmedia') }).then(({ socials }) =>
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

  const transformSocials = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.social_media = `${datum.social_media_id}-${datum.social_media_name}`
      return datum
    })
    return newData
  }

  const transformEmails = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.is_default = datum.is_default == 1
      return datum
    })
    return newData
  }

  const onSubmitHandler = (values) => {
    console.log(values)

    //after submission
    setIsUpdated(true)
  }

  return (
    <Formik
      initialValues={{
        phone_numbers: data.phone_numbers,
        emails: transformEmails(data.emails),
        socials: transformSocials(data.socials),
      }}
      enableReinitialize
      onSubmit={onSubmitHandler}
    >
      {(props) => {
        return (
          <Form>
            <table style={{ width: '100%' }}>
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
                              onClick={() =>
                                arrayHelpers.insert(0, { email_address: '' })
                              } // insert an empty string at a position
                            >
                              <PlusCircleFill size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {props.values.emails && props.values.emails.length > 0 ? (
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
        )
      }}
    </Formik>
  )
}

export default ContactInformationForm
