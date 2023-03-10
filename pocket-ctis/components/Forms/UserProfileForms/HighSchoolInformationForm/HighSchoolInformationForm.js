import styles from '../UserProfileFormStyles.module.css'
import { useState, useEffect } from 'react'
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import { Formik, Field, Form } from 'formik'
import { cloneDeep } from 'lodash'
import { fetchAllHighSchool } from '../../../../helpers/searchHelpers'
import {splitFields, submissionHandler} from "../../../../helpers/submissionHelpers";
import {createReqObject, submitChanges} from "../../../../helpers/fetchHelpers";
import {craftUserUrl} from "../../../../helpers/urlHelper";

const HighSchoolInformationForm = ({ data }) => {
  const [highSchools, setHighSchools] = useState([]);
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data);

  useEffect(() => {
    fetchAllHighSchool().then((res) => setHighSchools(res.data))
  }, [])

    const applyNewData = (data) => {
        setDataAfterSubmit(data);
    }

    let deletedData = [];

  const transformData = (data) => {
    let newData = cloneDeep(data);
      if(newData.length > 0 && newData[0].high_school == ''){
          newData = [];
      }
    newData = newData.map((datum) => {
        datum.visibility = datum.visibility == 1
        datum.high_school = `${datum.high_school_id}-${datum.high_school_name}`

      return datum
    })

    return newData
  }

  const transformDataForSubmission = (newData) => {
      if(newData.high_school.length > 0){
          if(newData.high_school[0].high_school ==''){
              newData.high_school = [];
          }
          else{
              newData.high_school[0].visibility = newData.high_school[0].visibility ? 1 : 0;
              splitFields(newData.high_school[0], ["high_school"]);
          }
      }
  }

  const onSubmit = async (values) => {
      console.log("---------------------------------")
      let newData = cloneDeep(values);
      transformDataForSubmission(newData);
      if(dataAfterSubmit.length > newData.high_school.length)
          deletedData.push({name: dataAfterSubmit[0].id, id: dataAfterSubmit[0].id, data: dataAfterSubmit[0]});

      const requestObj = createReqObject(dataAfterSubmit, newData.high_school, deletedData);
      console.log("req",requestObj);
      const url = craftUserUrl(1, "highschool");
      const responseObj = await submitChanges(url ,requestObj);
      console.log("res", responseObj);

      const args = [[], ["high_school"],[], ["id", "user_id"], false]
      const new_data = submissionHandler(requestObj, responseObj, values, "high_school", args, transformDataForSubmission, transformData, dataAfterSubmit);
      console.log("this is where the error should be happening this should be normal first", new_data)
      new_data.high_school = transformData(new_data.high_school);
      if(new_data.high_school.length == 0)
          values.high_school = [];
      applyNewData(new_data.high_school);

      deletedData = [];
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          high_school: transformData(data),
        }}
        onSubmit={onSubmit}
      >
        {(props) => {
          return (
            <>
              <Form>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td>
                        <div className={styles.inputContainer}>
                          <label className={styles.inputLabel}>
                            High School
                          </label>
                          <Field
                            as='select'
                            name='high_school[0].high_school'
                            id='high_school[0].high_school'
                            className={styles.inputField}
                          >
                            <option selected value=''>
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
                      </td>
                      <td className={styles.visibilityCheckboxContainer}>
                        <Field name={`high_school[0].visibility`}>
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
    </>
  )
}

export default HighSchoolInformationForm
