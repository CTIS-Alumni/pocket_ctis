import styles from '../UserProfileFormStyles.module.css'
import { Formik, FieldArray, Form, Field } from 'formik'
import {
  EyeFill,
  EyeSlashFill,
  XCircleFill,
  PlusCircleFill, ToggleOn, ToggleOff,
} from 'react-bootstrap-icons'
import {cloneDeep} from 'lodash'
import { fetchAllSocieties } from '../../../../helpers/searchHelpers'
import { useState, useEffect } from 'react'
import {replaceWithNull, splitFields, submit} from "../../../../helpers/submissionHelpers";
import {createReqObject, submitChanges} from "../../../../helpers/fetchHelpers";
import {craftUserUrl} from "../../../../helpers/urlHelper";

const SocietiesInformationForm = ({ data }) => {
  const [societies, setSocieties] = useState([])
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data);

  useEffect(() => {
    fetchAllSocieties().then((res) => setSocieties(res.data))
  }, [])

  const applyNewData = (data) => {
    setDataAfterSubmit(data);
  }

  let deletedData = [];

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
        datum.visibility = datum.visibility == 1;
        datum.activity_status = datum.activity_status == 1;
      datum.society = `${datum.society_id}-${datum.society_name}`
      return datum
    })
    return newData
  }

  const transformDataForSubmission = (newData) => {
    newData.societies = newData.societies.map((val) => {
      val.visibility = val.visibility ? 1 : 0
      val.activity_status = val.activity_status ? 1 : 0;
      replaceWithNull(val)
      splitFields(val, ["society"]);
      return val;
    });
  }

  const onSubmit = async (values) => {
    let newData = cloneDeep(values);
    transformDataForSubmission(newData);

    const send_to_req = {societies: cloneDeep(dataAfterSubmit)};
    transformDataForSubmission(send_to_req);
    const requestObj = createReqObject(send_to_req.societies, newData.societies, deletedData);
    const url = craftUserUrl(1, "societies");
    const responseObj = await submitChanges(url ,requestObj);
    const args = [["society"], [], ["user_id", "id"], []];
    const new_data = submit(requestObj, responseObj, values, "societies", args, transformDataForSubmission);
    applyNewData(new_data);
    console.log("req,",requestObj, "res", responseObj);

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
                                          if(society.hasOwnProperty("id")){
                                            console.log(deletedData)
                                            deletedData.push({name: society.id, id: society.id, data: society});
                                          }

                                        }}
                                      >
                                        <XCircleFill
                                          size={13}
                                          className={styles.removeIcon}
                                        />
                                      </button>
                                      {society.id}
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
                                              {society.society_name}
                                            </option>
                                          ))}
                                        </Field>
                                      </div>
                                      <div
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                          }}
                                      >
                                        <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                        >
                                          <Field
                                              name={`societies[${index}]activity_status`}
                                              id={`societies[${index}]activity_status`}
                                          >
                                            {({ field, form, meta }) => {
                                              return (
                                                  <label
                                                      className={
                                                        styles.isCurrentCheckbox
                                                      }
                                                  >
                                                    {field.value ? (
                                                        <ToggleOn
                                                            size={25}
                                                            className={
                                                              styles.isCurrentTrue
                                                            }
                                                        />
                                                    ) : (
                                                        <ToggleOff size={25} />
                                                    )}
                                                    &nbsp; Are you active?
                                                    <input
                                                        type='checkbox'
                                                        {...field}
                                                        style={{
                                                          display: 'none',
                                                        }}
                                                    />
                                                  </label>
                                              )
                                            }}
                                          </Field>
                                        </div>
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
