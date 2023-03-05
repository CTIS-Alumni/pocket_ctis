import styles from '../UserProfileFormStyles.module.css'
import { Formik, FieldArray, Form, Field } from 'formik'
import {
  EyeFill,
  EyeSlashFill,
  XCircleFill,
  PlusCircleFill,
} from 'react-bootstrap-icons'
import { cloneDeep } from 'lodash'
import { fetchAllSocieties } from '../../../../helpers/searchHelpers'
import { useState, useEffect } from 'react'
import {splitFields} from "../../../../helpers/formatHelpers";
import {createReqObject, submitChanges} from "../../../../helpers/fetchHelpers";
import {craftUserUrl} from "../../../../helpers/urlHelper";

const SocietiesInformationForm = ({ data }) => {
  const [societies, setSocieties] = useState([])

  useEffect(() => {
    fetchAllSocieties().then((res) => setSocieties(res.data))
  }, [])

  let deletedData = [];

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
        datum.visibility = datum.visibility == 1;
      datum.society = `${datum.society_id}-${datum.society_name}`
      return datum
    })
    return newData
  }

  const onSubmit = async (values) => {
    //transform data
    let newData = cloneDeep(values);
    newData.societies = newData.societies.map((val) => {
      val.visibility = val.visibility ? 1 : 0
      val.activity_status = parseInt(val.activity_status) ? 1 : 0;
      splitFields(val, ["society"]);
      return val;
    })

    const requestObj = createReqObject(data, newData.societies, deletedData);
    const url = craftUserUrl(1, "userstudentsocieties");
    const responseObj = await submitChanges(url ,requestObj);
    console.log(responseObj);
    deletedData = [];
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ societies: transformData(data) }}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form>
          <table style={{ width: '100%' }}>
            <tbody>
              <FieldArray
                name='societies'
                render={(arrayHelpers) => {
                  return (
                    <>
                      <tr>
                        <td colSpan={3}>
                          <div
                            className={styles.formPartitionHeading}
                            style={{ marginTop: 0 }}
                          >
                            <span>Societies</span>
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
                      {props.values.societies &&
                      props.values.societies.length > 0 ? (
                        props.values.societies.map((society, index) => {
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
                                          if(society.hasOwnProperty("id"))
                                            deletedData.push({name: society.id, id: society.id});
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
                                          Society Name
                                        </label>
                                        <Field
                                          as='select'
                                          className={styles.inputField}
                                          id={`societies[${index}]society`}
                                          name={`societies[${index}]society`}
                                        >
                                          <option disabled selected value=''>
                                            Please select a student society
                                          </option>
                                          {societies.map((society) => (
                                            <option
                                              value={`${society.id}-${society.society_name}`}
                                            >
                                              {society.society_name} -{' '}
                                              {society.description}
                                            </option>
                                          ))}
                                        </Field>
                                      </div>
                                      <div className={styles.inputContainer}>
                                        <label className={styles.inputLabel}>
                                          Activity Status
                                        </label>
                                        <Field
                                          as='select'
                                          className={styles.inputField}
                                          id={`societies[${index}]activity_status`}
                                          name={`societies[${index}]activity_status`}
                                        >
                                          <option disabled selected value=''>
                                            Please select Activity Status
                                          </option>
                                          <option value='1'>Active</option>
                                          <option value='0'>Inactive</option>
                                        </Field>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className={styles.visibilityCheckboxContainer}
                                >
                                  <Field name={`societies[${index}]visibility`}>
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
                              {props.values.societies.length - 1 > index && (
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
                              Add a Society
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

export default SocietiesInformationForm
