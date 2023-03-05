import styles from '../UserProfileFormStyles.module.css'
import {
  EyeFill,
  EyeSlashFill,
  XCircleFill,
  PlusCircleFill,
} from 'react-bootstrap-icons'
import { Formik, Field, Form, FieldArray } from 'formik'
import { cloneDeep } from 'lodash'
import {createReqObject} from "../../../../helpers/fetchHelpers";
import {submitChanges} from "../../../../helpers/fetchHelpers";
import {craftUserUrl} from "../../../../helpers/urlHelper";


const CertificatesInformationForm = ({ data }) => {
  let deletedData = [];

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      if(typeof datum.visibility == "number")
        datum.visibility = datum.visibility == 1
      else datum.visibility = datum.visibility ? 1 : 0;
      return datum
    })

    return newData
  }

  const onSubmit = async (values) => {
    const requestObj = createReqObject(data, transformData(values.certificates), deletedData);
    const url = craftUserUrl(1, "certificates");
    const responseObj = await submitChanges(url ,requestObj);
    console.log(responseObj);
    deletedData = [];
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ certificates: transformData(data) }}
      onSubmit={onSubmit}
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
                              onClick={() => arrayHelpers.insert(0, '')}
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
                                          arrayHelpers.remove(index);
                                          if(certificate.hasOwnProperty("id"))
                                            deletedData.push({name: certificate.certificate_name, id: certificate.id});
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
                                <td
                                  className={styles.visibilityCheckboxContainer}
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
