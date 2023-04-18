import { useState } from 'react'

import styles from './AdminUserFormStyles.module.css'

import { XCircleFill, PlusCircleFill } from 'react-bootstrap-icons'
import { Formik, Field, Form, FieldArray } from 'formik'

import { cloneDeep } from 'lodash'
import { replaceWithNull } from '../../../../helpers/submissionHelpers'

const CertificatesInformationForm = ({ data, user_id, setIsUpdated }) => {
  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      replaceWithNull(datum)
      datum.visibility = datum.visibility == 1
      return datum
    })

    return newData
  }

  const onSubmitHandler = (values) => {
    console.log(values)

    //after form submission
    setIsUpdated(true)
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ certificates: transformData(data) }}
      onSubmit={onSubmitHandler}
    >
      {(props) => (
        <Form>
          <table style={{ width: '100%' }}>
            <tbody>
              <FieldArray
                name='certificates'
                render={(arrayHelpers) => {
                  return (
                    <>
                      <tr>
                        <td colSpan={3}>
                          <div
                            className={styles.formPartitionHeading}
                            style={{ marginTop: 0 }}
                          >
                            <span>Certificates</span>
                            <button
                              className={styles.addButton}
                              type='button'
                              onClick={() =>
                                arrayHelpers.insert(0, {
                                  certificate_name: '',
                                  issuing_authority: '',
                                })
                              }
                            >
                              <PlusCircleFill size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {props.values.certificates &&
                      props.values.certificates.length > 0 ? (
                        props.values.certificates.map((certificate, index) => {
                          return (
                            <>
                              <tr key={index} style={{ width: '100%' }}>
                                <td>
                                  <div style={{ display: 'flex' }}>
                                    <div className={styles.removeBtnContainer}>
                                      <button
                                        className={styles.removeBtn}
                                        type='button'
                                        onClick={() => {
                                          arrayHelpers.remove(index)
                                          if (certificate.hasOwnProperty('id'))
                                            deletedData.push({
                                              name: certificate.certificate_name,
                                              id: certificate.id,
                                              data: certificate,
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
                                          Certificate Name
                                        </label>
                                        <Field
                                          className={styles.inputField}
                                          id={`certificates[${index}]certificate_name`}
                                          name={`certificates[${index}]certificate_name`}
                                        />
                                      </div>
                                      <div className={styles.inputContainer}>
                                        <label className={styles.inputLabel}>
                                          Issuing Authority
                                        </label>
                                        <Field
                                          className={styles.inputField}
                                          id={`certificates[${index}]issuing_authority`}
                                          name={`certificates[${index}]issuing_authority`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              {/* shows spaver only between records */}
                              {props.values.certificates.length - 1 > index && (
                                <tr className={styles.spacer}>
                                  <td />
                                </tr>
                              )}
                            </>
                          )
                        })
                      ) : (
                        <tr>
                          <td>
                            <button
                              className={styles.bigAddBtn}
                              type='button'
                              onClick={() => arrayHelpers.push('')}
                            >
                              Add a Certificate
                            </button>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                }}
              />
            </tbody>
          </table>
          <div>
            <button type='submit' className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default CertificatesInformationForm
