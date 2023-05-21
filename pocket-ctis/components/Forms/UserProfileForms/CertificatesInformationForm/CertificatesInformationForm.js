import styles from '../UserProfileFormStyles.module.css'
import {
  EyeFill,
  EyeSlashFill,
  XCircleFill,
  PlusCircleFill,
} from 'react-bootstrap-icons'
import { Formik, Field, Form, FieldArray } from 'formik'
import { cloneDeep } from 'lodash'
import { createReqObject } from '../../../../helpers/fetchHelpers'
import { submitChanges } from '../../../../helpers/fetchHelpers'
import { craftUrl } from '../../../../helpers/urlHelper'
import { useState } from 'react'
import {
  replaceWithNull,
  handleResponse,
} from '../../../../helpers/submissionHelpers'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'

const CertificatesInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)
  const [isLoading, setIsLoading] = useState(true)

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

  let deletedData = []

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      replaceWithNull(datum)
      datum.visibility = datum.visibility == 1
      return datum
    })

    return newData
  }

  const transformDataForSubmission = (newData) => {
    newData.certificates = newData.certificates.map((val) => {
      val.visibility = val.visibility ? 1 : 0
      val.certificate_name = val.certificate_name ? val.certificate_name : null
      val.issuing_authority = val.issuing_authority
        ? val.issuing_authority
        : null
      replaceWithNull(val)
      return val
    })
  }

  const url = craftUrl(['users', user_id, 'certificates'])
  const args = [[], [], ['id', 'user_id'], []]

  const onSubmit = async (values) => {
    setIsLoading(true)
    setIsUpdated(true)
    let newData = cloneDeep(values)
    transformDataForSubmission(newData)

    const send_to_req = { certificates: cloneDeep(dataAfterSubmit) }
    transformDataForSubmission(send_to_req)
    const requestObj = createReqObject(
      send_to_req.certificates,
      newData.certificates,
      deletedData
    )
    const url = craftUrl(['users', user_id, 'certificates'])

    const responseObj = await submitChanges(url, requestObj)

    const new_data = handleResponse(
      send_to_req.certificates,
      requestObj,
      responseObj,
      values,
      'certificates',
      args,
      transformDataForSubmission
    )
    applyNewData(new_data)
    let errors = []
    for (const [key, value] of Object.entries(responseObj)) {
      if (value.errors?.length > 0) {
        errors = [...errors, ...value.errors.map((error) => error)]
      }
    }

    if (errors.length > 0) {
      errors.forEach((errorInfo) => {
        toast.error(errorInfo.error)
      })
    } else if (
      responseObj.POST.data ||
      responseObj.PUT.data ||
      responseObj.DELETE.data
    ) {
      toast.success('Data successfully saved')
    }

    setIsLoading(false)
    deletedData = []
  }

  return (
    <div style={{ position: 'relative' }}>
      <Formik
        enableReinitialize
        initialValues={{ certificates: transformData(data) }}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form>
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
                              <span>Certificates & Awards</span>
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
                          props.values.certificates.map(
                            (certificate, index) => {
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
                                            onClick={() => {
                                              arrayHelpers.remove(index)
                                              if (
                                                certificate.hasOwnProperty('id')
                                              )
                                                deletedData.push({
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
                                          <div
                                            className={styles.inputContainer}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Certificate Name
                                            </label>
                                            <Field
                                              className={styles.inputField}
                                              id={`certificates[${index}]certificate_name`}
                                              name={`certificates[${index}]certificate_name`}
                                            />
                                          </div>
                                          <div
                                            className={styles.inputContainer}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
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
                                    <td
                                      className={
                                        styles.visibilityCheckboxContainer
                                      }
                                    >
                                      <Field
                                        name={`certificates[${index}]visibility`}
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
                                  {props.values.certificates.length - 1 >
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
                            <td>
                              <button
                                className={styles.bigAddBtn}
                                type='button'
                                onClick={() =>
                                  arrayHelpers.push({
                                    certificate_name: '',
                                    issuing_authority: '',
                                  })
                                }
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
    </div>
  )
}

export default CertificatesInformationForm
